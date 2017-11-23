import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Auth} from "../interfaces/auth";

import {Item} from "../interfaces/item";
import {AuthProvider} from "./auth";
import {Costcenter} from "../interfaces/costcenter";


@Injectable()
export class ApiProvider {

    // Zur Zeit authentifizierter Nutzer
    private currentUser: Auth;
    // API-URL

    // Http-Headers
    headers: HttpHeaders;

    constructor(private http: HttpClient, private auth: AuthProvider) {
        // Nutzer holen
        this.currentUser = JSON.parse(localStorage.getItem('inventoryUser')) as Auth;
        // Header setzen
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.currentUser.authToken
        });
    }

    // CostCenter-Stammdaten von API holen

       getCostCenter(): Promise<Costcenter[]> {
            const url = `${this.auth.apiUrl}/costcenters`;
            return this.http.get(url, {headers: this.headers})
                .toPromise()
                .then(response => response.json().data as Costcenter[])
                .catch(null);
        }



    sendItems(items: Item[]): Promise<boolean> {
        const url = `${this.auth.apiUrl}/transaction`;
        //filtern der items in data
        const data = [];
        for (let item of items) {
            data.push({barcode: item.name, amount: item.amount, costcenterId: item.costcenter.id});
        }

        return this.http.post(url, {data: data}, {
            headers: this.headers
        }).toPromise().then(response =>

            true
        ).catch(error => false);

    }




}
