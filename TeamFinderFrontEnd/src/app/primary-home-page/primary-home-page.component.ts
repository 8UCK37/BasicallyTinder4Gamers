import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import axios from 'axios';
import { UserService } from '../login/user.service';

@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',
  styleUrls: ['./primary-home-page.component.css']
})
export class PrimaryHomePageComponent implements OnInit {
  public show:boolean=true;

  constructor(public user: UserService ,private renderer: Renderer2 ) { }
  
  public usr:any;
  ngOnInit(): void {
    this.show=false;
    this.usr = localStorage.getItem('user');
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
    console.log("golu chutiyar moto nigga type er kaj korche");
  }
}
