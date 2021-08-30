import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class Create {
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async bind() {
        this.data = { items: [] };
        this.error = { items: [] };
        this.expeditionServices = await this.service.getExpeditionServices();
    }

    dataChanged(newValue, oldValue) {
    }

    activate(params) {

    }

    list() {
        this.router.navigateToRoute('list');
    }

    save() {
        let saveItems = this.data.items.filter(d => d.quantity != undefined);
        this.data.items = saveItems;
        
        //cek total weight
        for(let i = 0; i < this.data.items.length; i++){
            if(this.data.items[i].weight === 0){
                alert('Berat tidak boleh 0');
                return;
            }
        }
        
        this.service.create(this.data)
            .then(result => {
                this.list();
            })
            .catch(e => {
                // debugger
                // console.log(this.error);
                // this.error = e;

                // for (var item in e.spkDocuments) {
                //     this.error.spkDocuments[item].code = e.spkDocuments[item].code;
                // }
                // console.log(this.error);
                this.error = e;
            })
    }
}
