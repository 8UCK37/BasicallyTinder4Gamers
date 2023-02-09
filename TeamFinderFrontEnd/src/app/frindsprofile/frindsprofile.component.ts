import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-frindsprofile',
  templateUrl: './frindsprofile.component.html',
  styleUrls: ['./frindsprofile.component.css']
})
export class FrindsprofileComponent implements OnInit {
  radioActivaVal:any;
  radioAtGame:any = false;
  public frnd_id:any;
  public frndData:any;
  constructor(private router : Router,private route: ActivatedRoute) {}
  public usr: any;
  public userparsed: any;

  ngOnInit(): void {
    //console.log(this.router.url);
    let lastUrl = this.router.url.split('/')[2]
    //console.log(lastUrl)
    if(lastUrl == 'post') this.radioActivaVal = 1
    if(lastUrl == 'games') this.radioActivaVal = 2;
    if(lastUrl == 'friends') this.radioActivaVal = 3;
    // this.radioAtGame = true
    this.route.queryParams.subscribe(params => {
          this.frnd_id = params['id'];
    });
    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);
    console.log(this.userparsed)
    this.getFrndInfo()
  }
  changeToGame(){
    this.router.navigate(['user','games'],{ queryParams: { id: this.frnd_id }});
  }
  changeToPost(){
    this.router.navigate(['user','post'],{ queryParams: { id: this.frnd_id }});
  }
  changeToFriends(){
    this.router.navigate(['user','friends'],{ queryParams: { id: this.frnd_id }});
  }
  getFrndInfo(){
    axios.post('getUserInfo',{frnd_id:this.frnd_id}).then(res=>{
      console.log(res.data)
      this.frndData=res.data;
    }).catch(err =>console.log(err))
  }
  sendReq(){
    console.log(this.userparsed.uid);
    axios.post('addFriend', { from: this.userparsed.uid, to:this.frndData.id}).then(res => {
      console.log("sent req", res)
    }).catch(err => console.log(err))
  }
}

