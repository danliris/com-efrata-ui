import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, WarehouseService, MerchandiserService } from './service';
import { activationStrategy } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service, WarehouseService, MerchandiserService)
export class Create {
    isCreate = true;
    constructor(router, service, warehouseservice, merchandiserservice) {
        this.router = router;
        this.service = service;
        this.warehouseservice = warehouseservice;
        this.merchandiserservice = merchandiserservice;

        this.service.getColors()
            .then(result => {
                this.article_colors = result.data;
                if (result.data && result.data.length > 0)
                    this.article_colors = result.data;
                
                console.log(this.article_colors)
            })
    }

    bind() {
        this.data = { Items: [] };
        this.error = {};
        // this.selectedUnit = null;
        // this.selectedRO = null;
    }

    determineActivationStrategy() {
        return activationStrategy.replace; //replace the viewmodel with a new instance
        // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
        // or activationStrategy.noChange to explicitly use the default behavior
        // return activationStrategy.invokeLifecycle;
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    saveCallback(event) {
        let e = [];
        const checkedItem = this.data.Items.filter(d => d.IsSave);
        
        if(checkedItem.length == 0){
            // e["Items"] = "Tidak ada Item yang dipilih"
            alert("Tidak ada Item yang dipilih");
            return;
        }
        if(this.data.Unit == undefined || this.data.Unit == ""){
            e["Unit"] = "Unit harus diisi"
        }
        if(this.data.FinishingTo == 'GUDANG JADI' && this.data.SourceStorageId == undefined || this.data.SourceStorageId == ""){
            e["source"] = "Sumber peyimpanan harus diisi"
        }
        if(this.data.FinishingTo == 'GUDANG JADI' && this.data.DestinationStorageId == undefined || this.data.DestinationStorageId == ""){
            e["destination"] = "Tujuan peyimpanan harus diisi"
        }
        if(this.data.Unit && this.data.RONo == undefined || this.data.RONo == ""){
            e["RONo"] = "RO harus diisi"
        }
        if(this.data.Unit && (this.data.FinishingOutDate == null || this.data.FinishingOutDate == undefined || this.data.FinishingOutDate == "")){
            e["FinishingOutDate"] = "Tanggal Finishing Out harus diisi"
        }
        
        if(checkedItem.length > 0){
            let countErr = checkedItem.filter(d => {
                if(d.IsDifferentSize){
                    if(d.Details.length == 0){
                        alert("Belum ada size yang ditambahkan");
                        return;
                    }
                    
                    let totalQty = 0;
                    d.Details.map(dd => {
                        totalQty += dd.Quantity;
                    })

                    return(
                        totalQty > d.FinishingInQuantity
                    )
                }else{
                    return(
                        d.Quantity > d.FinishingInQuantity
                    )
                }
            })
            if(countErr.length > 0){
                alert("Jumlah yang dikeluarkan tidak boleh lebih dari jumlah yang tersedia");
                return;
                // e["Items"] = "Jumlah yang dikeluarkan tidak boleh lebih dari jumlah yang tersedia"
            }
        }

        if (Object.keys(e).length > 0) {
            this.error = e;
        }else{
            this.error = [];
            this.data.FinishingInDate=null;

            if(this.data && this.data.IsDifferentSize){
                if(this.data.Items){
                    for(var item of this.data.Items){
                        if(item.IsSave){
                            if(this.data.FinishingInDate==null || this.data.FinishingInDate<item.FinishingInDate)
                                this.data.FinishingInDate=item.FinishingInDate;
                            item.TotalQuantity=0;
                            for(var detail of item.Details){
                                item.TotalQuantity += detail.Quantity;
                                detail.Uom=item.Uom;
                            }
                            item.RemainingQuantity=item.TotalQuantity;
                            item.Price=(item.BasicPrice + (item.ComodityPrice * 50/100)) * item.RemainingQuantity;
                            
                        }
                    }
                }
            }
            if(this.data&& !this.data.IsDifferentSize){
                if(this.data.Items){
                    for(var item of this.data.Items){
                        if(item.IsSave){
                            if(this.data.FinishingInDate==null || this.data.FinishingInDate<item.FinishingInDate)
                                this.data.FinishingInDate=item.FinishingInDate;
                            item.RemainingQuantity=item.Quantity;
                            item.Price=(item.BasicPrice + (item.ComodityPrice * 50/100)) * item.Quantity;
                        }
                    }
                }
            }

            this.data.FinishingOutDate = moment(this.data.FinishingOutDate).format("YYYY-MM-DD");

            const color = this.article_colors.find(d => d.name.toLowerCase().includes(this.data.Items[0].Color.toLowerCase()));

            this.data.color = color != undefined ? color : null;
            this.data.ImagePath = '';
            this.data.ImgFile = '';

            if(this.data.FinishingTo == 'GUDANG JADI'){
                const filter = {};
                const info = {
                    keyword: this.data.RONo,
                    filter: JSON.stringify(filter),
                    select: "new(ImagePath,RO_Number,CreatedUtc,SourceId,CategoryId,CategoryName,CategoryCode,"+
                    "SubCounterId,SubCounterName,SubCounterCode,CounterId,CounterName,CounterCode,SeasonId,SeasonName,"+
                    "SeasonCode,CollectionId,CollectionName,CollectionCode,MaterialCompositionId,MaterialCompositionName,"+
                    "MaterialCompositionCode,MaterialId,MaterialName,MaterialCode,ProcessId,ProcessName,ProcessCode)",
                };
                
                this.merchandiserservice.getCostCalculationGarmentByRO(info)
                    .then(results => {
                        const data = results.data;
                        console.log('data',JSON.stringify(data));
                        if(data.length > 0){
                            this.data.ImagePath = data[0].ImagePath;
                            this.data.RoCreatedUtc = moment(data[0].CreatedUtc).format("YYMM");
                            this.data.SourceId = data[0].SourceId;
                            this.data.process = {
                                _id: data[0].ProcessId,
                                code: data[0].ProcessCode,
                                name: data[0].ProcessName
                            };
                            this.data.materials = {
                                _id: data[0].MaterialId,
                                code: data[0].MaterialCode,
                                name: data[0].MaterialName
                            };
                            this.data.materialCompositions = {
                                _id: data[0].MaterialCompositionId,
                                code: data[0].MaterialCompositionCode,
                                name: data[0].MaterialCompositionName
                            };
                            this.data.collections = {
                                _id: data[0].CollectionId,
                                code: data[0].CollectionCode,
                                name: data[0].CollectionName
                            };
                            this.data.seasons = {
                                _id: data[0].SeasonId,
                                code: data[0].SeasonCode,
                                name: data[0].SeasonName
                            };
                            this.data.counters = {
                                _id: data[0].CounterId,
                                code: data[0].CounterCode,
                                name: data[0].CounterName
                            };
                            this.data.subCounters = {
                                _id: data[0].SubCounterId,
                                code: data[0].SubCounterCode,
                                name: data[0].SubCounterName
                            };
                            this.data.categories = {
                                _id: data[0].CategoryId,
                                code: data[0].CategoryCode,
                                name: data[0].CategoryName
                            };
                        }
                        
                        this.service.create(this.data)
                            .then(result => {
                                this.data.FinishingOutIdentity = result;
                                this.warehouseservice.createSPKDocs(this.data)
                                    .then(result => {
                                        alert("Data berhasil dibuat");
                                        this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
                                    })
                                    .catch(e => {
                                        this.error = e;
                                        if (typeof (this.error) == "string") {
                                            alert(this.error);
                                        } else {
                                            alert("Missing Some Data");
                                        }
                                    })
                            })
                            .catch(e => {
                                this.error = e;
                                if (typeof (this.error) == "string") {
                                    alert(this.error);
                                } else {
                                    alert("Missing Some Data");
                                }
                            })
                    });
            }else{
                this.service.create(this.data)
                    .then(result => {
                        alert("Data berhasil dibuat");
                        this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
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
    }
}