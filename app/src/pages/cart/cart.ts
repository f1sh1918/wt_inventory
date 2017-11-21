import {Component} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Item} from "../../interfaces/item";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {AlertController, ModalController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {ApiProvider} from "../../providers/api";
import {TransactionPage} from "../transaction/transaction";
import {Costcenter} from "../../interfaces/costcenter";

@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
})
export class CartPage {

    items: Item[] = [];
    costcenters: Costcenter[] = [];

    // Lokalisierung
    amountTitle: string;
    amountText: string;
    buttonCheckIn: string;
    buttonCheckOut: string;
    buttonCancel: string;
    buttonConfirm: string;
    resetTitle: string;
    resetMessage: string;

    constructor(private translateService: TranslateService,
                private barcodeScanner: BarcodeScanner,
                private alertCtrl: AlertController,
                private storage: Storage,
                private apiProvider: ApiProvider,
                private modal: ModalController) {

        this.translateService.get('CART_AMOUNT').subscribe(value => this.amountTitle = value);
        this.translateService.get('CART_MSG_AMOUNT').subscribe(value => this.amountText = value);
        this.translateService.get('CART_CHECKIN').subscribe(value => this.buttonCheckIn = value);
        this.translateService.get('CART_CHECKOUT').subscribe(value => this.buttonCheckOut = value);
        this.translateService.get('CANCEL').subscribe(value => this.buttonCancel = value);
        this.translateService.get('CONFIRM').subscribe(value => this.buttonConfirm = value);
        this.translateService.get('CART_MSG_RESET_TITLE').subscribe(value => this.resetTitle = value);
        this.translateService.get('CART_MSG_RESET_MESSAGE').subscribe(value => this.resetMessage = value);

        this.storage.get('inventory')
            .then(items => {
                if (items) {
                    this.items = items;
                } else {
                    this.items = [];
                }
            });

    }


    scanBarcode(): void {

        const options: BarcodeScannerOptions = {
            showTorchButton: true,
        };

        this.barcodeScanner.scan(options).then((barcodeData) => {
            let modal = this.modal.create(TransactionPage, {barcode: barcodeData.text, costcenters: this.costcenters});
            modal.onDidDismiss(item => {
                if (item) {
                    this.items.push(item);
                }
            })
            modal.present();


        }, (error) => {
            console.log(error);
        });

    }


    removeItem(item: Item): void {
        this.items = this.items.filter(i => i.name !== item.name);
    }


    sendItems(): void {

        this.apiProvider.sendItems(this.items)
            .then(success => {

                console.log("Success");
            })
            .catch(error => {
                console.log(error);
                // TODO Alert
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
                    role: 'cancel'
                },
                {
                    text: this.buttonConfirm,
                    handler: () => {
                        this.items = []
                        this.storage.set('inventory', this.items);
                    }
                }
            ]
        });

        // Alarm-Dialog anzeigen
        alert.present();

    }

    refresh(): void {
    }

}
