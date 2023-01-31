import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';
import { LoginComponent } from './login/login.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { IonicModule } from '@ionic/angular';
import { LinkedAccountsComponent } from './linked-accounts/linked-accounts.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ChatServicesService } from './chat-page/chat-services.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ShowgamesComponent } from './showgames/showgames.component';

@NgModule({
  declarations: [
    AppComponent,
    PrimaryHomePageComponent,
      LoginComponent,
      ProfilePageComponent,
      LinkedAccountsComponent,
      ChatPageComponent,
      NavbarComponent,
      ShowgamesComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicModule
  ],
  providers: [
    ChatServicesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
