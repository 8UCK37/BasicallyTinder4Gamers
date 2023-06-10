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
import { LinkedAccountsComponent } from './profile-page/linked-accounts/linked-accounts.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ChatServicesService } from './chat-page/chat-services.service';
import { NavbarComponent } from './navbar/navbar.component';
import { GamesComponent } from './profile-page/games/games.component';
import { ProfilePostComponent } from './profile-page/profile-post/profile-post.component';
import { FriendsComponent } from './profile-page/friends/friends.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppSearchComponent } from './navbar/app-search/app-search.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { TypeaheadModule} from 'ngx-bootstrap/typeahead';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SettingsComponent } from './settings/Settings.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginUserinfoComponent } from './primary-home-page/login-userinfo/login-userinfo.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PostComponent } from './post/post.component';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CommentComponent } from './comment/comment.component';
import { ToastModule } from 'primeng/toast';
import { GalleriaModule } from 'primeng/galleria';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { CreatePostModalComponent } from './utils/create-post-modal/create-post-modal.component';
import { MentionTextInputComponent } from './utils/mention-text-input/mention-text-input.component';
import { QuillModule } from "ngx-quill";
import { NotificationComponent } from './settings/notification/notification.component';
import { PostPageComponent } from './post/post-page/post-page.component';
import { ChatSettingsComponent } from './settings/chat-settings/chat-settings.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { FriendSuggestionComponent } from './friend-suggestion/friend-suggestion.component';
import { FriendSuggestionBoxComponent } from './friend-suggestion/friend-suggesstion-box/friend-suggestion-box/friend-suggestion-box.component';
import { WelcomeComponent } from './welcome/welcome.component';
@NgModule({
  declarations: [			
      AppComponent,
      PrimaryHomePageComponent,
      LoginComponent,
      ProfilePageComponent,
      LinkedAccountsComponent,
      ChatPageComponent,
      NavbarComponent,
      GamesComponent,
      ProfilePostComponent,
      FriendsComponent,
      AppSearchComponent,
      SettingsComponent,
      PrimaryHomePageComponent,
      LoginUserinfoComponent,
      PostComponent,
      CommentComponent,
      CreatePostModalComponent,
      MentionTextInputComponent,
      NotificationComponent,
      PostPageComponent,
      ChatSettingsComponent,
      PlayerStatsComponent,
      FriendSuggestionComponent,
      FriendSuggestionBoxComponent,
      WelcomeComponent
   ],
  imports: [
    SidebarModule,
    ToastModule,
    GalleriaModule,
    SpeedDialModule,
    DialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    ButtonModule,
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
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    QuillModule.forRoot(),
    MatSnackBarModule
  ],
  providers: [
    ChatServicesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
