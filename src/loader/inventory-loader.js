import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'inventory-loader/itemCode';

module.exports = function(keyword, filter) {

    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("inventory");

    return endpoint.find(resource, { keyword: keyword })
        .then(results => {
            return results.data.map(product => {
                product.code = product.item.code;
                product.name = product.item.name;
                return product;
            })
        });
}