import {Component} from '@angular/core';
import {Config, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';

import {LoginPage} from '../pages/login/login';
import {CartPage} from '../pages/cart/cart';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    // Standardmäßige Startseite
    rootPage: any = LoginPage;
    // Variable mit Sprachcode für Standardsprache
    private defaultLanguage: string = 'de';

    constructor(private platform: Platform,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                private translateService: TranslateService,
                private config: Config) {

        // Anwendung initialisieren
        this.initializeLocalization();
        this.initializeApp();

        // Überprüfung ob bereits Angemeldet -(ja)-> direkt zu HomePage weiterleiten
        if (localStorage.getItem('inventoryUser')) {
            this.rootPage = CartPage;
        }

    }

    // App initialisieren
    private initializeApp(): void {

        // Sobald Anwendung fertig geladen hat
        this.platform.ready().then(() => {

            // Statusbar anzeigen
            this.statusBar.styleDefault();
            // Splashscreen verbergen (zusätzliche Änderungen in config.xml)
            this.splashScreen.hide();

            // Lokalisierung für zurück-Button für iOS systemweit belegen
            this.translateService.get('BACK').subscribe(value => this.config.set('ios', 'backButtonText', value));

        });

    }

    // Lokalisierung initialisieren
    private initializeLocalization(): void {

        // Standardsprache festlegen
        this.translateService.setDefaultLang(this.defaultLanguage);

        // Sprache des Browsers ermitteln und diese als Sprache setzen
        if (this.translateService.getBrowserLang() !== undefined) {
            this.translateService.use(this.translateService.getBrowserLang());
        } else {
            this.translateService.use(this.defaultLanguage);
        }

    }

}

