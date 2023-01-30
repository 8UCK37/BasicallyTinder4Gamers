import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  hidenavbar=false
  ngOnInit(): void {

  }

}
