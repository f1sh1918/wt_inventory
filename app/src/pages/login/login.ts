import {Component} from '@angular/core';
import {AlertController, Loading, LoadingController, NavController} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth';
import {TranslateService} from '@ngx-translate/core';
import {CartPage} from '../cart/cart';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    // Benutzerdaten
    username: string;
    password: string;
    // Ladebildschirm
    loading: Loading;

    // Lokalisierung
    loadingText: string;
    errorTitle: string;
    errorSubTitle: string;
    buttonOK: string;

    constructor(private navCtrl: NavController,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private authProvider: AuthProvider,
                private translateService: TranslateService) {

        // Lokalisierung laden
        this.translateService.get('LOGIN_MSG_LOADING').subscribe(value => this.loadingText = value);
        this.translateService.get('LOGIN_MSG_ERROR_TITLE').subscribe(value => this.errorTitle = value);
        this.translateService.get('LOGIN_MSG_ERROR_SUBTITLE').subscribe(value => this.errorSubTitle = value);
        this.translateService.get('OK').subscribe(value => this.buttonOK = value);

    }

    login(): void {
        // Prüfen ob Eingabe vollständig
        if (!this.username || this.username.trim() === '' || !this.password || this.password.trim() === '') {
            return;
        }
        // Ladebildschirm anzeigen
        this.showLoading();
        // Mit eingegebenen Daten versuchen an API anzumelden
        this.authProvider.login(this.username, this.password)
            .then(authenticated => {
                // Prüfen ob erfolgreich authentifiziert
                if (authenticated) {
                    // -(ja)-> zum Homescreen wechseln
                    // this.loading.dismiss();
                    this.navCtrl.setRoot(CartPage);
                } else {
                    // -(nein)-> Fehlermeldung anzeigen
                    this.showError();
                }
            })
            .catch(error => {
                // Keine Verbindung -> Fehlermeldung anzeigen
                this.showError();
            });
    }

    showLoading(): void {
        this.loading = this.loadingCtrl.create({
            content: this.loadingText,
            dismissOnPageChange: true
        });
        this.loading.present();
    }

    showError(): void {
        this.loading.dismiss();
        let alert = this.alertCtrl.create({
            title: this.errorTitle,
            subTitle: this.errorSubTitle,
            buttons: [this.buttonOK]
        });
        alert.present();
    }

}
