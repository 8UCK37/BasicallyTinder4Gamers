import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import axios from 'axios';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent  {

  title = 'angular-firebase-auth-service';
  public userObject: any;

  constructor(public user: UserService,private auth: AngularFireAuth , router :Router ,private AppComponent:AppComponent) {
    this.AppComponent.hidenavbar=true;
    this.userObject = localStorage.getItem('user');
    if(this.userObject != null){
      router.navigate(['/first-component']);
    }
  }

}
