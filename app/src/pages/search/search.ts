import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {Costcenter} from '../../interfaces/costcenter';

@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {

    costcenters: Costcenter[];
    filteredCostcenters: Costcenter[];

    constructor(private navParams: NavParams, private viewCtrl: ViewController) {
        if (this.navParams.get('costcenters')) {
            this.costcenters = this.navParams.get('costcenters');
            this.filteredCostcenters = this.costcenters;
        }
    }

    dismiss(costcenter: Costcenter): void {
        this.viewCtrl.dismiss(costcenter);
    }

    getCostCenters(event: any) {
        let val = event.target.value;
        this.filteredCostcenters = this.costcenters.filter(c => c.kstnr.indexOf(val) > -1 || c.description.indexOf(val) > -1);
    }

}
