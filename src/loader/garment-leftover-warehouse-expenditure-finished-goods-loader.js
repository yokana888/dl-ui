import { Container } from "aurelia-dependency-injection";
import { Config } from "aurelia-api";

const resource = "garment/leftover-warehouse-expenditures/finished-goods";

module.exports = function (keyword, filter) {
  var config = Container.instance.get(Config);
  var endpoint = config.getEndpoint("inventory-azure");

  return endpoint
    .find(resource, {
      keyword: keyword,
      filter: JSON.stringify(filter),
      size: 10,
    })
    .then((results) => {
      return results.data;
    });
};
