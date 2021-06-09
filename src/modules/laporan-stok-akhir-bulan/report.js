import { inject, Lazy, bindable } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import moment from 'moment';
import { Dialog } from '../../au-components/dialog/dialog';
import { StockInStorageDialog } from './dialogs/stock-in-storage-dialog';

@inject(Router, Service, Dialog)
export class Report {
    itemYears = [];
    detail = ['Detail', "Detail Excel"];
    tableData = [];
    usedMonth = {};
    usedYear = {};

    columns = [
        [{ title: 'Kode', rowspan: 2, valign: "middle", field: "StorageCode" }, { title: 'Toko', rowspan: 2, valign: "middle", field: "StorageName" }, { title: 'Saldo Awal', colspan: 3 }, { title: 'Saldo Akhir', colspan: 3 }],
        [{ title: 'Kuantitas', field: "EarlyQuantity" }, { title: 'HPP', field: "EarlyHPP" }, { title: 'Harga Jual', field: "EarlySale" }, { title: 'Kuantitas', field: "LateQuantity" }, { title: 'HPP', field: "LateHPP" }, { title: 'Harga Jual', field: "LateSale" }]
    ]

    controlOptions = {
        label: {
            length: 4,
        },
        control: {
            length: 4,
        },
    };

    constructor(router, service, dialog) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;

        this.itemMonths = [
            { text: 'January', value: 1 },
            { text: 'February', value: 2 },
            { text: 'March', value: 3 },
            { text: 'April', value: 4 },
            { text: 'May', value: 5 },
            { text: 'June', value: 6 },
            { text: 'July', value: 7 },
            { text: 'August', value: 8 },
            { text: 'September', value: 9 },
            { text: 'October', value: 10 },
            { text: 'November', value: 11 },
            { text: 'Desember', value: 12 }
        ];

        this.currentYear = moment().format('YYYY');
        for (var i = parseInt(this.currentYear); i >= 2017; i--) {
            this.itemYears.push(i.toString());
        }
    }

    async activate() {
        // let yearMonthsList = await this.service.getYearMonthsList()
        //     .then(result => {
        //         result.forEach(yearMonth => {
        //             this.yearMonths.push(yearMonth)
        //         });
        //     });
    }

    convertToLocaleString(array) {
        for (var a of array) {
            for (var prop of Object.getOwnPropertyNames(a)) {
                a[prop] = a[prop].toLocaleString();
            }
        }
        return array;
    }

    showMonthlyOverallStock() {
        this.tableData = [];
        let month = null;
        let year = null;

        if (this.info.month && this.info.year) {
            month = this.info.month.value;
            year = this.info.year;
        } else {
            month = new Date().getMonth();
            year = new Date().getFullYear();
        }

        this.service.getMonthlyOverallStock(month, year)
            .then(results => {
                results.forEach(item => {
                    this.tableData.push(item);
                })
                this.usedMonth = month;
                this.usedYear = year;
                this.models.refresh();
            })
            .catch(e => {
                this.error = e;
            })
    }

    contextCallback(event) {
        let arg = event.detail;
        let data = arg.data;
        switch (arg.name) {
            case 'Detail':
                this.checkStockInStorage(data);
                break;
            case "Detail Excel":
                this.excelStockInStorage(data);
                break;    
        }
    }

    excelStockInStorage(data) {
        let code = data.StorageCode;
        this.service.stockExcel(code, this.usedMonth, this.usedYear)    
    }

    checkStockInStorage(data) {
        //console.log(data);
        let code = data.StorageCode;
        this.service.getStockInStorage(code, this.usedMonth, this.usedYear).then(results => {
            //console.log(results);
            let storageItems = {};
            storageItems.code = results[0].StorageCode;
            storageItems.name = results[0].StorageName;
            storageItems.items = results;
            this.dialog.show(StockInStorageDialog, storageItems);
            //console.log(storageItems)
        })
    }
}
