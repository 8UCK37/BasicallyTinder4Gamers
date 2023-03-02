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
import { ProfilePostComponent } from './profile-post/profile-post.component';
import { FriendsComponent } from './friends/friends.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppSearchComponent } from './navbar/app-search/app-search.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { TypeaheadModule} from 'ngx-bootstrap/typeahead';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FrindsprofileComponent } from './frinedsprofile/frindsprofile.component';
import { ShowfriendgamesComponent } from './showfriendgames/showfriendgames.component';
import { ShowfriendpostsComponent } from './showfriendposts/showfriendposts.component';
import { ShowfriendfriendlistComponent } from './showfriendfriendlist/showfriendfriendlist.component';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import { FriendlinkedacountComponent } from './friendlinkedacount/friendlinkedacount.component';
import { TagInputModule } from 'ngx-chips';
import { UtiliyTagComponent } from './primary-home-page/utiliyTag/utiliyTag.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SettingsComponent } from './settings/Settings.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [
      AppComponent,
      PrimaryHomePageComponent,
      LoginComponent,
      ProfilePageComponent,
      LinkedAccountsComponent,
      ChatPageComponent,
      NavbarComponent,
      ShowgamesComponent,
      ProfilePostComponent,
      FriendsComponent,
      AppSearchComponent,
      FrindsprofileComponent,
      ShowfriendgamesComponent,
      ShowfriendpostsComponent,
      ShowfriendfriendlistComponent,
      PendingRequestComponent,
      FriendlinkedacountComponent,
      UtiliyTagComponent,
      SettingsComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicModule,
    MatAutocompleteModule,
    FormsModule,
    TooltipModule.forRoot(),
    TypeaheadModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    TagInputModule,
    ReactiveFormsModule,
    PickerModule,
    CarouselModule.forRoot()
  ],
  providers: [
    ChatServicesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
