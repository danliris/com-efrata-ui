import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class Create {

    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = { items: [] };
        console.log(this.data);
    }

    activate(params) {

    }

    list() {
        this.router.navigateToRoute('list');
    }

    save() {
        this.data.destinationId = this.data.destination._id;
        this.data.sourceId = this.data.source._id;

        console.log(JSON.stringify(this.data));
        let error = {
            items : []
        }
        for(let i = 0; i < this.data.items.length; i++){
            let d = this.data.items[i];
            if(d.sendquantity == 0 || d.quantity == 0){
                const errObj = {
                    quantity: 'Jumlah barang yang dikirim harus lebih besar dari 0'
                }
                error.items.push(errObj);
            }
        }

        if(error.items.length > 0){
            this.error = error;
            error = {
                items : []
            }
        }else{
            this.service.create(this.data)
                .then(result => {
                    this.list();
                })
                .catch(e => {
                    this.error = e;
                })   
        }
    }
    saveDraft() {
        this.data.destinationId = this.data.destination._id;
        this.data.sourceId = this.data.source._id;
        this.service.createDraft(this.data)
            .then(result => {
                this.list();
            })
            .catch(e => {
                this.error = e;
            })
    }
}
