import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';
import { GamesComponent } from '../games/games.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.css']
})
export class LinkedAccountsComponent implements OnInit {

  public steamId: string = '';
  public usr: any;
  public userparsed: any;
  public steamLinked: boolean = false;
  public twitchLinked:boolean = false;
  public steamInfo: any;
  public profile_id: any;
  changeText: any = false;
  ownProfile: any;
  twitchdata:any;
  discordData:any;
  public imgSrc:any='https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/twitch-1024.png';
  public imgSize:any='250px'
  public discordimgSize:any='250px'
  public discordDp=''
  public discordLogo='https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/discord-1024.png'
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
            this.getTwitchInfo(this.userparsed.id);
            this.getDiscordInfo(this.userparsed.id);
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
          this.steamLinked=true;
          }else{
            this.steamLinked = false
          }
          if(res.data.twitchtoken!=null){
            this.getTwitchInfo(this.profile_id)
          }
        }).catch(err => console.log(err))
        //console.log(this.steamId)
        if (this.steamLinked) {
          //console.log(this.steamId)
          await axios.post('steamInfo', { steam_id: this.steamId }).then(res => {
            //console.log(res.data)
            this.steamInfo = res.data
            //console.log(this.steamInfo)
          }).catch(err => console.log(err))
        }
      this.getDiscordInfo(this.profile_id);
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
      this.steamLinked=true
      }
      //console.log(this.linked)
    }).catch(err => console.log(err))
    this.getSteamInfo();
   }

   getTwitchInfo(id:any){
    axios.get(`getowntwitchinfo?id=${id}`).then(res=>{
      //console.log(res.data)
      if(res.data!='not logged in'){
        this.twitchdata=res.data
        this.twitchLinked=true
      }else{
        this.twitchLinked=false
      }
    }).catch(err=>console.log(err))
   }
   getDiscordInfo(id:any){
    axios.get(`getDiscordInfo?id=${id}`).then(res=>{
      console.log(res.data)
      this.discordData=structuredClone(res.data)
      this.discordDp=`https://cdn.discordapp.com/avatars/${this.discordData.Discord.id}/${this.discordData.Discord.avatar}.png`
      //console.log(this.discordData.Discord.username)
    }).catch(err=>console.log(err))
   }
  redirectToSteamProfile(): void {
    window.open(`https://steamcommunity.com/profiles/${this.steamId}`, '_blank');
  }
  redirectToSteamLogin(): void {
    window.location.href = `${environment.endpointUrl}`+`/auth/steam?uid=${this.userparsed?.id}`;
  }
  redirectToTwitchLogin(): void {
    window.location.href = `${environment.endpointUrl}`+`/auth/twitch?uid=${this.userparsed?.id}`;
  }
  redirectToTwitchProfile(): void {
    window.open(`https://www.twitch.tv/${this.twitchdata.login}`, '_blank');
  }

  redirectToDiscordLogin(): void {
    window.location.href = `${environment.endpointUrl}`+`/auth/discord?uid=${this.userparsed?.id}`;
  }
}
