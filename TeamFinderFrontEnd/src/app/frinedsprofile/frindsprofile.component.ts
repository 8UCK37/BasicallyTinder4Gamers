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
  public isFrnd!: boolean;
  public frndprofileurl:any;
  public frndbannerUrl:any;
  public btnTxt:any="Send Req";
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
        this.getFrndInfo();
        this.ifFriend();
    });

    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);
    //console.log(this.userparsed)
    setInterval(() => {
      //console.log("test")
      axios.post('isFriend',{id:this.frnd_id}).then(res => {
        //console.log(res.data)
        if(res.data.length!=0){
          if(res.data[0].status=="accepted"){
            this.isFrnd=true;
          }
        }
      }).catch(err => console.log(err))
    }, 1000);

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
      //console.log(res.data)
      this.frndData=res.data;
    }).catch(err =>console.log(err))
  }
  sendReq(){
    //console.log(this.userparsed.uid);
    if(this.btnTxt!='Pending'){
    axios.post('addFriend', { from: this.userparsed.uid, to:this.frndData.id}).then(res => {
      //console.log("sent req", res)
      this.btnTxt="Pending";
    }).catch(err => console.log(err))
    }else{
      //console.log("a pending req exists")
    }
  }
  ifFriend(){
    axios.post('isFriend',{id:this.frnd_id}).then(res => {
      //console.log(res.data)
      if(res.data.length!=0){
        if(res.data[0].status=="accepted"){
          this.isFrnd=true;
        }else if(res.data[0].status=="pending"){
          this.isFrnd=false;
          this.btnTxt="Pending";
        }
      }else{
        this.btnTxt="Send Req"
        this.isFrnd=false;
      }
    }).catch(err => console.log(err))
  }
  onDpError() {
    this.frndprofileurl = this.frndData.profilePicture;
    //console.log("dperror"+this.frndprofileurl)
  }
  onBannerError() {
    this.frndbannerUrl = 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg';
  }
}

