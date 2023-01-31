import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { UserService } from '../login/user.service';


@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',
  template: `
    <a (click)="navigateToChat()">Go to Chat</a>
  `,
  styleUrls: ['./primary-home-page.component.css']
})

export class PrimaryHomePageComponent implements OnInit {
  public show:boolean=true;


  constructor(public user: UserService ,private renderer: Renderer2) { }

  public usr:any;
  public userparsed:any;


  ngOnInit(): void {
    this.show=false;
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    console.log(this.userparsed);
  }

  toggleMenu() {
    this.show=!this.show;
  }
  
}
