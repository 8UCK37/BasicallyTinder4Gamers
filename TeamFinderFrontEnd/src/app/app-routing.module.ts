import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';

const routes: Routes = [
  { path: 'home', pathMatch: 'full', component: PrimaryHomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
