import { Component, OnInit } from '@angular/core';
import { UserService } from '../login/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AnimateTimings } from '@angular/animations';
import axios from 'axios';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { map } from '@firebase/util';
import { ChatServicesService } from '../chat-page/chat-services.service';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})

export class FriendsComponent implements OnInit {
  public show: boolean = true;
  public hide: boolean = false;
  public buttonName: any = 'Show';

  constructor(private socketService : ChatServicesService ,public user: UserService, private auth: AngularFireAuth,private router: Router) { }
  public usr: any;
  public userparsed: any;
  public pendingResults: any[] = [];
  public friendList: any[] = [];
  public sentPending:any[]=[];
  public profileurl: any;
  public online:boolean=false;
  public recData:any;
  private incomingNotiSubscription: Subscription | undefined;
  public status=new Map();

  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);
    this.getfriendlist();
    this.getPendingReq();
    this.getsentPending();
    //console.log(this.userparsed);
    //this.getPendingReq()
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userparsed = user
        axios.get('saveuser').then(res => {
          //console.log("save user" ,res)
          this.profileurl = `http://localhost:3000/static/profilePicture/${user.uid}.jpg`
        }).catch(err => console.log(err))

      }
    })
    // setInterval(() => {
    //   this.friendList.forEach(element => {
    //     axios.post('getUserInfo',{ frnd_id: element.data.id}).then(res => {
    //       //console.log(res.data)
    //       //console.log(element.data.id,res.data.activeChoice&&res.data.isConnected)
    //       this.status.set(element.data.id,res.data.activeChoice&&res.data.isConnected)
    //     }).catch(err => console.log(err))
    //   });
    // }, 500);
    this.incNotification();
  }
  getPendingReq() {
    this.pendingResults = []
    axios.get('getPendingRequest').then(res => {
      res.data.forEach((element: any) => {
        this.pendingResults.push(element)
      });
      //console.log(res.data)
    }).catch(err => console.log(err))
    //console.log(this.pendingResults)
  }
  getfriendlist() {
    this.friendList = [];
    axios.get('friendData').then(res => {
      res.data.forEach((data: any) => {
        this.friendList.push({ data })
        this.status.set(data.id,data.activeChoice&&data.isConnected)
      });
    }).catch(err => console.log(err))
    //console.log(this.friendList)
  }
  acceptReq(frndid:any){
    axios.post('acceptFriend', { frnd_id: frndid}).then(res => {
      //console.log("accepted", res)
      this.pendingResults=[];
      this.friendList=[];
      this.getfriendlist();
      this.getPendingReq();
    }).catch(err => console.log(err))
  }
  rejectReq(frndid:any){
    axios.post('rejectFriend', { frnd_id: frndid}).then(res => {
      //console.log("rejected", res)
      this.pendingResults=[];
      this.friendList=[];
      this.getfriendlist();
      this.getPendingReq();
    }).catch(err => console.log(err))
  }
  onclick(userid:any){
    //console.log(userid)
    this.router.navigate(['/user'], { queryParams: { id: userid } });
  }
  getOnlineStatus(frndid:any){
    axios.post('getUserInfo',{ frnd_id: frndid}).then(res => {
      //console.log(res.data)
      //this.online=res.data[0].activeChoice && res.data[0].isConnected
      //console.log(this.online)
    }).catch(err => console.log(err))
  }
  getsentPending() {
    this.sentPending = [];
    axios.get('sentPending').then(res => {
      res.data.forEach((frnd: any) => {
        axios.post('getUserInfo',{ frnd_id: frnd.reciever}).then(res => {
          this.sentPending.push(res.data)
          //this.online=res.data[0].activeChoice && res.data[0].isConnected
          //console.log(this.online)
        }).catch(err => console.log(err))
      });
    }).catch(err => console.log(err))
    //console.log(this.sentPending)
  }
  incNotification(){
    this.incomingNotiSubscription = this.socketService.getIncomingNoti().subscribe((data) => {
      this.recData = typeof data === 'string' ? JSON.parse(data) : data;
      //console.log(this.recData);
      if(this.recData.notification=='disc'){
        axios.post('getUserInfo',{frnd_id:this.recData.sender}).then(res=>{
         //console.log(res.data);
         this.status.set(this.recData.sender,res.data.activeChoice&&false)
          }).catch(err=>console.log(err));
      }else if(this.recData.notification=='online'){
        axios.post('getUserInfo',{frnd_id:this.recData.sender}).then(res=>{
          //console.log(res.data)
          this.status.set(this.recData.sender,res.data.activeChoice&&true)
          }).catch(err=>console.log(err));
      }
    });
  };
  toggle() {
    this.pendingResults=[];
    this.friendList=[];
    this.getfriendlist();
    this.getPendingReq();
    this.getsentPending();
    this.show = !this.show;
    this.hide = !this.hide;
    // Change the name of the button.
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
    if (this.hide)
      this.buttonName = "Show";
    else
      this.buttonName = "Hide";
  }
}
