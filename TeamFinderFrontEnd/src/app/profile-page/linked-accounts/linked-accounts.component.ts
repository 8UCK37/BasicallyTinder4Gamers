import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';
import { GamesComponent } from '../games/games.component';
import { environment } from 'src/environments/environment';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';

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
  public twitchdata:any;

  discordData:any;
  discordLinked:boolean=false;
  public imgSrc:any='https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/twitch-1024.png';
  public imgSize:any='250px'
  public discordimgSize:any='250px'
  public discordDp=''
  public discordLogo='https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/discord-1024.png'

  constructor(public utilsServiceService : UtilsServiceService,private route: ActivatedRoute, private router: Router,public userService: UserService) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
  }
  ngOnInit(): void {

      if (this.ownProfile) {
        this.userService.userCast.subscribe(usr=>{
          //console.log("user data" , usr)
          this.userparsed = usr;
          if (usr!=null) {

            this.getTwitchInfo(this.userparsed.id);
            this.getDiscordInfo(this.userparsed.id);
            if(usr.steamId){
              this.steamLinked=true
              this.getSteamInfo(usr.steamId)
            }
          }
        })

      } else {
      this.route.queryParams.subscribe(async params => {
        this.profile_id = params['id'];
        //console.log(this.profile_id)
        await axios.post('getUserInfo', { id: this.profile_id }).then(res => {
          console.log(res.data)
          if(res.data[0].steamId!=null){
          this.steamId = res.data[0].steamId
          this.steamLinked=true;
          }else{
            this.steamLinked = false
          }

          this.getTwitchInfo(this.profile_id)

        }).catch(err => console.log(err))
        //console.log(this.steamId)
        if (this.steamLinked) {
          //console.log(this.steamId)
          await axios.post('steamInfo', { steam_id: this.steamId }).then(res => {
            //console.log(res.data)
            this.steamInfo = res.data
            console.log(this.steamInfo)
          }).catch(err => console.log(err))
        }
      this.getDiscordInfo(this.profile_id);
      //this.getValoStats();
      });
    }
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

   getSteamInfo(id:any) {
    //console.log(this.steamId)
    axios.post('steamInfo', { steam_id: id } ).then(res => {
      console.log(res.data)
      this.steamLinked=true
      this.steamInfo = res.data
    }).catch(err => console.log(err))
  }
   getTwitchInfo(id:any){
    axios.get(`getowntwitchinfo?id=${id}`).then(res=>{
      console.log(res.data)
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
      //console.log(res.data)
      if(res.data.Discord && res.data.Discord.connections){
        let connectionmap=new Map()
      const forEachPromise = new Promise<void>((resolve) => {
        res.data.Discord.connections.forEach((con: { type: any; }) => {
          connectionmap.set(con.type, con);
        });

        resolve();
      });
      //console.log(connectionmap)
      forEachPromise.then(() => {
        if (connectionmap.size > 0) {
          this.utilsServiceService.linkedAccountObjSource.next(connectionmap);
        }
      });
      this.discordData=structuredClone(res.data)
      if(Object.keys(this.discordData?.Discord).length>0){
        this.discordLinked=true
      }
      this.discordDp=`https://cdn.discordapp.com/avatars/${this.discordData?.Discord?.id}/${this.discordData?.Discord?.avatar}.png`
      //console.log(this.discordData)
      //console.log(Object.keys(this.discordData?.Discord).length)
      }


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
    if(this.ownProfile){
      window.open(`https://www.twitch.tv/${this.twitchdata.login}`, '_blank');
    }
  }

  redirectToDiscordLogin(): void {
    if(this.ownProfile){
      window.location.href = `${environment.endpointUrl}`+`/auth/discord?uid=${this.userparsed?.id}`;
    }
  }
  redirectToDiscordWebsite(): void {
    window.open(`https://discord.com/app`, '_blank');
  }
  getValoStats(){
    let riotData:any={}
    this.utilsServiceService.linkedAccountObj.subscribe((data:any)=>{
      console.log('connected acc data from discord',data)

      if(data.has('riotgames')){
        riotData=data
      }

    })
    if(riotData){
      // axios.post('valoStats/getValoStatByIGN', { ign: riotData.get('riotgames').name }).then(res => {
      //   console.log(res.data)
      // }).catch(err => console.log(err))
    }

  }

}
