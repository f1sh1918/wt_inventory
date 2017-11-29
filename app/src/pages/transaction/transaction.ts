import {Component} from "@angular/core";
import {ModalController, NavParams, ToastController, ViewController} from "ionic-angular";
import {Costcenter} from "../../interfaces/costcenter";
import {SearchPage} from "../search/search";
import {Item} from "../../interfaces/item";
import {TranslateService} from "@ngx-translate/core";
import {Product} from "../../interfaces/product";
import {ApiProvider} from "../../providers/api";

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

   product: Product = {
        barcode: null,
        amount: null
    };
    costcenters: Costcenter[];
    price: number = 0.0;

    products: Product[];
    currentProduct: Product[];
    stock: number = 0;

    errorText: string;


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

        if (this.navParams.get('products')) {
            this.products = this.navParams.get('products');
        }
    //Holt den aktuellen Lagerbestand
        this.getStock();


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

        else {

            const item: Item = {
                name: this.barcode,
                amount: this.amount,
                costcenter: this.costcenter,
                price: this.price
            };
            this.viewCtrl.dismiss(item);
            let toast = this.toastCtrl.create(
                {
                    message: 'item added to basket',
                    duration: 2000,
                    position: 'bottom'
                });
            toast.present();

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



    getStock(): void {
        this.currentProduct = this.products.filter(c => c.barcode === this.barcode);
    }

    showError(): void {
        let toast = this.toastCtrl.create({
            message: this.errorText,
            duration: 3000
        });
        toast.present();
    }

}
