import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


var Itemloader = require('../../loader/finished-goods-loader')
@inject(Router, Service)
export class List { 
    total;
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.filter = "";  
    }

columns = [{ title: 'Toko', field: 'StorageName'}, { title: 'Nama', field: 'ItemName'}, {title: 'Kuantitas', field: 'Quantity'}]

get itemLoader()
{
    return Itemloader;
}

itemView =(items) =>{
    return `${items.code}`-`${items.name}`
}


    async activate() { 
    }

    reloadItem() { 
        this.tableData = [];

        this.total=0;
        this.itemCode= this.item ? this.item.code :"";
        this.service.getAllInventorybyItemId(this.itemCode)
            .then(data => {
                this.models.refresh();
                this.data = data;
                for (var item of this.data)
                {
                    this.tableData.push(item);
                    this.total=this.total+item.Quantity;
                }
            })
    }

    reportExcel(){
        this.itemCode = this.item ? this.item.code :"";
        this.service.generateAllInventoryExcel(this.itemCode)
    }
}
