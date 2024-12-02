import { inject, bindable } from "aurelia-framework";
import { Service } from "./service";
import { Dialog } from "../../../au-components/dialog/dialog";
var bcnoLoader = require("../../../loader/traceable-out-bc-loader");

@inject(Service, Dialog)
export class List {
  info = { page: 1, size: 25 };
  constructor(service, dialog) {
    this.service = service;

    this.flag = false;
    this.dialog = dialog;
    this.today = new Date();
    this.error = {};
  }
  controlOptions = {
    label: {
      length: 4,
    },
    control: {
      length: 4,
    },
  };

  bind(context) {
    this.context = context;
  }

  bcTypeOptions = ["BC 27", "BC 25", "BC 41"];
  categoryOptions = [
    "BARANG JADI",
    "FABRIC/ACCESORIS",
    "AVAL",
    "MESIN",
    "JASA",
  ];

  attached() {}

  activate() {}

  searching() {
    if (!this.BCNo) {
      alert("No Dokumen harus Diisi");
    } else {
      let args = {
        bcno: this.BCNo,
        bcType: this.bcType,
        category: this.category,
      };
      this.service.search(args).then((result) => {
        this.rowCount = [];

        console.log(result);
        var datas = [];
        var datadetail = [];
        var index = 0;
        for (var _data of result.data) {
          var ro = _data.RO;

          if (_data.rincian != null) {
            for (var _data1 of _data.rincian) {
              datadetail.push(_data1);
            }
          }

          datas.push(_data);
        }

        this.data = datas;
        this.data2 = datadetail;
      });
    }
  }

  ExportToExcel() {
    {
      if (!this.BCNo) {
        console.log(this.BCNo);
        alert("No Dokumen harus Diisi");
      } else {
        var args = {
          bcno: this.BCNo ? this.BCNo : "",
          bcType: this.bcType,
          category: this.category,
        };

        this.service
          .generateExcel(args)

          // .catch(e => {
          //     alert(e.replace(e, "Error:",""));
          // });
          .catch((result) => {
            alert("Data Tidak Ditemukan.");
          });
      }
    }
  }

  reset() {
    this.BCNo = null;
    this.rojob = null;
    this.itemcode = null;
    this.comodity = null;
    this.bcType = null;
    this.category = null;
  }
  changePage(e) {
    var page = e.detail;
    this.info.page = page;
    this.searching();
  }

  get bcnoLoader() {
    return bcnoLoader;
  }
}
