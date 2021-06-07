import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../utils/rest-service';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const serviceUri = "inventories/monitoring/monthly-stock";

export class Service extends RestService {

    constructor(http, aggregator, config, api) {
        super(http, aggregator, config, "inventory");
    }

    getMonthlyOverallStock(month, year) {
        var endpoint = `${serviceUri}?month=${month}&year=${year}`;
        return super.get(endpoint);
    }

    getStockInStorage(storageCode, month, year) {
        var endpoint = `${serviceUri}/storage?code=${storageCode}&month=${month}&year=${year}`;
        return super.get(endpoint);
    }

    stockExcel(storageCode, month, year) {
        var endpoint = `${serviceUri}/download?code=${storageCode}&month=${month}&year=${year}`;  
        return super.getXls(endpoint);
    }
}