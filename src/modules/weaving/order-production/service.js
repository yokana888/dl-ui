import { inject, Lazy } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { RestService } from "../../../utils/rest-service";

const serviceUri = "weaving/orders";

export class Service extends RestService {
  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "weaving");
  }

  search(info) {
    var endpoint = `${serviceUri}`;
    return super.list(endpoint, info);
  }

  getById(Id) {
    var endpoint = `${serviceUri}/${Id}`;
    return super.get(endpoint);
  }

  create(data) {
    var unit = data.WeavingUnit.Name;
    data.orderNumber = "";
    data.WeavingUnit = {};
    data.WeavingUnit._id = unit._id;
    data.WeavingUnit.Name = unit.Name;
    data.WeavingUnit.Code = unit.Code;
    if (data.YarnType == undefined || data.YarnType == null) {
      data.YarnType = " ";
    }
    var endpoint = `${serviceUri}`;
    return super.post(endpoint, data);
  }

  update(data) {
    var endpoint = `${serviceUri}/${data.Id}`;
    return super.put(endpoint, data);
  }

  delete(data) {
    var endpoint = `${serviceUri}/${data.Id}`;
    return super.delete(endpoint, data);
  }

  getByCode(code) {
    var endpoint = `${serviceUri}?keyword=${code}`;
    return super.get(endpoint);
  }
}
