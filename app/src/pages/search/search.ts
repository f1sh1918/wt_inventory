import {Component} from "@angular/core";
import {NavController, NavParams, ViewController} from "ionic-angular";
import {Costcenter} from "../../interfaces/costcenter";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {
    costcenters: Costcenter[];
    filteredCostcenters: Costcenter[];

    constructor(public navCtrl: NavController, public navParams: NavParams, private viewContr: ViewController) {
        this.costcenters = this.navParams.get("costcenters");
        this.filteredCostcenters = this.costcenters;

    }

    dismiss(costcenter: Costcenter): void {
        this.viewContr.dismiss(costcenter);
    }

    getCostCenters(event: any) {
        let val = event.target.value;
        this.filteredCostcenters = this.costcenters.filter(c => c.kstnr.indexOf(val) > -1 || c.description.indexOf(val) > -1);
    }

}
