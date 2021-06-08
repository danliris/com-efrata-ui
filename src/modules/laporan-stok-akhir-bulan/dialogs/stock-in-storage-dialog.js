import { inject, Lazy } from 'aurelia-framework';
import { Service } from '.././service';
import { DialogController } from 'aurelia-dialog';

@inject(Service, DialogController)
export class StockInStorageDialog {

    data = {};
    dialogTableData = [];

    constructor(service, dialogController) {
        this.service = service;
        this.dialogController = dialogController;
    }

    activate(data, context) {
        this.context = context;
        this.data = data;
        this.showTable(data);
    }

    dialogTableColumns = [
        { field: 'number', title: 'No'},
        { field: 'ItemCode', title: 'Barcode'},
        { field: 'ItemName', title: 'Nama Barang'},
        { field: 'Quantity', title: 'Kuantitas'},
        { field: 'HPP', title: 'Total HPP'},
        { field: 'Sale', title: 'Total Harga Jual'},
    ]

    convertToLocaleString(array){
        for (var a of array){
            for (var prop of Object.getOwnPropertyNames(a)){
                a[prop] = a[prop].toLocaleString();  
            }
        }
        return array;
    }

    showTable(result) {
        let number = 0;
        result.items.forEach(item => {
            item.number = ++number;
            this.dialogTableData.push(item)
        })
    }

}   