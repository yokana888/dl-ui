import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';

const serviceUri = 'garment-external-purchase-orders';

export class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
    }

    search(info) {
        let endpoint = `${serviceUri}/monitoring-price`;
        return super.list(endpoint, info);
    }

    generateExcel(info) {
        console.log(info);
        let endpoint = `${serviceUri}/monitoring-price/download?category=${info.category}&productCode=${info.productCode}&productName=${info.productName}&supplierCode=${info.supplierCode}&dateFrom=${info.dateFrom}&dateTo=${info.dateTo}`;
        return super.getXls(endpoint);
    }
}