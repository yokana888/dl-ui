import { inject, bindable, computedFrom } from 'aurelia-framework'
import { Service, CoreService } from './service';
import { debug } from 'util';

//var lotConfigurationLoader = require('../../../../loader/lot-configuration-loader');

var moment = require('moment');
var MaterialTypeLoader = require('../../../../loader/material-types-loader');

var ProductLoader = require('../../../../loader/product-azure-loader');

@inject(Service, CoreService)
export class DataForm {
    @bindable isCreate = false;
    @bindable isEdit = false;
    @bindable isView = false;
    @bindable readOnly;
    @bindable data = {};
    @bindable error;
    @bindable title;
    @bindable lotConfiguration;
    @bindable Input = [];
    @bindable processType;
    @bindable yarnType;
    @bindable count;
    @bindable isMixDrawing;
    @bindable showItemRegular;
    @bindable regularItems;
    @bindable lot;

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        editText: "Ubah",
        deleteText: "Hapus",
    };


    controlOptions = {
        label: {
            length: 2
        },
        control: {
            length: 5
        }
    }
    controlOptions3 = {
        label: {
            length: 1
        },
        control: {
            length: 5
        }
    }
    controlOptions2 = {
        label: {
            length: 4
        },
        control: {
            length: 7
        }
    }

    processTypeList = [
    ];
    yarnTypeList = [
        "",
        "PCP",
        "CMP",
        "CD",
        "CVC",
        "PE",
        "TENCEL",
        "CUPRO",
        "PC-P 45"
    ];


    constructor(service, coreService) {
        this.service = service;
        this.coreService = coreService;
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        this.data.Input = this.data.Input || [];
        this.isItemPolyster = false;
        this.processType = false;
        this.cottonLot = "";
        this.polyesterLot = "";
        this.coreService.getMachineTypes()
            .then(result => {
                if(this.data.ProcessType){
                    this.processTypeList=result;
                } else {
                    this.processTypeList.push("");
                    for(var list of result){    
                        this.processTypeList.push(list);
                }}
            });
        if (this.data.ProcessType) {
            this.processType = this.data.ProcessType;
        } 
        if (this.data.ProcessType == "Finish Drawing") {
            if (this.isMixDrawing == true) {
                this.showItemRegular = false;
                this.finishingDrawing = true;
                this.data.Items=[];
            } else {
                this.showItemRegular = true;
                this.finishingDrawing = false;
            }

        } else {
            if(this.data.ProcessType == 'Winding')
                this.data.Cone = 1.89;

            this.showItemRegular = true;
            this.finishingDrawing = false;
            this.isMixDrawing = false;
            this.data.IsMixDrawing = false;
        }

        if (this.data.YarnType){
            this.yarnType=this.data.YarnType;
            this.service.getLotByYarnType(this.yarnType, this.finishingDrawing).then(result => {
                if (result) {
                    if (!isMixDrawing || isMixDrawing == false) {
                        this.regularItems = result.CottonCompositions;
                        this.lot = result.LotNo;
                        this.data.LotId = result.Id;
                        this.data.LotNo = result.LotNo;
                    } else {
                        this.data.Items = result.CottonCompositions;
                        this.lot = result.LotNo;
                        this.data.LotId = result.Id;
                        this.data.LotNo = result.LotNo;
                    }
                } else {
                    this.error.YarnType = "Lot tidak ditemukan";
                    this.data.Items = null;
                    this.data.LotId = null;
                    this.data.LotNo = null;
                    this.cottonLot = null;
                }
            });
        }
    }

    inputInfo = {
        columns: [
            { header: "Nama Kapas", value: "product" },
            { header: "Komposisi(%)", value: "composition" },
        ],
    };

    mixDrawingColumns = {
        columns: [
            { header: "Jenis Material", value: "yarnItem" },
            { header: "Nomor Lot", value: "lotNoItem" },
            { header: "Komposisi(%)", value: "composition" },
        ],
        onAdd: function () {
            this.context.ItemsCollection.bind();
            this.data.Items.push({ yarnName: "", lotNo:"", composition: 0});
        }.bind(this)
    };


    processTypeChanged(n, o) {
        var selectedProcess = this.processType;
        this.data.ProcessType = selectedProcess;
        if (selectedProcess) {
            if (this.data.ProcessType == "Finish Drawing") {
                if (this.isMixDrawing == true) {
                    this.showItemRegular = false;
                    this.finishingDrawing = true;
                    this.data.Items=[];
                } else {
                    this.showItemRegular = true;
                    this.finishingDrawing = false;
                }

            } else {
                if(this.data.ProcessType == 'Winding')
                    this.data.Cone = 1.89;

                this.showItemRegular = true;
                this.finishingDrawing = false;
                this.isMixDrawing = false;
                this.data.IsMixDrawing = false;
            }

        }
    }

    isMixDrawingChanged(n, o) {
        if (this.isMixDrawing == true) {
            this.data.IsMixDrawing = true;
            this.showItemRegular = false;
            this.regularItems = [];
            this.lot = undefined;
            this.data.Items = [];
        } else {
            this.data.IsMixDrawing = false;
            this.showItemRegular = true;
        }
    }
    yarnTypeChanged(n, o) {
        var selectedProcess = this.yarnType;
        this.data.YarnType=selectedProcess;
        if (selectedProcess) {
            if (selectedProcess != "") {
                this.showItemRegular = true;
            } else {
                this.showItemRegular = false;
            }
            var yarn = selectedProcess;
            var isMixDrawing = this.isMixDrawing;
            this.service.getLotByYarnType(yarn, this.finishingDrawing).then(result => {
                if (result) {
                    if (!isMixDrawing || isMixDrawing == false) {
                        this.regularItems = result.CottonCompositions;
                        this.lot = result.LotNo;
                        this.data.LotId = result.Id;
                        this.data.LotNo = result.LotNo;
                    } else {
                        this.data.Items = result.CottonCompositions;
                        this.lot = result.LotNo;
                        this.data.LotId = result.Id;
                        this.data.LotNo = result.LotNo;
                    }
                } else {
                    this.error.YarnType = "Lot tidak ditemukan";
                    this.data.Items = null;
                    this.data.LotId = null;
                    this.data.LotNo = null;
                    this.cottonLot = null;
                }
            });
        }
    }

    countChanged(n, o) {
        var selectedCount = this.count;
        this.data.Count = selectedCount;
        // if(selectedCount){
        //     this.service.getLotByYarnType(selectedCount, this.finishingDrawing).then(result => {
        //         if(result){
        //             this.data.items=result;
        //         } else {
        //             this.error.count = "Lot tidak ditemukan";
        //         }
        //     });
        // }
    }


    get yarnLoader() {
        return ProductLoader;
    }

    get materialTypeLoader() {
        return MaterialTypeLoader;
    }
} 