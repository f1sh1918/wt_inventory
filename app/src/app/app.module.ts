import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import {FormsModule} from '@angular/forms';
import {CartPage} from '../pages/cart/cart';
import {LoginPage} from '../pages/login/login';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {AuthProvider} from '../providers/auth';
import {ApiProvider} from '../providers/api';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TransactionPage} from '../pages/transaction/transaction';
import {SearchPage} from '../pages/search/search';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        MyApp,
        LoginPage,
        CartPage,
        TransactionPage,
        SearchPage
    ],
    entryComponents: [
        MyApp,
        LoginPage,
        CartPage,
        TransactionPage,
        SearchPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        BarcodeScanner,
        AuthProvider,
        ApiProvider
    ],
    bootstrap: [IonicApp]
})
export class AppModule {
}
