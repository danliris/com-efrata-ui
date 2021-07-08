import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const uriServices = "inventories/monitoring";

export class Service extends RestService {

    constructor(http, aggregator, config, api) {
        super(http, aggregator, config, "ncore");
    }
    
    getStokByRO(codeRO) {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("inventory").client.baseUrl + `${uriServices}/by-ro?ro=${codeRO}`;
        //var endpoint = config.getEndpoint("inventory").client.baseUrl + uriServices + "/" + codeRO;
        return super.get(endpoint);
    }

    generateXls(codeRO) {
        var config = Container.instance.get(Config);
        var endpoint = config.getEndpoint("inventory").client.baseUrl + `${uriServices}/by-ro/download?ro=${codeRO}`;
        //var endpoint = config.getEndpoint("inventory").client.baseUrl + `${uriServices}/`
        return super.getXls(endpoint);
    }
}