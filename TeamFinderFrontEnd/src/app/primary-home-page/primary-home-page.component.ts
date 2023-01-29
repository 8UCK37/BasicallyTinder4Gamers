import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { UserService } from '../login/user.service';

@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',
  styleUrls: ['./primary-home-page.component.css']
})
export class PrimaryHomePageComponent implements OnInit {
  public show:boolean=true;
  router: any;

  constructor(public user: UserService ,private renderer: Renderer2, router :Router ) { }

  public usr:any;
  public userparsed:any;
  ngOnInit(): void {
    this.show=false;
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    console.log(this.userparsed.photoURL);

  }
  routeToProfile()
  {
    console.log("dhdhd");
    this.router.navigate(['/profile-page']);

  }
  callBackend(){
    axios.get('/test?ID=12345')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
  }
  toggleMenu() {
    this.show=!this.show;
  }
}
