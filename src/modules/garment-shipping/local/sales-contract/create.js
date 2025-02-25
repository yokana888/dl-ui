import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { activationStrategy } from 'aurelia-router';

@inject(Router, Service)
export class Create {
    isCreate = true;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    bind() {
        this.data = { Items: [] };
        this.error = {};
    }

    determineActivationStrategy() {
        return activationStrategy.replace; //replace the viewmodel with a new instance
        // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
        // or activationStrategy.noChange to explicitly use the default behavior
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    saveCallback(event) {

        for(var item of this.data.items) {
            //item.remainingQuantity=item.quantity;
            this.data.uom = item.uom;
            this.data.quantity = item.quantity;
            this.data.remainingQuantity = item.quantity;
            this.data.comodityName = item.comodityName;
            this.data.price = item.price;
            this.data.remark = item.remark;
        }

        this.service.create(this.data)
            .then(result => {
                alert("Data berhasil dibuat");
                this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
            })
            .catch(error => {
                this.error = error;

                this.error.items = [];
                this.error.items.push({
                    comodity : this.error.comodity,
                    quantity : this.error.quantity,
                    uom : this.error.uom,
                    price : this.error.price,
                });
            });
    }
}