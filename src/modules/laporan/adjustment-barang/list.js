import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';

var Storageloader = require('../../../loader/nstorage-loader')

@inject(Router, Service)
export class List {
    total;
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.storageId = "";
        // this.filter = "";  
    }

    get storageLoader(){
        return Storageloader;
    }

    columns = [
        {title: 'Toko', field: 'storageName'},
        {title: 'Tanggal', field: 'CreatedUtc'},
        {title: 'Barcode', field: 'item.code'},
        {title: 'Nama', field: 'item.name'},
        {title: 'Kuantitas', field: 'qtyAdjustment'},
        {title: 'Type', field: 'type'},
        {title: 'Keterangan', field: 'remark'}
    ]

    async activate() {
    }

    reloadItem() {
        this.tableData = [];

        this.total = 0;
        this.storageId = this.storage ? this.storage._id : "";

        this.service.getAdjustmentByStorageId(this.storageId)

            .then(result => {
                this.models.refresh();
                this.data = [];
                for (var data of result) {
                    for (var item of data.items) {
                        item.CreatedUtc = data.CreatedUtc.substring(0, 10);
                        item.storageName = data.storage.name;
                        this.total = this.total + item.qtyAdjustment;
                        this.tableData.push(item);
                    }
                }
            })
    }

    // view(data) { 
    //     this.router.navigateToRoute('view', { storageId: data.storageId, itemId: data.itemId });
    // } 
}
