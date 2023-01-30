import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkedAccountsComponent } from './linked-accounts/linked-accounts.component';
import { LoginComponent } from './login/login.component';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: 'profile-page', pathMatch: 'full', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'first-component', pathMatch: 'full', component: PrimaryHomePageComponent , canActivate: [AuthGuard] },
  { path: 'login-page', pathMatch: 'full', component: LoginComponent },
  { path: 'linked-accounts', pathMatch: 'full', component: LinkedAccountsComponent },
  { path: '**', pathMatch: 'full', component: LoginComponent ,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
