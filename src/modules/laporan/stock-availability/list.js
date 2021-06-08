import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
var StorageLoader = require('../../../loader/nstorage-loader');
import { Dialog } from '../../../au-components/dialog/dialog';
import { FabricGradeTestEditor } from './dialogs/check-nearest-stock-dialog';

@inject(Router, Service, Dialog)
export class List {

    detail = ['Cek penyimpanan terdekat'];

    columns = [{ title: 'Barcode', field: "item.code" }, { title: 'Nama', field: "item.name" }, { title: 'Quantity', field: "quantity"}]

    constructor(router, service, dialog) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
        this.storageId = "";
    }

    activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
    }

    // columns = [{ field: 'item.code', title: 'Barcode' }, { field: 'item.name', title: 'Nama' }, { field: 'quantity', title: 'Kuantitas' }]

    // tableOptions = {
        
    //     search: false,
    //     showColumns: false,
    //     showToggle: false,
        
    // };

    get storageLoader() {
        return StorageLoader;
    }

    showItem() {
        this.tableData = [];
        
        let input = this.data;
        if (typeof input === "undefined" || input === null) {
            this.error = "Masukkan kode inventory yang ingin anda cari";
        } else {
            this.total=0;
            this.error = "";
            this.storageId = input ? input._id : "";
            this.service.getStorageInInventory(this.storageId)
                .then(result => {
                    this.models.refresh();
                    this.result = result;
                    for (var item of this.result)
                    {
                        this.tableData.push(item);
                        this.total=this.total+item.quantity;
                    }
                    console.log(this.tableData); 
                })
                .catch(e => {
                    this.error = e;
                })
        }
    }

    contextCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Cek penyimpanan terdekat":
                this.__checkNearestStockShowDialog(data);
        }
    }

    __checkNearestStockShowDialog(data) {
        this.error = "";
        let arg = {
            storageCode : data.storage.code,
            itemCode : data.item.code
        }
        this.service.getNearestStockInInventory(arg).then(result => {
            this.dialog.show(FabricGradeTestEditor, result);
        })
    }

}
