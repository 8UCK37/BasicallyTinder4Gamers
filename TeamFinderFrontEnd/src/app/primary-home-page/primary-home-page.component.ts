import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { UserService } from '../login/user.service';
import {v4 as uuidv4} from 'uuid';
@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',

  styleUrls: ['./primary-home-page.component.css']
})
export class PrimaryHomePageComponent implements OnInit {
  public show:boolean=true;
  router: any;

  constructor(public user: UserService ,private renderer: Renderer2) { }

  public usr:any;
  public userparsed:any;
  myuuid:any;
  ngOnInit(): void {
    this.show=false;
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    console.log(this.userparsed);
    this.myuuid = uuidv4();

    console.log('Your UUID is: ' + this.myuuid);
  }

  toggleMenu() {
    this.show=!this.show;
  }

}
