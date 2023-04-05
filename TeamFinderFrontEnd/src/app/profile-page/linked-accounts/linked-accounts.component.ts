import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';
import { GamesComponent } from '../games/games.component';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.css']
})
export class LinkedAccountsComponent implements OnInit {

  public steamId: string = '';
  public usr: any;
  public userparsed: any;
  public linked: boolean = false;
  public steamInfo: any;
  public profile_id: any;
  changeText: any = false;
  ownProfile: any;
  twitchdata:any;
  constructor(private route: ActivatedRoute, private router: Router,public userService: UserService) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
  }
  ngOnInit(): void {

      if (this.ownProfile) {
        this.userService.userCast.subscribe(usr=>{
          //console.log("user data" , usr)
          this.userparsed = usr;
          if (usr!=null) {
            this.fetchUserData();
            this.getTwitchInfo();
          }
        })
      } else {
      this.route.queryParams.subscribe(async params => {
        this.profile_id = params['id'];
        //console.log(this.profile_id)
        await axios.post('getUserInfo', { id: this.profile_id }).then(res => {
          //console.log(res.data)
          if(res.data.steamId!=null){
          this.steamId = res.data.steamId
          this.linked=true;
          }else{
            this.linked = false
          }
        }).catch(err => console.log(err))
        //console.log(this.steamId)
        if (this.linked) {
          //console.log(this.steamId)
          await axios.post('steamInfo', { steam_id: this.steamId }).then(res => {
            //console.log(res.data)
            this.steamInfo = res.data
            //console.log(this.steamInfo)
          }).catch(err => console.log(err))
        }
      });
    }
  }

  getSteamInfo() {
    //console.log(this.steamId)
    axios.post('steamInfo', { steam_id: this.steamId } ).then(res => {
      //console.log(res.data)
      this.steamInfo = res.data
    }).catch(err => console.log(err))
  }
  getStyle() {
    if (this.changeText) return `url(${this.steamInfo.info[0].avatarfull}) left center no-repeat`;
    return `url("https://th.bing.com/th/id/OIP.nU9BElP8zdnYq1ckl5Ly2wAAAA?pid=ImgDet&rs=1") center center no-repeat`;
  }
  getSize() {
    if (this.changeText)
      return '400px'
    return '300px'
  }

   async fetchUserData(){
    await axios.post('getUserInfo', { id: this.userparsed.id }).then(res => {
      //console.log(res.data)
      if(res.data.steamId!=null){
      this.steamId = res.data.steamId
      this.linked=true
      }
      //console.log(this.linked)
    }).catch(err => console.log(err))
    this.getSteamInfo();
   }

   getTwitchInfo(){
    axios.get('twitchinfo').then(res=>{
      //console.log(res.data)
      if(res.data!='not logged in'){
        this.twitchdata=res.data
      }
      console.log(this.twitchdata)
    }).catch(err=>console.log(err))
   }

   redirectToSteamProfile(): void {
    window.open(`https://steamcommunity.com/profiles/${this.steamId}`, '_blank');
  }
  redirectToSteamLogin(): void {
    window.location.href = `http://localhost:3000/auth/steam?uid=${this.userparsed?.id}`;
  }
  redirectToTwitchLogin(): void {
    window.location.href = `http://localhost:3000/auth/twitch?uid=${this.userparsed?.id}`;
  }
}
