import {Component} from '@angular/core';
import {ModalController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {Costcenter} from '../../interfaces/costcenter';
import {SearchPage} from '../search/search';
import {Item} from '../../interfaces/item';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'page-transaction',
    templateUrl: 'transaction.html',
})
export class TransactionPage {

    amount: number = 0;
    barcode: string = '';
    costcenter: Costcenter = {
        id: -1,
        kstnr: null,
        description: null
    };
    costcenters: Costcenter[];
    price: number = 0.0;

    // Lokalisierung
    invalidAmount: string;
    invalidCostCenter: string;
    basketAdd: string;

    constructor(private navParams: NavParams,
                private viewCtrl: ViewController,
                private modalCtrl: ModalController,
                private toastCtrl: ToastController,
                private translateService: TranslateService) {

        if (this.navParams.get('barcode')) {
            this.barcode = this.navParams.get('barcode');
        }

        if (this.navParams.get('costcenters')) {
            this.costcenters = this.navParams.get('costcenters');
        }

        this.translateService.get('INVALID_AMOUNT').subscribe(value => this.invalidAmount = value);
        this.translateService.get('INVALID_COST_CENTER').subscribe(value => this.invalidCostCenter = value);
        this.translateService.get('ADDED_TO_BASKET').subscribe(value => this.basketAdd = value);

    }

    dismiss(item: Item): void {
        this.viewCtrl.dismiss(item);
    }

    addItem(): void {

        if (!this.amount || this.amount === 0) {
            this.showToast(this.invalidAmount);
            return;
        }

        if (!this.costcenter || this.costcenter.id === -1) {
            this.showToast(this.invalidCostCenter);
            return;
        }

        this.showToast(this.basketAdd);

        const item: Item = {
            name: this.barcode,
            amount: this.amount,
            costcenter: this.costcenter,
            price: this.price
        };
        this.dismiss(item);

    }

    searchCostCenter(): void {
        const modal = this.modalCtrl.create(SearchPage, {costcenters: this.costcenters});
        modal.onDidDismiss(costcenter => {
            if (costcenter) {
                this.costcenter = costcenter;
            }
        });
        modal.present();
    }

    private showToast(message: string): void {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }

}
