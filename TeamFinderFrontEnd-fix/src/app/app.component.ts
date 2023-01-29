import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserService } from './user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-firebase-auth-service';
  public usr: any;

  constructor(public user: UserService,private auth: AngularFireAuth) {
    
    console.log(auth.authState.subscribe(uu =>{
      this.usr = uu
      console.log(this.usr)
    }))
  }
}
