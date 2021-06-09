import { inject, Lazy, useView } from 'aurelia-framework';
import { Service } from '.././service';
import { DialogController } from 'aurelia-dialog';

@inject(Service, DialogController)
@useView("modules/laporan/stock-availability/dialogs/check-nearest-stock-dialog.html")
export class FabricGradeTestEditor {

    data = {};
    dialogTableData = [];

    constructor(service, dialogController) {
        this.service = service;
        this.dialogController = dialogController;
    }

    activate(data, context) {
        this.context = context;
        this.data = data;
        this.total = 0;

        if(data.length != 0){
            this.showTable(data);
        } else {
            alert('Item Tidak Ditemukan Di Storage Terdekat')
            // this.dialogController.cancel();
        }
    }

    dialogTableOptions = {
        columns: [],
        search: false,
        showColumns: false,
        showToggle: false
    };

    showTable(result) {
        let tableHeader = [{ field: 'StorageCode', title: 'Kode Penyimpanan'}, { field: 'StorageName', title: "Name Penyimpanan"},
        { field: 'City', title: 'Kota' }, { field: 'LatestDate', title: 'Tanggal' }, { field: 'Quantity', title: 'Kuantitas' }]
        this.dialogTableOptions.columns = [];
        for (let header of tableHeader) {
            this.dialogTableOptions.columns.push(header);
        }
        this.dialogTableData = [];
        for (let inventory of result) {
            this.dialogTableData.push(inventory);
            this.total = this.total + inventory.Quantity;
        }

        this.title = result[0].ItemName;
    }

}   