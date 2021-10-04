import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import moment from 'moment';


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
            this.data = data;
            this.data.date = moment(data.date).format("DD MMM YYYY HH:mm:ss");
        })
    }

    list()
    {
        this.router.navigateToRoute('list');
    } 
    
}
