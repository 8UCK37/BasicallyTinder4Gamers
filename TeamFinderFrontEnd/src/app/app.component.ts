import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  [x: string]: any;
  hidenavbar=false
  token:any;
  ngOnInit(): void {
    this.token= localStorage.getItem('token')
    //console.log(this.token)
    axios.defaults.headers.common['authorization'] = `Bearer ${this.token}`
    axios.defaults.baseURL = 'http://localhost:3000/'

  }

}
