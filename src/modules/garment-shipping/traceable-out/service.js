import { inject, Lazy } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { RestService } from "../../../utils/rest-service";

const serviceUri = "garment-shipping/traceable-out";

export class Service extends RestService {
  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "packing-inventory");
  }

  search(info) {
    console.log(info);
    var endpoint = `${serviceUri}`;
    return super.list(endpoint, info);
  }

  generateExcel(info) {
    var endpoint = `${serviceUri}/download?bcno=${info.bcno}&bcType=${info.bcType}&category=${info.category}`;
    return super.getXls(endpoint);
  }
}
