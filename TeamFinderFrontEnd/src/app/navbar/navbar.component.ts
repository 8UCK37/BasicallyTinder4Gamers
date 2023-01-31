import { Component, OnInit, Renderer2 } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../login/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public show:boolean=false;
  router: any;

  constructor(public user: UserService ,private renderer: Renderer2 ,private auth: AngularFireAuth) { }

  public usr:any;
  public userparsed:any;
  ngOnInit(): void {
    // this.show=false;
    // this.usr = localStorage.getItem('user');
    // this.userparsed=JSON.parse(this.usr);
    // console.log("logged in :" ,  this.user.isLoggedIn)
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
      }
    })
  }

  toggleMenu() {
    this.show=!this.show;
  }
}
