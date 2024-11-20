import { inject, bindable } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';

import moment from 'moment';

var SupplierLoader = require('../../../loader/garment-supplier-loader');
var ProductLoader = require('../../../loader/garment-product-loader');

@inject(Router, Service)
export class List {
    
    constructor(router, service) {
        this.service = service;
        this.router = router;
        this.today = new Date();
    }
   
    category= " ";
    productCode = null;   
    productName = null;    
    supplierCode=null;    
    dateFrom = null;
    dateTo = null;
    @bindable KtgrItem;
         
    KategoriItem = ['','BAHAN BAKU', 'INTERLINING', 'BAHAN PENDUKUNG'];
   
    get supplierLoader(){
        return SupplierLoader;
    }

    get productLoader(){
        return ProductLoader;
    }

    KtgrItemChanged(newvalue) {
        if (newvalue) {
            if (newvalue === "BAHAN BAKU") {
                this.category = "FABRIC";
            }
            else if (newvalue === "INTERLINING") { 
                this.category = "INTERLINING"; 
            }
            else {
                this.category = "BAHAN PENDUKUNG"; 
            }
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
            category : this.category ? this.category : "",
            productCode : this.productCode ? this.productCode : "",
            productName : this.productName ? this.productName.Name : "",    
            supplierCode : this.supplierCode ? this.supplierCode.code : "",           
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
                        item.orderDate=moment(item.orderDate).format("DD MMM YYYY")=="01 Jan 1970"? "-" : moment(item.orderDate).format("DD MMM YYYY");
                        item.inDate=moment(item.inDate).format("DD MMM YYYY")=="01 Jan 1970"? "-" : moment(item.inDate).format("DD MMM YYYY");
                        item.invoiceDate=moment(item.invoiceDate).format("DD MMM YYYY")=="01 Jan 1970"? "-" : moment(item.invoiceDate).format("DD MMM YYYY");

                        item.epoQuantity=item.epoQuantity.toLocaleString('en-EN',{minimumFractionDigits: 2, maximumFractionDigits: 2});
                        item.epoprice=item.epoprice.toLocaleString('en-EN',{minimumFractionDigits: 2, maximumFractionDigits: 4});
                        item.rate=item.rate.toLocaleString('en-EN',{minimumFractionDigits: 2, maximumFractionDigits: 2});
                        item.amount=item.amount.toLocaleString('en-EN',{minimumFractionDigits: 2, maximumFractionDigits: 2});
                     }
             });
        }
    }
    
    ExportToExcel() {
        this.error = {};

        if (!this.dateTo || this.dateTo == "Invalid Date")
            this.error.dateTo = "Tanggal Akhir harus diisi";

        if (!this.dateFrom || this.dateFrom == "Invalid Date")
            this.error.dateFrom = "Tanggal Awal harus diisi";

        if (Object.getOwnPropertyNames(this.error).length === 0) {
            var info = {
                category : this.category ? this.category : "",
                productCode : this.productCode ? this.productCode : "",
                productName : this.productName ? this.productName.Name : "",    
                supplierCode : this.supplierCode ? this.supplierCode.code : "",           
                dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
                dateTo : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : ""
            }
            this.service.generateExcel(info);
        }
    }

     reset() {
        this.dateFrom = null;
        this.dateTo = null;
        this.productCode = null;
        this.productName = null;
        this.category = null; 
        this.supplierCode = null;
        this.data = [];
    }

}