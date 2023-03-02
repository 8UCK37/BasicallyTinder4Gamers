import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { FriendsComponent } from './friends/friends.component';
import { FrindsprofileComponent } from './frinedsprofile/frindsprofile.component';
import { LinkedAccountsComponent } from './linked-accounts/linked-accounts.component';
import { LoginComponent } from './login/login.component';
import { AppSearchComponent } from './navbar/app-search/app-search.component';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SettingsComponent } from './settings/Settings.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ShowgamesComponent } from './showgames/showgames.component';

const routes: Routes = [
  {
    path: 'profile-page', component: ProfilePageComponent,
    children: [
      { path: 'games', component: ShowgamesComponent },
      { path: 'post', component: ProfilePageComponent },
      { path: 'friends', component: FriendsComponent },
      { path: 'linked-accounts', component: LinkedAccountsComponent },
    ],
  canActivate: [AuthGuard]
  },
    {
      path: 'user', component: FrindsprofileComponent,
      children: [
        { path: 'games', component: ShowgamesComponent },
        { path: 'post', component: ProfilePageComponent },
        { path: 'friends', component: FriendsComponent },
        { path: 'linked-accounts', component: LinkedAccountsComponent },
      ],
    canActivate: [AuthGuard]
  },

  { path: 'first-component', component: PrimaryHomePageComponent, canActivate: [AuthGuard] },
  { path: 'login-page', pathMatch: 'full', component: LoginComponent },
  { path: 'settings', pathMatch: 'full', component: SettingsComponent },
  { path: 'linked-accounts', pathMatch: 'full', component: LinkedAccountsComponent },
  { path: 'chat', pathMatch: 'full', component: ChatPageComponent, canActivate: [AuthGuard]},
  { path: 'search', pathMatch: 'full', component: AppSearchComponent , canActivate: [AuthGuard]},
  { path: 'user', pathMatch: 'full', component: FrindsprofileComponent , canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', component: LoginComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
