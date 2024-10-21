import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';


const serviceUri = 'garment-delivery-orders/monitoring/overbudget';

export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
    }

    search(args) {
        let endpoint = `${serviceUri}`;
       
        return super.list(endpoint, args);
    }

    generateExcel(epoNo, poNo, inNo) {
        var endpoint = `${serviceUri}/download?epoNo=${epoNo}&poNo=${poNo}&inNo=${inNo}`;
        return super.getXls(endpoint);
    }

}
