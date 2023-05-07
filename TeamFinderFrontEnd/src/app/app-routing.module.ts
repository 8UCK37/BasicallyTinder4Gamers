import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { FriendsComponent } from './profile-page/friends/friends.component';
import { LinkedAccountsComponent } from './profile-page/linked-accounts/linked-accounts.component';
import { LoginComponent } from './login/login.component';
import { AppSearchComponent } from './navbar/app-search/app-search.component';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SettingsComponent } from './settings/Settings.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { GamesComponent } from './profile-page/games/games.component';
import { PostPageComponent } from './post/post-page/post-page.component';

const routes: Routes = [
  {
    path: 'profile-page', component: ProfilePageComponent,
    children: [
      { path: 'games', component: GamesComponent },
      { path: 'post', component: ProfilePageComponent },
      { path: 'friends', component: FriendsComponent },
      { path: 'linked-accounts', component: LinkedAccountsComponent },
    ],
  canActivate: [AuthGuard],
    data: { ownProfile: true }
  },
    {
      path: 'user', component: ProfilePageComponent,
      children: [
        { path: 'games', component: GamesComponent },
        { path: 'post', component: ProfilePageComponent },
        { path: 'friends', component: FriendsComponent },
        { path: 'linked-accounts', component: LinkedAccountsComponent },
      ],
    canActivate: [AuthGuard],
    data: { ownProfile: false }
  },
  { path: 'home', component: PrimaryHomePageComponent, canActivate: [AuthGuard] },
  { path: 'post-page', component: PostPageComponent, canActivate: [AuthGuard] },
  { path: 'login-page', pathMatch: 'full', component: LoginComponent },
  { path: 'settings', pathMatch: 'full', component: SettingsComponent },
  { path: 'linked-accounts', pathMatch: 'full', component: LinkedAccountsComponent },
  { path: 'chat', pathMatch: 'full', component: ChatPageComponent, canActivate: [AuthGuard]},
  { path: 'search', pathMatch: 'full', component: AppSearchComponent , canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', component: PrimaryHomePageComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
