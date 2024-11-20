import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
var moment = require('moment');
import numeral from 'numeral';
var UnitLoader = require('../../../loader/garment-units-loader');
var CategoryLoader = require('../../../loader/garment-category-loader');
var SupplierLoader = require('../../../loader/garment-supplier-loader');
var AccountLoader = require('../../../loader/garment-internal-purchase-orders-name-loader');

@inject(Router, Service)
export class List {

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }
    attached() {
    }

    activate() {
    }

    search(){
            this.searching();
    }
      
    searching() {
        let args = {
            epoNo : this.epoNo ? this.epoNo : "",
            poNo : this.poNo ? this.poNo : "",
            inNo : this.inNo ? this.inNo : "",
        };

        this.service.search(args)
            .then(result => {
                console.log(result.data);
                this.data = result.data;
                var index=1;
                for(var item of this.data)
                {
                    item.index=index;
                    index++;
                }
                
                this.fillTable();
            })
    }

    rowFormatter(data, index) {
    if (data.percentOB <= 0)
      return { classes: "default" }
    else
      return { classes: "danger" }
    }

    fillTable() {
        let columns = [
                { field:'index', title:'No', },
                { field: 'epoNo',  title: 'No PO External' },
                { field: 'orderDate',  title: 'Tgl PO External',
                  formatter: (value, data) => {
                  return moment(value).format("DD-MM-YYYY");
                  }
                },
                { field: 'supplierCode',  title: 'Kode Supl' },
                { field: 'supplierName',  title: 'Nama Supplkier' },

                { field: 'poNo',  title: 'No Ref PO' },
                { field: 'productCode',  title: 'Kode Barang' },
                { field: 'productName',  title: 'Nama Barang' },

                { field: 'poQuantity',  title: 'Jumlah PO Ext' },
                { field: 'doQuantity',  title: 'Jumlah Surat Jalan' },

                { field: 'obQuantity',  title: 'Jumlah OB' },
                { field: 'percentOB',  title: 'Jumlah OB (%)' },

                { field: 'doNo',  title: 'No Surat Jalan' },
                { field: 'doDate',  title: 'Tgl Surat Jalan' ,
                  formatter: (value, data) => {
                  return moment(value).format("DD-MM-YYYY");
                  }
                },
                { field: 'invoiceNo',  title: 'No Invoice' },
                { field: 'invoiceDate',  title: 'Tgl Invoice' ,
                  formatter: (value, data) => {
                  return moment(value).format("DD-MM-YYYY");
                  }
                },
                
                { field: 'inNo',  title: 'No Nota Intern' },
                { field: 'inDate',  title: 'Tgl Nota Intern' ,
                  formatter: (value, data) => {
                  return moment(value).format("DD-MM-YYYY");
                  }
                },
                { field: 'remark',  title: 'Keterangan Approval' },
        ];
    
        var bootstrapTableOptions = {
            undefinedText: '',
            columns: columns,
            data: this.data,
            rowStyle:this.rowFormatter
        };
        bootstrapTableOptions.width=$(window).width() - $('.sidebar').width()- 200;
        bootstrapTableOptions.height = $(window).height() - $('.navbar').height() - $('.navbar').height() - 25;
        $(this.table).bootstrapTable('destroy').bootstrapTable(bootstrapTableOptions);
    }

    reset() {
    this.epoNo = "",
    this.poNo = "",
    this.inNo = "",
    this.data = [];
    }

    exportToXls() {
        let args = {            
            epoNo : this.epoNo ? this.epoNo : "",
            poNo : this.poNo ? this.poNo : "",
            inNo : this.inNo ? this.inNo : "",
        };
        
        this.service.generateExcel(args.epoNo, args.poNo, args.inNo);
    }

    dateFromChanged(e) {
        var _startDate = new Date(e.srcElement.value);
        var _endDate = new Date(this.dateTo);
        this.dateMin = moment(_startDate).format("YYYY-MM-DD");

        if (_startDate > _endDate || !this.dateTo) {
            this.dateTo = e.srcElement.value;
        }
    }

}