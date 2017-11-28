import {Component} from "@angular/core";
import {ModalController, NavController, NavParams, ToastController, ViewController} from "ionic-angular";
import {Costcenter} from "../../interfaces/costcenter";
import {SearchPage} from "../search/search";
import {Item} from "../../interfaces/item";

/**
 * Generated class for the TransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 navParams = app/transactions/?barcode="<value>"
 */


@Component({
    selector: 'page-transaction',
    templateUrl: 'transaction.html',
})
export class TransactionPage {
    amount: number = 0;
    barcode: string = "";
    costcenter: Costcenter={id:-1,kstnr:null,description:null};
    costcenters: Costcenter[];
    price: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, private viewContrl: ViewController, private modalContrl: ModalController, private toast:ToastController
    ) {
        if (navParams.get("barcode")) {
            this.barcode = navParams.get("barcode");
        }
        if (navParams.get("costcenters")) {
            this.costcenters = navParams.get("costcenters");
        }

    }

    dismiss(): void {
       this.viewContrl.dismiss();
}

    addItem(amount: number, price:number): void {
        if (!amount || amount == 0) {
            let toast= this.toast.create(
                {
                    message: 'Invalid amount',
                    duration: 3000,
                    position: 'bottom'
                });
            toast.present();

    }
      else if (!this.costcenter) {
            let toast= this.toast.create(
                {
                    message: 'Please choose a costcenter',
                    duration: 3000,
                    position: 'bottom'
        });
            toast.present();

        }
    else{

            const item: Item = {name: this.barcode, amount: amount, costcenter: this.costcenter, price:price};
            this.viewContrl.dismiss(item);
            let toast= this.toast.create(
                {
                    message: 'item added to basket',
                    duration: 3000,
                    position: 'bottom'
                });
            toast.present();
        }
    }

    searchKST(): void {
        let modal = this.modalContrl.create(SearchPage, {costcenters: this.costcenters});
        modal.onDidDismiss(costcenter => {
            if (costcenter) {
                this.costcenter = costcenter;
            }

        })
        modal.present();

    }

}
