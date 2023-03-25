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
  public userObject?: any;

  constructor(public userService: UserService,private auth: AngularFireAuth , router :Router ,private AppComponent:AppComponent) {
    this.AppComponent.hidenavbar=true;
    console.log(this.userService.isLoggedIn)
    this.userService.userCast.subscribe(usr=>{
      console.log("user data" , usr)
      this.userObject=usr
      if(this.userObject != null){
      router.navigate(['/home']);
    }
    })
  }
}
