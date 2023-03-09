import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { ShowgamesComponent } from '../showgames/showgames.component';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.css']
})
export class LinkedAccountsComponent implements OnInit {

  public steamId: string = '';
  changeText: any=false;
  constructor(private route: ActivatedRoute, private router: Router) { }
  public usr: any;
  public userparsed: any;
  public linked: boolean = false;
  public unlinked: boolean = false;
  public steamInfo: any;

  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);
    this.steamId = this.route.snapshot.queryParams['steamid'];
    this.getSteamId();
    // this.setSteamId()
    this.getSteamInfo();
  }

  callBackend() {
    axios.get('/test?ID=12345')
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      })
  }

  setSteamId(id: any) {
    axios.post('setSteamId', { acc_id: id }).then(res => {

      if (res.data.message == 'New SteamId Linked') {
        this.linked = true;
        this.unlinked = false;
        console.log(res.data.message);
        this.router.navigate(['/profile-page/linked-accounts']);
      } else if ('This Steam Id is already linked with another existing account') {
        this.linked = false;
        this.unlinked = true;
        console.log(res.data.message);
        this.router.navigate(['/profile-page/linked-accounts']);
      }
    }).catch(err => console.log(err))
  }
  // async deleteSteamId(){
  //   this.steamId='';
  //   this.unlinked=true;
  //   this.linked=false;
  //   await axios.post('setSteamId',{acc_id:null}).then(res=>{
  //       console.log("steam id unlinked")

  //   }).catch(err =>console.log(err))
  //   this.router.navigate(['/linked-accounts']);
  // }

  async getSteamId() {
    if (this.steamId == null) {
      await axios.get('getSteamId').then(res => {
        this.steamId = res.data[0].steamId
        if (this.steamId == null) {
          this.unlinked = true;
          console.log("unlinked")
        } else {
          this.linked = true;
          //console.log("linked")
        }
      }).catch(err => console.log(err))
    } else {
      this.setSteamId(this.steamId)
    }
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
  getSize(){
    if (this.changeText)
    return '480px'
    return '300px'
  }
//   getUrl() {
//     return `url('${this.steamInfo.info[0].avatarfull}')`;
//   }
 }
