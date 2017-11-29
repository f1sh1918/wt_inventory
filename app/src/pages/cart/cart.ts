import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Item} from '../../interfaces/item';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {AlertController, ModalController, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ApiProvider} from '../../providers/api';
import {TransactionPage} from '../transaction/transaction';
import {Costcenter} from '../../interfaces/costcenter';
import {Product} from "../../interfaces/product";


@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
})
export class CartPage {

    items: Item[] = [];
    costcenters: Costcenter[] = [];
    products: Product[] = [];

    // Lokalisierung
    amountTitle: string;
    kstTitle: string;
    priceTitle: string;
    amountText: string;
    buttonCancel: string;
    buttonConfirm: string;
    resetTitle: string;
    resetMessage: string;

    //testzwecke
    barcode: string = "BenQ BL2405";

    transactionSuccessText: string;
    errorText: string;
    updateSuccessText: string;


    constructor(private translateService: TranslateService,
                private barcodeScanner: BarcodeScanner,
                private alertCtrl: AlertController,
                private storage: Storage,
                private apiProvider: ApiProvider,
                private modalCtrl: ModalController,
                private toastCtrl: ToastController) {

        this.initialize();

        this.translateService.get('CART_AMOUNT').subscribe(value => this.amountTitle = value);
        this.translateService.get('CART_PRICE').subscribe(value => this.priceTitle = value);
        this.translateService.get('CART_KST').subscribe(value => this.kstTitle = value);
        this.translateService.get('CART_MSG_AMOUNT').subscribe(value => this.amountText = value);
        this.translateService.get('CANCEL').subscribe(value => this.buttonCancel = value);
        this.translateService.get('CONFIRM').subscribe(value => this.buttonConfirm = value);
        this.translateService.get('CART_MSG_RESET_TITLE').subscribe(value => this.resetTitle = value);
        this.translateService.get('CART_MSG_RESET_MESSAGE').subscribe(value => this.resetMessage = value);

        this.translateService.get('TRANSACTION_SUCCESS').subscribe(value => this.transactionSuccessText = value);
        this.translateService.get('LOGIN_MSG_ERROR_SUBTITLE').subscribe(value => this.errorText = value);
        this.translateService.get('UPDATE_SUCCESS').subscribe(value => this.updateSuccessText = value);

    }

    // Initialiere Items -> Wenn lokaler Speicher leer, zieht er einmalig die KST aus der CMDB
    initialize(): void {

        this.storage.get('costcenters')
            .then(costcenters => {
                    if (costcenters) {
                        this.costcenters = costcenters;
                    }
                    else {
                        this.costcenters = [];
                        this.refresh();
                    }
                }
            );



        this.storage.get('inventory')
            .then(items => {
                if (items) {
                    this.items = items;
                } else {
                    this.items = [];
                }
            });

        this.refreshProducts();






    }

  scanBarcode(): void {

        const options: BarcodeScannerOptions = {
            showTorchButton: true,
        };

        this.barcodeScanner.scan(options).then((barcodeData) => {
            let modal = this.modalCtrl.create(TransactionPage, {barcode: barcodeData.text, costcenters: this.costcenters, products:this.products});
            modal.onDidDismiss(item => {
                if (item) {
                    this.items.push(item);
                    this.storage.set('inventory', this.items);
                }
            });
            modal.present();

        }, (error) => {
            console.log(error);
        });

    }



    removeItem(item: Item): void {
        this.items = this.items.filter(i => i.name !== item.name && i.amount !== item.amount);
    }

    sendItems(): void {

        if (!this.items || this.items.length === 0) {
            return;
        }

        this.apiProvider.sendTransaction(this.items)
            .then(() => {

                this.items = [];
                this.storage.set('inventory', []);

                const toast = this.toastCtrl.create({
                    message: this.transactionSuccessText,
                    duration: 3000
                });
                toast.present();

            })
            .catch(error => {
                console.log(error);
                this.showError();
            })

    }

    resetItems(): void {

        if (!this.items || this.items.length === 0) {
            return;
        }

        // Alarm-Dialog erstellen
        let alert = this.alertCtrl.create({
            title: this.resetTitle,
            message: this.resetMessage,
            buttons: [
                {
                    text: this.buttonCancel,
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: this.buttonConfirm,
                    handler: () => {
                        this.items = [];
                        this.storage.set('inventory', []);
                    }
                }
            ]
        });

        // Alarm-Dialog anzeigen
        alert.present();

    }

    refresh(): void {

        this.apiProvider.getCostCenters()
            .then(costcenters => {

                this.costcenters = costcenters;
                this.storage.set('costcenters', this.costcenters);

                let toast = this.toastCtrl.create({
                    message: this.updateSuccessText,
                    duration: 3000
                });
                toast.present();

            })
            .catch(error => {
                console.log(error);
                this.showError();
            });

    }

    refreshProducts(): void{
        this.apiProvider.getProducts()
            .then(products => {

                this.products = products;
                this.storage.set('products', this.products);

            })
            .catch(error => {
                console.log(error);
                this.showError();
            });
    }


    showError(): void {
        let toast = this.toastCtrl.create({
            message: this.errorText,
            duration: 3000
        });
        toast.present();
    }

}
