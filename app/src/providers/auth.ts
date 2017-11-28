import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Auth} from "../interfaces/auth";

@Injectable()
export class AuthProvider {

    // API-URL Intern
  //  public apiUrl = 'http://172.18.100.71:12345';
    //DMZ URL
   public apiUrl = 'http://194.156.206.161:12345';

    constructor(private http: HttpClient) {
    }

    login(username: string, password: string): Promise<boolean> {

        // Suffix an URL anhängen
        const url = `${this.apiUrl}/authenticate`;

        return this.http.post(url, JSON.stringify({username: username, password: password}))
            .toPromise()
            .then(response => {

                // Versuchen Antwort in Auth-Objekt zu parsen
                let auth = response['data'] as Auth;

                // Prüfen ob parsen erfolgreich und Token vorhanden
                if (auth && auth.authToken) {
                    // -(ja)-> Zugang erteilt zurückgeben
                    localStorage.setItem('inventoryUser', JSON.stringify(auth));
                    return true;
                }

                // -(nein)-> Zugang verweigert zurückgeben
                return false;

            })
            .catch(this.handleError);


    }

    // Lokales Token löschen
    logout(): void {
        if (localStorage.getItem('inventoryUser')) {
            localStorage.removeItem('inventoryUser');
        }
    }

    // Fehler ausgeben und Misserfolg zurückgeben
    private handleError(error: any): Promise<any> {
        console.error('[AUTH]: ', error);
        return Promise.reject(error.message || error);
    }

}
