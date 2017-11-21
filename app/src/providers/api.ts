import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Auth} from '../interfaces/auth';
import {Item} from '../interfaces/item';

@Injectable()
export class ApiProvider {

    // Zur Zeit authentifizierter Nutzer
    private currentUser: Auth;
    // API-URL
    private apiUrl = 'http://172.18.100.71:1234';
    // Http-Headers
    headers: HttpHeaders;

    constructor(private http: HttpClient) {
        // Nutzer holen
        this.currentUser = JSON.parse(localStorage.getItem('inventoryUser')) as Auth;
        // Header setzen
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.currentUser.token
        });
    }

    getItems(): Promise<Item[]> {
        return Promise.resolve([]);
    }

    sendItems(items: Item[]): Promise<boolean> {
        return Promise.resolve(true);
    }

}
