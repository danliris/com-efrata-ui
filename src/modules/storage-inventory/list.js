import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';

var Storageloader = require('../../loader/nstorage-loader')

@inject(Router, Service)
export class List { 
    total;
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.storageId = "";
        this.itemCode = "";
        this.filter = "";  
    }

    // detail = ['view'];

    // columns = [
    //     {title: 'Barcode', field: 'ItemCode'}, 
    //     {title: 'Nama', field: 'ItemName'}, 
    //     {title: 'RO', field: 'ItemArticleRealizationOrder'},
    //     {title: 'Kuantitas', field: 'Quantity'},
    //     {title: 'Harga', field: 'ItemDomesticSale'},
    //     {title: 'Subtotal', field: 'subtotal'}
    // ]

    get storageLoader(){
        return Storageloader;
    } 

    async activate() { 
    }

    // convertToLocaleString(array) {
    //     for (var a of array) {
    //         for (var prop of Object.getOwnPropertyNames(a)) {
    //             a[prop] = a[prop].toLocaleString();
    //         }
    //     }
    //     return array;
    // }

    reloadItem() { 
        // this.tableData=[];
        this.total=0;
        this.totalharga=0;
        this.storageId= this.storage ? this.storage._id : "";
        this.filter = this.filter;
        this.service.getAllInventory(this.storageId, this.filter)
            .then(data => {

                // this.models.refresh();
                this.data = data;
                for (var item of this.data)
                {
                    // this.tableData.push(item);
                    item.subtotal=item.Quantity*item.ItemDomesticSale;
                    this.total=this.total+item.Quantity;
                    this.totalharga=this.totalharga+item.subtotal;
                }
            })
    }

    // contextCallback(event){
    //     var arg = event.detail;
    //     var data = arg.data;
    //     switch (arg.name) {
    //         case "view":
    //             this.view(data);
    //     }
    // }

    excel() {
        this.storageId= this.storage._id;
        this.service.generateExcel(this.storageId, this.filter)
            // .then(data => {
            //     this.data = data;
            // })
    }

    view(data) { 
        this.router.navigateToRoute('view', { storageId: data.StorageId, itemCode: data.ItemCode });
    } 
}
