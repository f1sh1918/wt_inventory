import {Component} from "@angular/core";
import {ModalController, NavController, NavParams, ViewController} from "ionic-angular";
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
    costcenter: Costcenter;
    costcenters: Costcenter[];

    constructor(public navCtrl: NavController, public navParams: NavParams, private viewContrl: ViewController, private modalContrl: ModalController) {
        if (navParams.get("barcode")) {
            this.barcode = navParams.get("barcode");
        }
        if (navParams.get("costcenters")) {
            this.costcenters = navParams.get("costcenters");
        }

    }

    dismiss(amount: number): void {
        const item: Item = {name: this.barcode, amount: amount, costcenter: this.costcenter};
        this.viewContrl.dismiss(item);
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
