import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
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
  constructor(private route: ActivatedRoute, private router: Router) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
  }
  ngOnInit(): void {
      this.usr = localStorage.getItem('user');
      this.userparsed = JSON.parse(this.usr);

      if(this.route.snapshot.queryParams['steamid']=='linked'){
        alert('Your steam account has been successfully linked with TeamFinder account')
        //console.log('not null')
        this.ownProfile=true;
        this.linked=true;
      }
    if (this.ownProfile) {
      axios.post('getUserInfo', { id: this.userparsed.uid }).then(res => {
        //console.log(res.data)
        if(res.data.steamId!=null){
        this.steamId = res.data.steamId
        this.linked=true
        }
        //console.log(this.linked)
      }).catch(err => console.log(err))
      this.getSteamInfo();
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

  setSteamId(id: any) {
    axios.post('setSteamId', { acc_id: id }).then(res => {
      if (res.data.message == 'New SteamId Linked') {
        this.linked = true;
        console.log(res.data.message);
        this.router.navigate(['/profile-page/linked-accounts']);
      } else if ('This Steam Id is already linked with another existing account') {
        this.linked = false;
        console.log(res.data.message);
        this.router.navigate(['/profile-page/linked-accounts']);
      }
    }).catch(err => console.log(err))
  }

  getSteamInfo() {
    axios.get('steamUserInfo', { params: { id: this.steamId } }).then(res => {
      //console.log(res.data)
      this.steamInfo = res.data
      //console.log(this.steamInfo)
    }).catch(err => console.log(err))
  }
  getStyle() {
    if (this.changeText) return `url(${this.steamInfo.info[0].avatarfull}) left center no-repeat`;
    return `url("https://th.bing.com/th/id/OIP.nU9BElP8zdnYq1ckl5Ly2wAAAA?pid=ImgDet&rs=1") center center no-repeat`;
  }
  getSize() {
    if (this.changeText)
      return '480px'
    return '300px'
  }

  generateUrl(): string {
    const uid = this.userparsed.uid;
    return `http://localhost:3000/auth/steam?uid=${uid}`;
  }

}
