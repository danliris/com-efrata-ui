import { RestService } from '../../../utils/rest-service';
import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

const serviceUri = 'finishing-outs';
const serviceUriFinIn = 'finishing-ins';
const serviceUriPR = 'garment-purchase-requests';
const comodityPriceserviceUri = 'comodity-prices';
const serviceUriStoreMaster = 'master/stores';

class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "garment-production");
    }

    search(info) {
        var endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    getComodityPrice(info) {
        var endpoint = `${comodityPriceserviceUri}`;
        return super.list(endpoint, info);
    }

    searchFinishingIn(info) {
        var endpoint = `${serviceUriFinIn}`;
        return super.list(endpoint, info);
    }

    searchFinishingInComplete(info) {
        var endpoint = `${serviceUriFinIn}/complete`;
        return super.list(endpoint, info);
    }

    GetFinishingInById(id) {
        var endpoint = `${serviceUriFinIn}/${id}`;
        return super.get(endpoint);
    }

    create(data) {
        var endpoint = `${serviceUri}`;
        return super.post(endpoint, data);
    }

    read(id) {
        var endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

    update(data) {
        var endpoint = `${serviceUri}/${data.Id}`;
        return super.put(endpoint, data);
    }

    delete(data) {
        var endpoint = `${serviceUri}/${data.Id}`;
        return super.delete(endpoint, data);
    }

    getPdfById(id,buyer) {
        var endpoint = `${serviceUri}/${id}/${buyer}`;
        return super.getPdf(endpoint);
    }

    getColors() {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("core");
        var uri = `articles/colors/all`;
        return endpoint.find(uri, {});
    }

    getStore(storeCode) {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("core").client.baseUrl + serviceUriStoreMaster + "/store-storage?code=" + `${storeCode}`
        return super.get(endpoint);
    }

    getDestinations() {
        var module = 'EFR-PK/PBJ';
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("ncore");
        var uri = `master/storages/destination?keyword=${module}`;
        return endpoint.find(uri);
    }
    
    getSources() {
        var module = 'EFR-PK/PBJ';
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("master");
        var uri = `master/storages/source?keyword=${module}`;
        return endpoint.find(uri);
    }
}

class PurchasingService extends RestService {
    constructor(http, aggregator, config, api) {
        super(http, aggregator, config, "purchasing-azure");
    }

    getGarmentPR(info) {
        var endpoint = `${serviceUriPR}`;
        return super.list(endpoint, info);
    }
}

class WarehouseService extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "inventory");
    }

    createSPKDocs(data) {
        var endpoint = 'spkdocs';
        return super.post(endpoint, data);
    }

    getSPKDocByFinishingOutIdentity(identity) {
        console.log('identity',identity)
        var endpoint = `spkdocs/FinishingOutIdentity/${identity}`;
        return super.get(endpoint);
    }
}

class MerchandiserService extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "nmerchandiser");
    }

    getCostCalculationGarmentByRO(info) {
        var endpoint = 'cost-calculation-garments/dynamic';
        return super.list(endpoint, info);
    }
}

export { Service,PurchasingService,WarehouseService,MerchandiserService }