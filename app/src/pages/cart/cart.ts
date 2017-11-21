import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Item} from '../../interfaces/item';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ApiProvider} from '../../providers/api';

@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
})
export class CartPage {

    items: Item[] = [];

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
                private apiProvider: ApiProvider) {

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

            let alert = this.alertCtrl.create({
                title: this.amountTitle,
                message: this.amountText,
                inputs: [
                    {
                        name: 'amount',
                        placeholder: this.amountTitle,
                        type: 'number'
                    }
                ],
                buttons: [
                    {
                        text: this.buttonCheckOut,
                        handler: data => {
                            if (!data || !data.amount) {
                                return;
                            }
                            data = data.amount;
                            if (data > 0) {
                                data = data * -1;
                            }
                            this.additem(this.items.length, barcodeData.text, data);
                        }
                    },
                    {
                        text: this.buttonCheckIn,
                        handler: data => {
                            if (!data || !data.amount) {
                                return;
                            }
                            data = data.amount;
                            if (data < 0) {
                                data = data * -1;
                            }
                            this.additem(this.items.length, barcodeData.text, data);
                        }
                    }
                ]
            });
            alert.present();

        }, (error) => {
            console.log(error);
        });

    }

    removeItem(item: Item): void {
        this.items = this.items.filter(i => i.id !== item.id);
    }

    additem(id: number, name: string, amount: number): void {
        this.items.push({
            id: id,
            name: name,
            amount: amount
        });
        this.storage.set('inventory', this.items);
    }

    sendItems(): void {

        this.apiProvider.sendItems(this.items)
            .then(success => {
                // TODO Alert
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
