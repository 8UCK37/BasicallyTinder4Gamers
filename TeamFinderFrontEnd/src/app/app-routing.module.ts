import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';

const routes: Routes = [
  { path: 'first-component', pathMatch: 'full', component: PrimaryHomePageComponent },
  { path: 'login-page', pathMatch: 'full', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
