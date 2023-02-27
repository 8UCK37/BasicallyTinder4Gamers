import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-friendlinkedacount',
  templateUrl: './friendlinkedacount.component.html',
  styleUrls: ['./friendlinkedacount.component.css']
})
export class FriendlinkedacountComponent implements OnInit {
  public frnd_id:any;
  public frndData:any;
  public steamId:any;
  public steamInfo:any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.frnd_id = params['id'];
      this.getFrndInfo();
    });

  }
  getFrndInfo(){
    axios.post('getUserInfo',{frnd_id:this.frnd_id}).then(async res=>{
      this.steamId=res.data.steamId
      this.getSteamInfo();
    }).catch(err =>console.log(err))
  }
  //TODO:use this to populate the steam card
  getSteamInfo(){
    axios.post('steamInfo',{steam_id:this.steamId}).then(async res=>{
      console.log(res.data)
    }).catch(err =>console.log(err))
  }

}
