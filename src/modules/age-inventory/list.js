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
        this.filter = "";  
    }

    async activate() { 
    }

    columns = [
        { title:'Barcode', field:'ItemCode'},
        { title:'Nama', field:'ItemName'},
        { title:'Kuantitas', field:'Quantity'},
        { title:'Umur', field:'DateDiff'},
    ]

    get storageLoader(){
        return Storageloader;
    }

    reloadItem() { 
        this.tableData = [];

        this.total=0;
        this.storageId= this.storage._id;
        this.service.getAllInventory(this.storageId, this.filter)
            .then(result => {
                this.models.refresh();
                this.result = result;
                // console.log(this.result);
                for (var item of this.result)
                {
                    this.tableData.push(item);
                    this.total=this.total+item.Quantity;
                }
            })
    }
    

    excel() {
        this.storageId= this.storage._id;   
        this.service.generateExcel(this.storageId, this.filter)
            // .then(result => {
            //     this.result = result;
            // })
    }
    // view(data) { 
    //     this.router.navigateToRoute('view', { storageId: data.storageId, itemId: data.itemId });
    // } 
}
