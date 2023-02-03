import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  radioActivaVal:any;
  radioAtGame:any = false;
  constructor(private router : Router) {
  //   router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  // )
  //     .subscribe(event => {
  //         console.log(event);
  //     });
  }

  ngOnInit(): void {
    console.log(this.router.url);
    let lastUrl = this.router.url.split('/')[2]
    console.log(lastUrl)
    if(lastUrl == 'post') this.radioActivaVal = 1
    if(lastUrl == 'games') this.radioActivaVal = 2;
    if(lastUrl == 'friends') this.radioActivaVal = 3;
    // this.radioAtGame = true
  }
  changeToGame(){
    this.router.navigate(['profile-page','games']);
  }
  changeToPost(){
    this.router.navigate(['profile-page','post']);
  }
  changeToFriends(){
    this.router.navigate(['profile-page','friends']);
  }

}
