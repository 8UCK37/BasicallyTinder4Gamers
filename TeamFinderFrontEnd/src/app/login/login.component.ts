import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  title = 'angular-firebase-auth-service';
  public usr: any;

  constructor(public user: UserService,private auth: AngularFireAuth) {
    
    console.log(auth.authState.subscribe(uu =>{
      this.usr = uu
      console.log(this.usr)
    }))
  }
}
