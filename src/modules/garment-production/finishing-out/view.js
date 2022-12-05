import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service,PurchasingService,WarehouseService } from './service';

@inject(Router, Service,PurchasingService,WarehouseService)
export class View {
    isView = true;
    constructor(router, service,purchasingService,warehouseservice) {
        this.router = router;
        this.service = service;
        this.purchasingService=purchasingService;
        this.warehouseservice = warehouseservice;
    }

    async activate(params) {
        let id = params.id;
        this.data = await this.service.read(id);
        const dataSPKDoc = await this.warehouseservice.getSPKDocByFinishingOutIdentity(id);
        
        if(dataSPKDoc.length > 0){
            this.data.SourceName = dataSPKDoc[0].SourceName;
            this.data.DestinationName = dataSPKDoc[0].DestinationName;
        }

        this.selectedRO={
            RONo:this.data.RONo
        };
        this.selectedUnitTo=this.data.UnitTo;
        this.selectedUnit=this.data.Unit;
        this.selectedFinishingTo=this.data.FinishingTo;
        for(var a of this.data.Items){
            if(a.RemainingQuantity != a.Quantity){
                this.deleteCallback = null;
                this.editCallback=null;
                break;
            }
        }
        this.editCallback=null;
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    editCallback(event) {
        this.router.navigateToRoute('edit', { id: this.data.Id });
    }

    deleteCallback(event) {
        if (confirm(`Hapus ${this.data.FinishingOutNo}?`))
            this.service.delete(this.data)
                .then(result => {
                    this.cancelCallback();
                })
                .catch(e => {
                    this.error = e;
                    if (typeof (this.error) == "string") {
                        alert(this.error);
                    } else {
                        alert("Missing Some Data");
                    }
                })
    }
}
