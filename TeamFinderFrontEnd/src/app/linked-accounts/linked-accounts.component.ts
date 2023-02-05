import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.css']
})
export class LinkedAccountsComponent implements OnInit {

  public steamId:string='';
  constructor(private route: ActivatedRoute,private router: Router) { }
  public usr:any;
  public userparsed:any;
  public linked:boolean=false;
  public unlinked:boolean=false;

  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    this.steamId = this.route.snapshot.queryParams['steamid'];
    this.getSteamId()

    // this.setSteamId()
  }
  printSteamId(){
    console.log(this.steamId);
  }
  callBackend(){
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

  setSteamId(id:any){

    axios.post('setSteamId',{acc_id:id}).then(res=>{

    }).catch(err =>console.log(err))
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

  async getSteamId(){

    if(this.steamId==null){
      await axios.get('getSteamId').then(res=>{
        this.steamId=res.data[0].steamId
        if(this.steamId==null){
          this.unlinked=true;
          console.log("unlinked")
        }else{
          this.linked=true;
          console.log("linked")
        }
      }).catch(err =>console.log(err))
    }else{
      this.setSteamId(this.steamId)
      this.linked=true;
      this.unlinked=false;
      console.log("new steamId set")
      this.router.navigate(['/profile-page/linked-accounts']);
    }
  }

}
