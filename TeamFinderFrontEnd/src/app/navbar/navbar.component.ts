import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../login/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public show:boolean=true;
  router: any;

  constructor(public user: UserService ,private renderer: Renderer2) { }

  public usr:any;
  public userparsed:any;
  ngOnInit(): void {
    this.show=false;
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
  }

  toggleMenu() {
    this.show=!this.show;
  }
}
