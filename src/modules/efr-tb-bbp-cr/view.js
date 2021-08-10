import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';


@inject(Router, Service)
export class View {
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    activate(params) {
        var id = params.id;
        this.service.getById(id)
        .then(data=>{
            let items = "";
            this.data = data;
            if(this.data.items && this.data.items.length > 0){
                for(let i = 0; i < this.data.items.length; i++){
                    let item = this.data.items[i].item;
                    let code = item.code;
                    
                    if(i < this.data.items.length - 1){
                        items += code+", ";
                    }else{
                        items += code;
                    }
                }
            }
            this.data.itemcode = items;
        })
    }

    list()
    {
        this.router.navigateToRoute('list');
    } 
    
}