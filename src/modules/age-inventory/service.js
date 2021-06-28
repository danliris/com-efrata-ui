import {inject, Lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {RestService} from '../../utils/rest-service';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const serviceUriStorages = 'inventories/monitoring';  

export class Service extends RestService{
  
  constructor(http, aggregator, config, api) {
    super(http, aggregator, config, "ncore");
  }  
  
  getAllInventory(storageId, filter)
  {
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("inventory").client.baseUrl + `${serviceUriStorages}/age?storageId=${storageId}&keyword=${filter}`; 
    return super.get(endpoint);
  }

  generateExcel(storageId, filter) {
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("inventory").client.baseUrl + `${serviceUriStorages}/age/download?storageId=${storageId}&keyword=${filter}`; 
    return super.getXls(endpoint);
}
  
 }