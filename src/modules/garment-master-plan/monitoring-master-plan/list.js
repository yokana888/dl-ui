import { inject, computedFrom } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';

import "bootstrap-table";
import "bootstrap-table/dist/bootstrap-table.css";
import "bootstrap-table/dist/locale/bootstrap-table-id-ID.js";

import "./fixed-columns/bootstrap-table-fixed-columns";
import "./fixed-columns/bootstrap-table-fixed-columns.css";

var moment = require('moment');

var YearLoader = require('../../../loader/garment-master-plan-weekly-plan-year-loader');
var UnitLoader = require('../../../loader/weekly-plan-unit-loader');

@inject(Router, Service)
export class List {
  constructor(router, service) {
    this.service = service;
    this.router = router;
    
    this.onContentResize = (e) => {
      this.refreshOptionsTable();
    }

  }

  attached() {
    window.addEventListener("resize", this.onContentResize);
  }

  detached() {
    window.removeEventListener("resize", this.onContentResize);
  }

  controlOptions = {
    label: {
      length: 4
    },
    control: {
      length: 5
    }
  }

  get yearLoader() {
    return YearLoader;
  }
  yearView = (year) => {
    return `${year.year}`
  }
  get unitLoader() {
    return UnitLoader;
  }
  unitView = (unit) => {
    return `${unit.Code} - ${unit.Name}`
  }

  @computedFrom("year")
  get filterUnit() {
    if (this.year) {
      this.unit = "";
      return { "year": this.year.year }
    }
    else {
      return { "year": "" }
    }
  }

  searching() {

    if (!this.year) {
      alert("Tahun Harus Diisi");
    }
    else {
      var info = {
        year: this.year.year
      }
      if (this.unit) {
        info.unit = this.unit.Code
      }
      this.service.search(JSON.stringify(info))
        .then(result => {
          console.log(result)
          this.dataTemp = [];
          this.data = [];
          this.weeklyNumbers = 0;
          this.WeekQuantity = [];
          for (var pr of result) {
            this.weeklyNumbers = pr.items.map(value => { return value.weekNumber});
            this.weeklyEndDate = pr.items.map(value => { return moment(value.weekEndDate).format("DD MMM"); });
            break;
          }
          for (var pr of result) {
            pr.count=1;
            var dataTemp = {};
            dataTemp.backgroundColor = [];
            dataTemp.quantity = [];
            dataTemp.efficiency = [];
            dataTemp.unitBuyerQuantity = [];
            dataTemp.backgroundColorWH =[];
            //dataTemp.isConfirmed=[];
            dataTemp.units = pr.unit;
            dataTemp.buyer = pr.buyer;
            dataTemp.unitBuyer = pr.unit + ';' + pr.buyer;
            dataTemp.SMVTotal = pr.SMVSewing;
            dataTemp.dataCount = pr.count;
            dataTemp.operator = pr.items.map(value => { return value.head});
            dataTemp.workingHours = pr.items.map(value => { return value.workingHours});
            dataTemp.AH = pr.items.map(value => { return value.AHTotal});
            dataTemp.EH = pr.items.map(value => { return value.EHTotal});
            dataTemp.usedEH = pr.items.map(value => { return value.usedTotal});
            dataTemp.remainingEH = pr.items.map(value => { return value.remainingEH});
            dataTemp.dataCount = pr.count;
            dataTemp.WHBooking= pr.items.map(value => { return value.WHBooking});
            dataTemp.EHBooking= pr.UsedEH;
            for (var j = 0; j < pr.items.length; j++) {
              dataTemp.efficiency[j] = pr.items[j].efficiency.toString() + '%';
              dataTemp.backgroundColor[j] = dataTemp.remainingEH[j] > 0 ? "#FFFF00" :
                dataTemp.remainingEH[j] < 0 ? "#f62c2c" :
                  "#52df46";
            }

            for (var l = 0; l < pr.items.length; l++) {
              dataTemp.backgroundColorWH[l] = dataTemp.WHBooking[l] <= 45.5 ? "#FFFF00" : 
                dataTemp.WHBooking[l] < 50.5 && dataTemp.WHBooking[l] > 45.6 ? "#52df46" : 
                dataTemp.WHBooking[l] < 56.5 && dataTemp.WHBooking[l] > 50.6 ? "#f62c2c" :
                  "#000000";
            }
            dataTemp.weekSewingBlocking = pr.weekSewingBlocking;
            dataTemp.SMVSewings = pr.SMVSewing / pr.count;
            dataTemp.SMVSewingWeek = pr.weekSewingBlocking;
            dataTemp.bookingQty = pr.bookingQty;
            dataTemp.isConfirmed = pr.isConfirmed ? 1 : 0;
            for (var i = 0; i < this.weeklyNumbers.length; i++) {
              if (i + 1 === pr.weekSewingBlocking) {
                dataTemp.quantity[i] = pr.bookingQty;

              }
              else {
                dataTemp.quantity[i] = 0;
              }

            }
            dataTemp.bookingOrderItemsLength = pr.bookingOrderItems.length;
            dataTemp.bookingOrdersConfirmQuantity = pr.bookingOrderItems.reduce(
              (acc, cur) => acc + cur.ConfirmQuantity,
              0
            );
            dataTemp.bookingOrdersQuantity = pr.bookingOrdersQuantity;
          this.dataTemp.push(dataTemp);
          }
          //units
          var flags = [], output = [], l = this.dataTemp.length, i;
          for (i = 0; i < l; i++) {
            if (flags[this.dataTemp[i].units]) continue;
            flags[this.dataTemp[i].units] = true;
            output.push(this.dataTemp[i].units);

          }

          var flags = [], output2 = [], l = this.dataTemp.length, i;
          for (i = 0; i < l; i++) {
            if (flags[this.dataTemp[i].unitBuyer]) continue;
            flags[this.dataTemp[i].unitBuyer] = true;
            output2.push({ unit: this.dataTemp[i].units, buyer: this.dataTemp[i].buyer });

          }

          let cat = [];
          let category = [];
          let len = [];
          let bookingOrderItemsLength = [];
          let bookingOrdersConfirmQuantity = [];
          let bookingOrdersQuantity = [];
          for (var c of this.dataTemp) {
            var oye = {};
            if (!cat[c.units + c.buyer + c.weekSewingBlocking]) {
              cat[c.units + c.buyer + c.weekSewingBlocking] = c.bookingQty;
            }
            else {
              cat[c.units + c.buyer + c.weekSewingBlocking] += c.bookingQty;
            }

            // if (!category[c.units + c.buyer + c.weekSewingBlocking]) {
            //   category[c.units + c.buyer + c.weekSewingBlocking] = c.isConfirmed;
            // }
            // else {
            //   category[c.units + c.buyer + c.weekSewingBlocking] += c.isConfirmed;
            // }
            // if (!len[c.units + c.buyer + c.weekSewingBlocking]) {
            //   len[c.units + c.buyer + c.weekSewingBlocking] = 1;
            // }
            // else {
            //   len[c.units + c.buyer + c.weekSewingBlocking] += 1;
            // }
            // console.log(c.units + c.buyer + c.weekSewingBlocking, category[c.units + c.buyer + c.weekSewingBlocking], len[c.units + c.buyer + c.weekSewingBlocking]);

            if (!bookingOrderItemsLength[c.units + c.buyer + c.weekSewingBlocking]) {
              bookingOrderItemsLength[c.units + c.buyer + c.weekSewingBlocking] = c.bookingOrderItemsLength;
            }
            if (!bookingOrdersConfirmQuantity[c.units + c.buyer + c.weekSewingBlocking]) {
              bookingOrdersConfirmQuantity[c.units + c.buyer + c.weekSewingBlocking] = c.bookingOrdersConfirmQuantity;
            }
            if (!bookingOrdersQuantity[c.units + c.buyer + c.weekSewingBlocking]) {
              bookingOrdersQuantity[c.units + c.buyer + c.weekSewingBlocking] = c.bookingOrdersQuantity;
            }

            if (!cat[c.units + "TOTAL" + c.weekSewingBlocking]) {
              cat[c.units + "TOTAL" + c.weekSewingBlocking] = c.bookingQty;
            }
            else {
              cat[c.units + "TOTAL" + c.weekSewingBlocking] += c.bookingQty;
            }
            if (!cat[c.units + "WHConfirm" + c.weekSewingBlocking]) {
              if(c.isConfirmed)
                cat[c.units + "WHConfirm" + c.weekSewingBlocking] = c.EHBooking;
            }
            else {
              if(c.isConfirmed)
                cat[c.units + "TOTAL" + c.weekSewingBlocking] += c.EHBooking;
            }
            if (!cat[c.units + "smv" + c.buyer]) {
              cat[c.units + "smv" + c.buyer] = c.SMVSewings;
            }
            else {
              cat[c.units + "smv" + c.buyer] += c.SMVSewings;
            }
            if (!cat[c.units + "count" + c.buyer]) {
              cat[c.units + "count" + c.buyer] = c.dataCount;
            }
            else {
              cat[c.units + "count" + c.buyer] += c.dataCount;
            }

            if (!cat[c.units + "efisiensi"]) {
              cat[c.units + "efisiensi"] = c.efficiency;
            }
            if (!cat[c.units + "operator"]) {
              cat[c.units + "operator"] = c.operator;
            }
            if (!cat[c.units + "totalAH"]) {
              cat[c.units + "totalAH"] = c.AH;
            }
            if (!cat[c.units + "totalEH"]) {
              cat[c.units + "totalEH"] = c.EH;
            }
            if (!cat[c.units + "usedEH"]) {
              cat[c.units + "usedEH"] = c.usedEH;
            }
            
            if (!cat[c.units + "workingHours"]) {
              cat[c.units + "workingHours"] = c.workingHours;
            }
            if (!cat[c.units + "remainingEH"]) {
              cat[c.units + "remainingEH"] = c.remainingEH;
            }
            
            if (!cat[c.units + "WHBooking"]) {
              cat[c.units + "WHBooking"] = c.WHBooking;
            }
            if (!cat[c.units + "background"]) {
              cat[c.units + "background"] = c.backgroundColor;
            }
            if (!cat[c.units + "backgroundColorWH"]) {
              cat[c.units + "backgroundColorWH"] = c.backgroundColorWH;
            }
          }

          for (var j of output) {
            var data = {};
            data.units = j;
            data.collection = [];
            this.sewing = [];
            var un = this.dataTemp.filter(o => (o.units == j));

            var smvTot = 0;
            var counts = 0;
            for (var i of output2) {

              if (j == i.unit) {
                data.quantity = [];
                var background = [];
                for (var k = 0; k <= this.weeklyNumbers.length; k++) {
                  var categ = j + i.buyer + (k).toString();

                  if (k == 0) {
                    categ = (j + "smv" + i.buyer);
                    data.quantity[k] = (cat[j + "smv" + i.buyer] / cat[j + "count" + i.buyer]) ? Math.round((cat[j + "smv" + i.buyer] / cat[j + "count" + i.buyer])) : '-';
                    smvTot += Math.round(cat[j + "smv" + i.buyer] / cat[j + "count" + i.buyer]);
                    counts += 1;
                  } else {
                    data.quantity[k] = cat[categ] ? cat[categ] : '-';
                  }

                  // if (category[categ] == 0) {
                  //   background[k] = "#eee860";
                  // }
                  // else if (category[categ] == len[categ]) {
                  //   background[k] = "#ffffff";
                  // } else {
                  //   if (category[categ] != undefined) {
                  //     background[k] = "#F4A919";
                  //   }
                  // }

                  if (bookingOrderItemsLength[categ] === 0) {
                    background[k] = "#EEE860";
                  } else if (bookingOrderItemsLength[categ] > 0 && bookingOrdersConfirmQuantity[categ] < bookingOrdersQuantity[categ]) {
                    background[k] = "#F4A919";
                  } else {
                    background[k] = "transparent";
                  }

                }
                data.collection.push({ name: i.buyer, quantity: data.quantity, units: j, background: background, fontWeight: "normal" });
              }

            }
            var qty = [];
            var conf=[];
            var op=cat[j + "operator"];
            console.log(cat[j + "operator"])
            for (var y = 0; y < this.weeklyNumbers.length; y++) {

              var categ = j + "TOTAL" + (y + 1).toString();

              qty[y + 1] = cat[categ] ? cat[categ] : '-';

              qty[0] = Math.round(smvTot / counts);

              var categwh = j + "WHConfirm" + (y + 1).toString();
              //var op= cat[i.units + "operator"][y+1];
              conf[y + 1] = cat[categwh] ? cat[categwh]/op[y+1] : '-';

              conf[0] = "";

            }
            data.collection.push({ name: "TOTAL", quantity: qty, fontWeight: "bold" });
            var eff = cat[j + "efisiensi"];
            var opp = cat[j + "operator"];
            var AH = cat[j + "totalAH"];
            var EH = cat[j + "totalEH"];
            var usedEH = cat[j + "usedEH"];
            var remainingEH = cat[j + "remainingEH"];
            var WHBooking = cat[j + "WHBooking"];
            var background = cat[j + "background"];
            var workingHours = cat[j + "workingHours"];
            var backgroundColorWH = cat[j + "backgroundColorWH"];

            eff.splice(0, 0, "");
            opp.splice(0, 0, "");
            AH.splice(0, 0, "");
            EH.splice(0, 0, "");
            usedEH.splice(0, 0, "");
            remainingEH.splice(0, 0, "");
            WHBooking.splice(0, 0, "");
            workingHours.splice(0, 0, "");
            background.splice(0, 0, "");
            backgroundColorWH.splice(0, 0, "");
            data.collection.push({ name: "Efisiensi", quantity: eff, fontWeight: "bold" });
            data.collection.push({ name: "Total Operator Sewing", quantity: opp, fontWeight: "bold" });
            data.collection.push({ name: "Working Hours", quantity: workingHours, fontWeight: "bold" });
            data.collection.push({ name: "Total AH", quantity: AH, fontWeight: "bold" });
            data.collection.push({ name: "Total EH", quantity: EH, fontWeight: "bold" });
            data.collection.push({ name: "Used EH", quantity: usedEH, fontWeight: "bold" });
            data.collection.push({ name: "Remaining EH", quantity: remainingEH, background: background, fontWeight: "bold" });
            data.collection.push({ name: "WH Booking", quantity: WHBooking, background: backgroundColorWH, fontWeight: "bold" });
            data.collection.push({ name: "WH Confirm", quantity: conf, fontWeight: "bold" });

            this.data.push(data);
          }

          // console.log(JSON.stringify(this.data));

          var same = [];

          var columns = [
            {
              cellStyle: () => { return { classes: 'fixed' } },
              field: 'unit', title: 'UNIT'
            },
            {
              field: 'buyer', title: 'BUYER-KOMODITI', cellStyle: (value, row, index, field) => {
                return (row["buyer"] === "TOTAL" || row["smv"] === "") ?
                  { classes: 'fixed', css: { "font-weight": "bold" } } :
                  { classes: 'fixed' };
              }
            },
            {
              field: 'smv', title: 'SMV<br>Sewing', cellStyle: (value, row, index, field) => {
                return row["buyer"] === "TOTAL" ?
                  { classes: 'fixed', css: { "font-weight": "bold" } } :
                  { classes: 'fixed' };
              }
            },
          ];
          for (var i in this.weeklyNumbers) {
            columns.push({
              field: `W${this.weeklyNumbers[i]}`,
              title: `W${this.weeklyNumbers[i]}<br>${this.weeklyEndDate[i]}`,
              cellStyle: (value, row, index, field) => {
                if (row["buyer"] === "Remaining EH") {
                  return { css: { "font-weight": "bold", "background": value.value > 0 ? "#FFFF00" : value.value < 0 ? "#f62c2c" : "#52df46" } }
                } else {
                  return { css: value.background ? { "background": value.background } : { "font-weight": "bold" } };
                }
              },
              formatter: (value, row, index, field) => {
                return value.value;
              }
            });
          };

          var data = [];
          for (var d of this.data) {
            for (var c of d.collection) {
              var rowData = { unit: d.units, buyer: c.name };
              for (var i in c.quantity) {
                if (i == 0) {
                  rowData["smv"] = c.quantity[i];
                } else {
                  rowData[`W${this.weeklyNumbers[i - 1]}`] = { value: c.quantity[i] };
                  if (c.background) {
                    rowData[`W${this.weeklyNumbers[i - 1]}`].background = c.background[i];
                  }
                }
              }
              data.push(rowData);
            }
          }

          var bootstrapTableOptions = {
            columns: columns,
            data: data,
            fixedColumns: true,
            fixedNumber: 3
          };
          if (data.length > 10) { // row > 10
            bootstrapTableOptions.height = $(window).height() - $('.navbar').height() - $('.navbar').height() - 25;
          }
          $(this.table).bootstrapTable('destroy').bootstrapTable(bootstrapTableOptions);

          var rowIndex = 0;
          var unitTemp = "";
          for (var d of this.data) {
            for (var c of d.collection) {
              if(unitTemp != d.units) {
                // $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "unit", rowspan: d.collection.length, colspan: 1 });
                var $fixedTableBodyColumns = $('.fixed-table-body-columns');
                this.mergeCells($fixedTableBodyColumns, { index : rowIndex, field: 0, rowspan: d.collection.length, colspan: 1 });
                unitTemp = d.units;
              }
              rowIndex++;
            }
          }

        });
    }
  }

  mergeCells($el, options) {
    var row = options.index,
        col = options.field,
        rowspan = options.rowspan || 1,
        colspan = options.colspan || 1,
        i, j,
        $tr = $el.find('tr'),
        $td;

    $td = $tr.eq(row).find('>td').eq(col);

    for (i = row; i < row + rowspan; i++) {
        for (j = col; j < col + colspan; j++) {
            $tr.eq(i).find('>td').eq(j).hide();
        }
    }

    $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
  }

  refreshOptionsTable() {
    var bootstrapTableOptions = {
      // columns: columns,
      // data: data,
      fixedColumns: true,
      fixedNumber: 3
    };
    var data = $(this.table).bootstrapTable('getData');
    if (data.length > 10) { // row > 10
      bootstrapTableOptions.height = $(window).height() - $('.navbar').height() - $('.navbar').height() - 25;
    }
    $(this.table).bootstrapTable('refreshOptions', bootstrapTableOptions);

    var rowIndex = 0;
    var unitTemp = "";
    for (var d of this.data) {
      for (var c of d.collection) {
        if(unitTemp != d.units) {
          // $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "unit", rowspan: d.collection.length, colspan: 1 });
          var $fixedTableBodyColumns = $('.fixed-table-body-columns');
          this.mergeCells($fixedTableBodyColumns, { index : rowIndex, field: 0, rowspan: d.collection.length, colspan: 1 });
          unitTemp = d.units;
        }
        rowIndex++;
      }
    }

  }
  
  ExportToExcel() {
    if (!this.year) {
      alert("Tahun Harus Diisi");
    }
    else {
      var info = {
        year: this.year.year
      }
      if (this.unit) {
        info.unit = this.unit.Code
      }
      this.service.generateExcel(JSON.stringify(info));
    }
  }

  reset() {
    this.code = "";
    this.year = "";

  }
}
