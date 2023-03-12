import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServicesService } from 'src/app/chat-page/chat-services.service';
import { UserService } from 'src/app/login/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})

export class FriendsComponent implements OnInit {
  public show: boolean = true;
  public hide: boolean = false;
  public buttonName: any = 'Show';
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
  ownProfile: any;
  public profile_id:any;
  constructor(private socketService : ChatServicesService ,public user: UserService, private auth: AngularFireAuth,private router: Router,private route: ActivatedRoute) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
   }

  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);
    console.log(this.ownProfile);
    if(this.ownProfile){

      this.getfriendlist();
      this.getPendingReq();
      this.getsentPending();
      this.incNotification();
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
      }else{
        this.route.queryParams.subscribe(params => {
          this.profile_id = params['id'];
          console.log(this.profile_id)
          this.getfriendfriendlist();
      });
    }
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
  getfriendfriendlist() {
    this.friendList = [];
    axios.post('friendsoffriendData', { frnd_id: this.profile_id }).then(res => {
      res.data.forEach((data: any) => {
        this.friendList.push({ data })
      });
    }).catch(err => console.log(err))
    console.log(this.friendList)
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
