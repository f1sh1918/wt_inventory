import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Auth} from '../interfaces/auth';

import {Item} from '../interfaces/item';
import {AuthProvider} from './auth';
import {Costcenter} from '../interfaces/costcenter';
import {Product} from "../interfaces/product";

@Injectable()
export class ApiProvider {

    // Http-Headers
    headers: HttpHeaders;
    // Zur Zeit authentifizierter Nutzer
    private currentUser: Auth;

    constructor(private http: HttpClient, private auth: AuthProvider) {
        // Nutzer holen
        this.currentUser = JSON.parse(localStorage.getItem('inventoryUser')) as Auth;
        // Header setzen
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.currentUser.authToken
        });
    }

    // Kostenstellen-Stammdaten von API holen
    getCostCenters(): Promise<Costcenter[]> {

        const url = `${this.auth.apiUrl}/costcenters`;

        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => {

                let costcenters = response['data'] as Costcenter[];

                if (costcenters) {
                    return costcenters;
                }

                return [];

            })
            .catch(this.handleError);

    }

    // Produkte von API holen
    getProducts(): Promise<Product[]> {

        const url = `${this.auth.apiUrl}/products`;

        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => {

                let products = response['data'] as Product[];

                if (products) {
                    return products;

                }

                return [];

            })
            .catch(this.handleError);

    }

    sendTransaction(items: Item[]): Promise<boolean> {

        const url = `${this.auth.apiUrl}/transaction`;

        // Filtern der items in data
        const data = [];
        for (let item of items) {
            data.push({barcode: item.name, amount: item.amount, costcenterId: item.costcenter.id, price: item.price});
        }

        return this.http.post(url, {data: data}, {headers: this.headers})
            .toPromise()
            .then(response => {
                // response['data'] as boolean
                return true;
            })
            .catch(this.handleError);

    }

    // Fehler ausgeben und Misserfolg zurückgeben
    private handleError(error: any): Promise<any> {
        console.error('[API]: ', error);
        return Promise.reject(error.message || error);
    }

}
