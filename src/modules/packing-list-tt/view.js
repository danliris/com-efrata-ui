import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import moment from 'moment';


@inject(Router, Service)
export class View {
    packingList = '';
    password = '';
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.printStruk = "";
        this.nomor=0;
    }
    

    activate(params) {
        var id = params.id;
        this.service.getById(id)
            .then(data => {
                this.data = data;
                this.totalQuantity = 0;
                this.totalPrice = 0;
                for (var item of this.data.items) {
                    item.totalPrice = parseInt(item.quantity * item.item.domesticSale);
                    this.totalQuantity += parseInt(item.quantity);
                    this.totalPrice += item.totalPrice;
                }

                this.data.date = moment(data.date).format("DD MMM YYYY HH:mm:ss");
                // this.generatePrintStrukTable();
            })
    }

    list() {
        this.router.navigateToRoute('list');
    }

    edit() {
        this.router.navigateToRoute('edit', { id: this.data._id });
    }

    delete() {
        this.service.delete(this.data)
            .then(result => {
                this.list();
            });
    }

    print() {
        this.service.getPdfById(this.data._id);
        //window.print();
    }

} 
