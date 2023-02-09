import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-frindsprofile',
  templateUrl: './frindsprofile.component.html',
  styleUrls: ['./frindsprofile.component.css']
})
export class FrindsprofileComponent implements OnInit {
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
    //console.log(this.router.url);
    let lastUrl = this.router.url.split('/')[2]
    //console.log(lastUrl)
    if(lastUrl == 'post') this.radioActivaVal = 1
    if(lastUrl == 'games') this.radioActivaVal = 2;
    if(lastUrl == 'friends') this.radioActivaVal = 3;
    // this.radioAtGame = true
  }
  changeToGame(){
    this.router.navigate(['user','games']);
  }
  changeToPost(){
    this.router.navigate(['user','post']);
  }
  changeToFriends(){
    this.router.navigate(['user','friends']);
  }

}

