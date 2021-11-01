import { inject, Lazy, bindable } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"
import { Item } from '../../expedition/payment-disposition-note/templates/item';
import { ItemFooter } from '../../accounting/others-expenditure-proof-document/templates/item-footer';

var Itemloader = require('../../../loader/finished-goods-loader')

@inject(Router, Service)
export class Report {
    @bindable productItem;

    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.reportHTML = "";
        this.code = "";
        this.color = "";
        this.imagePath = "";
        this.error = {};
        this.readOnly = true;
    }

    options = {
        columns: [],
        search: false,
        showToggle: false,
        showColumns: false,
        undefinedText: '0'
    };

    // columns = [
    //     { title: 'Toko', field: 'storageName' },
    //     { title: 'No RO', field: 'ro' },
    //     { title: 'Umur', field: 'age'},
    //     { title: 'Size', field: 'size'},
    //     { title: 'Stok', field: 'quantityOnInventory'},
    //     { title: 'Terjual', field: 'quantityOnSales' },
    //     { title: 'Total Stok', field: 'subTotalStock'},
    //     { title: 'Total Terjual', field: 'subTotalSales'},
    // ]

    // data = [];
    // show = false;

    productItemChanged(newValue, oldValue) {
        this.readOnlyCode = true;
        this.readOnlyColor = true;
        var config = Container.instance.get(Config);

        if (this.error.code) {
            this.error = {};
        }

        if (this.productItem) {
            var image = `${config.getEndpoint("ncore").client.baseUrl}items/finished-goods/${this.productItem._id}`;
            //var image = `${config.getEndpoint("master").client.baseUrl}items/finished-goods/${this.productItem._id}`;
            this.code = this.productItem.ArticleRealizationOrder ? this.productItem.ArticleRealizationOrder : null;
            this.color = this.productItem.color ? this.productItem.color : null;
            this.imagePath = this.productItem.ImagePath ? this.productItem.ImagePath : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY9Y3rGTwbyc9GoAOyxRClRz7b5GnCnjVsHx_qK_CUXN79yis4';
            // let reader = new FileReader();
            // reader.onload = event => {
            //     let base64Image = event.target.result;
            //     this.imagePath = this.data.imageSrc = base64Image;
            // }
            //reader.readAsDataURL(this.imageSrc);
        }
    }

    get itemLoader() {
        return Itemloader;
    }

    exportToExcel() {
        if (this.code === '') {
            this.error.code = "Masukkan kode Realisasi Order";
        } else {
            this.service.generateXls(this.code);
        }
    }

    // showSize(){
    //     // this.tableData = [];

    //     // let input = this.data;
    //     if (this.code === '') {
    //         this.error = "Masukkan kode Realisasi Order";
    //     } else {
    //         this.error = "";
    //         // this.code = input ? input.this.code : "";
    //         this.service.getStokByRO(this.code)
    //             .then(items => {
    //                     this.generateReportHTML(items);
    //                     if (items) {
    //                         this.show = true;
    //                     } else {
    //                         this.show = false;
    //                     }
    //                     // this.models.refresh();
    //                 })
    //                 .catch(e => {
    //                     this.error = e;
    //             }) 
    //     }
    // }

    showReport(){
        // this.tableData = [];

        // let input = this.data;
        if (this.code === '') {
            this.error = "Masukkan kode Realisasi Order";
        } else {
            this.error = "";
            // this.code = input ? input.this.code : "";
            this.service.getStokByRO(this.code)
                .then(items => {
                        // this.models.refresh();
                        this.data = items;

                        var dataByStorage = {};
                        // var subTotalStock = {};
                        // var subTotalSales = {};
                        var dataBySize = {};
                        var subSizeStock = {};
                        var subSizeTerjual = {};

                        for (var data of items){
                            var StorageName = data.storageName;
                            var Size = data.size;
                            if (!dataByStorage[StorageName]) dataByStorage[StorageName] = [];
                                dataByStorage[StorageName].push({
                                    storageName: data.storageName,
                                    itemCode: data.itemCode, 
                                    ro: data.ro,
                                    age: data.age,
                                    size: data.size,
                                    quantityOnInventory: data.quantityOnInventory,
                                    quantityOnSales: data.quantityOnSales,
                                    
                                });
                            
                            if (!dataBySize[Size]) dataBySize[Size] = [];
                                    dataBySize[Size].push({
                                    quantityOnInventory: data.quantityOnInventory,
                                    quantityOnSales: data.quantityOnSales,
                                });
                            
                                if (!subTotalStock[StorageName]){
                                    subTotalStock[StorageName] = 0;
                                }

                                if (!subTotalSales[StorageName]){
                                    subTotalSales[StorageName] = 0;
                                }

                                if (!subSizeStock[Size]){
                                    subSizeStock[Size] = 0;
                                }
                                
                                if (!subSizeTerjual[Size]){
                                    subSizeTerjual[Size] = 0;
                                }

                                subSizeStock[Size] += data.quantityOnInventory;
                                subSizeTerjual[Size] += data.quantityOnSales;
                                // subTotalStock[StorageName] += data.quantityOnInventory;
                                // subTotalSales[StorageName] += data.quantityOnSales;
                            }

                            var storages = [];
                            this.AmountTotal = 0;
                            this.AmountSales = 0;

                            for (var data in dataByStorage){
                                for (var dataSize in dataBySize){
                                    storages.push({
                                        data: dataByStorage[data],
                                        dataSize: dataBySize[dataSize],
                                        storage: dataByStorage[data][0].storageName,
                                        subSizeStock: (subSizeStock[dataSize]).toLocaleString('en-EN'),
                                        subSizeTerjual: (subSizeTerjual[dataSize]).toLocaleString('en-EN'),
                                        // subTotalStock: (subTotalStock[data]).toLocaleString('en-EN'),
                                        // subTotalSales: (subTotalSales[data]).toLocaleString('en-EN'),
                                    });
                                }
                                this.AmountTotal += subSizeStock[data];
                                this.AmountSales += subSizeTerjual[data];
                            }

                            this.storages = storages;
                            this.AmountTotal = this.AmountTotal.toLocaleString('en-EN');
                            this.AmountSales = this.AmountSales.toLocaleString('en-EN');
                            // var dataStorage = [];

                            // for (var data in dataBySize){
                            //     dataStorage.push({
                            //         dataStorage: this.storages,
                            //         subSizeTotal: (subSizeTotal[data]).toLocaleString('en-EN'), 
                            //     });
                            // }

                            // this.dataStorage = dataStorage;
                        })
                        .catch(e => {
                        this.error = e;
                }); 
        }
    }

    // generateTableInfo(size) {
    //     var tableHeader = [];
    //     var colHeaderOne = [];
    //     var colHeaderTwo = [];

    //     //initiate columns
    //     colHeaderOne.push({ title: "Toko", field: "storageName", rowspan: 2, valign: "middle", width: "200px" });
    //     // colHeaderOne.push({ title: "No RO", field: "ro", rowspan: 2, valign: "middle", align: "center"});

    //     for (var i = 0; i < size.length; i++) {
    //         var onInventory = size[i] + "onInventory";
    //         var onSales = size[i] + "onSales";

    //         //initiate columns
    //         var col = { title: size[i], colspan: 2 };

    //         var stok = { title: "Stok", field: onInventory, align: "center" };
    //         var stokOnSale = { title: "Stok Terjual", field: onSales, align: "center" };

    //         colHeaderOne.push(col);
    //         colHeaderTwo.push(stok);
    //         colHeaderTwo.push(stokOnSale);
    //     }

    //     colHeaderOne.push({ title: "Umur", field: "age", rowspan: 2, valign: "middle", align: "center" });
    //     colHeaderOne.push({ title: "Total Stok", field: "subTotalStock", rowspan: 2, valign: "middle", align: "center" });
    //     colHeaderOne.push({ title: "Total Stok Terjual", field: "subTotalSales", rowspan: 2, valign: "middle", align: "center" });

    //     tableHeader.push(colHeaderOne);
    //     tableHeader.push(colHeaderTwo);

    //     return tableHeader;
    // }

    // generateReportHTML(items) {
    //     var columns = []
    //     var size = [];
    //     var tempArr = [];
    //     this.data = [];
    
    //     for (var dataItem of items) {
    //         if (!this.data[dataItem.storageName]) {
    //             this.data[dataItem.storageName] = {};
    //             this.data[dataItem.storageName]["store"] = dataItem.storageName;
    //             // this.data[dataItem.storageName]["noRO"] = dataItem.ro;
    //             this.data[dataItem.storageName]['age'] = dataItem.age + " hari";
    //         }

    //         if (this.data[dataItem.storageName]) {
    //             if (!this.data[dataItem.storageName]["totalOnInventory"] && !this.data[dataItem.storageName]["totalOnSales"]) {
    //                 this.data[dataItem.storageName]["totalOnInventory"] = 0;
    //                  this.data[dataItem.storageName]["totalOnSales"] = 0;
    //             }
    //             this.data[dataItem.storageName]["totalOnInventory"] += dataItem.quantityOnInventory;
    //             this.data[dataItem.storageName]["totalOnSales"] += dataItem.quantityOnSales;
    //         }

    //         // if (this.data[dataItem.storageName]) {
    //         //     if (this.data[dataItem.size]) {
    //                 if (!this.data[dataItem.storageName]) {
    //                     if (!this.data[dataItem.size]) {
    //                         this.data[dataItem.size] = {};
    //                         this.data[dataItem.size]["onInventory"] = dataItem.quantityOnInventory;
    //                         this.data[dataItem.size]["onSales"] = dataItem.quantityOnInventory;
    //                     }
    //                 } else if (this.data[dataItem.storageName]) {
    //                     if (this.data[dataItem.size]) {
    //                         this.data[dataItem.size]["onInventory"] = dataItem.quantityOnInventory;
    //                         this.data[dataItem.size]["onSales"] = dataItem.quantityOnSales;
    //                     }
    //                 }
    //             // }
    //         // }

    //         if (size.indexOf(dataItem.size) === -1) {
    //             size.push(dataItem.size);
    //         }
    //     }
    //     var props = Object.getOwnPropertyNames(this.data);

    //     for (var i = 1; i < props.length; i++) {
    //         tempArr.push(this.data[props[i]]);
    //     }

    //     columns = this.generateTableInfo(size)
    //     this.data = tempArr;
    //     this.options.columns = columns;

    //     new Promise((resolve, reject) => {
    //         this.models.__table("refreshOptions", this.options);
    //         resolve();
    //     }).then(() => {
    //         this.models.refresh();
    //     });
    // }
}
