import { inject, bindable } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';

import moment from 'moment';

var SupplierLoader = require('../../../loader/garment-supplier-loader');
var AccountLoader = require('../../../loader/garment-product-loader');

@inject(Router, Service)
export class List {
    
    constructor(router, service) {
        this.service = service;
        this.router = router;
        this.today = new Date();
    }
   
    epoNo = null;   
    jnsSpl = false;
    supplierCode=null;    
    staffName = null;    
    dateFrom = null;
    dateTo = null;
    @bindable JenisSpl;
         
    SupplierType = ['LOCAL', 'IMPORT'];     
   
    get supplierLoader(){
        return SupplierLoader;
    }

    get accountLoader(){
        return AccountLoader;
    }

    JenisSplChanged(newvalue) {
        if (newvalue) {
            this.jnsSpl = newvalue === "LOCAL" ? false : true;          
        }
    }

    search(){
        
        this.error = {};

        if (!this.dateTo || this.dateTo == "Invalid Date")
            this.error.dateTo = "Tanggal Akhir harus diisi";

        if (!this.dateFrom || this.dateFrom == "Invalid Date")
            this.error.dateFrom = "Tanggal Awal harus diisi";

        if (Object.getOwnPropertyNames(this.error).length === 0) {
            this.flag = true;
            this.searching();
        }
    }

    searching() {
        {
            var info = {
            epoNo : this.epoNo ? this.epoNo : "",
            jnsSpl : this.jnsSpl ? this.jnsSpl : "",
            supplierCode : this.supplierCode ? this.supplierCode.code : "",           
            staffName : this.staffName ? this.staffName.userName : "",           
            dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
            dateTo : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : ""
        }
        console.log(info);
        this.service.search(info)
            .then(result => {
                  console.log(result);
                    var data=[];
                    var index = 1;
                    this.data = result.data;
                    for(var item of this.data)
                    {
                        item.index=index;
                        index++;
                    }

                      this.fillTable();
             });
        }
    }
    
    rowFormatter(data, index) {
    if (data.flagData == "R")
      return { classes: "danger" }
    else if (data.flagData == "Y")
      return { classes: "warning" }
    else if (data.flagData == "G")
      return { classes: "success" }
    else if (data.flagData == "B")
      return { classes: "info" }
    else
      return { classes: "default" }
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
                { field: 'deliveryDate',  title: 'Tgl Delivery',
                  formatter: (value, data) => {
                  return moment(value).format("DD-MM-YYYY");
                  }
                },
                
                { field: 'supplierCode',  title: 'Kode Supl' },
                { field: 'supplierName',  title: 'Nama Supplkier' },

                { field: 'prNo',  title: 'Nomor RO' },
                { field: 'poNo',  title: 'No Ref PO' },

                { field: 'paymentType',  title: 'Tipe Pembayaran' },
                { field: 'currencyCode',  title: 'Mata Uang' },
                { field: 'category',  title: 'Katagori' },

                { field: 'productCode',  title: 'Kode Barang' },
                { field: 'productName',  title: 'Nama Barang' },
                { field: 'productRemark',  title: 'Keterangan Barang' },

                { field: 'dealQuantity',  title: 'Jumlah PO Ext' },
                { field: 'uomUnit',  title: 'Satuan' },                
                { field: 'epoPrice',  title: 'Harga Barang' },
                { field: 'createdBy',  title: 'Staff Pembelian' },

                { field: 'doNo',  title: 'No Surat Jalan' },
                { field: 'doDate',  title: 'Tgl Surat Jalan'} ,
                //   formatter: (value, data) => {
                //   return moment(value).format("DD-MM-YYYY");
                //   }
                // },

                { field: 'arrivalDate',  title: 'Tgl Barang Datang' },
                //   formatter: (value, data) => {
                //   return moment(value).format("DD-MM-YYYY");
                //   }
                // },
                { field: 'doQuantity',  title: 'Jumlah Surat Jalan' },
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

    ExportToExcel() {
        this.error = {};

        if (!this.dateTo || this.dateTo == "Invalid Date")
            this.error.dateTo = "Tanggal Akhir harus diisi";

        if (!this.dateFrom || this.dateFrom == "Invalid Date")
            this.error.dateFrom = "Tanggal Awal harus diisi";

        if (Object.getOwnPropertyNames(this.error).length === 0) {
            var info = {
                epoNo : this.epoNo ? this.epoNo : "",
                jnsSpl : this.jnsSpl ? this.jnsSpl : "",
                supplierCode : this.supplierCode ? this.supplierCode.code : "",           
                staffName : this.staffName ? this.staffName.userName : "",           
                dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
                dateTo : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : ""
            }
            this.service.generateExcel(info);
        }
    }

    dateFromChanged(e) {
        var _startDate = new Date(e.srcElement.value);
        var _endDate = new Date(this.dateTo);
        this.dateMin = moment(_startDate).format("YYYY-MM-DD");

        if (_startDate > _endDate || !this.dateTo) {
            this.dateTo = e.srcElement.value;
        }
    }

     reset() {
        this.dateFrom = null;
        this.dateTo = null;
        this.staffName = null;
        this.jnsSpl = false;
        this.epoNo = null; 
        this.supplierCode = null;
        this.data = [];
    }

}