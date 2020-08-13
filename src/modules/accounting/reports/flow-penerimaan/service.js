import {inject, Lazy} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {RestService} from '../../../../utils/rest-service';



const serviceUri = 'garment-unit-receipt-notes/laporan';
export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
    }
search(info) {
    console.log(info);
        var endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }
generateXls(unit,  category, dateFrom, dateTo, unitname) { 
       console.log(unit,  category, dateFrom, dateTo);
        var endpoint = `${serviceUri}/download?unit=${unit}&category=${category}&unitname=${unitname}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        return super.getXls(endpoint);
    }
}
