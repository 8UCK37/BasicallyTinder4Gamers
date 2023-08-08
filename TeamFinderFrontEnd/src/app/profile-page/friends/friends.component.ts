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
  public friendProfile: any;
  public userInfo: any;
  public userparsed: any;
  public pendingRequests: any[] = [];
  public friendList: any[] = [];
  public outgoingPendingRequests:any[]=[];
  public recData:any;
  private incomingNotiSubscription: Subscription | undefined;
  public status=new Map();
  ownProfile: any;
  public profile_id:any;
  constructor(public userService:UserService,private socketService : ChatServicesService ,public user: UserService, private auth: AngularFireAuth,private router: Router,private route: ActivatedRoute) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
   }

  ngOnInit(): void {
    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed = usr
      this.incNotification();
    })
    //console.log(this.ownProfile);

    if(this.ownProfile){
      this.userService.userCast.subscribe(usr=>{
        //console.log("user data" , usr)
        this.userparsed = usr
        if (this.userparsed) {
          this.getFriendData();
        }
      })
      }else{
        this.route.queryParams.subscribe(params => {
          this.profile_id = params['id'];
          axios.post('getUserInfo', { id: this.profile_id }).then(res => {
            this.friendProfile=res.data[0]
            this.userInfo=res.data[0].userInfo
            if(res.data[0].userInfo.frnd_list_vis){
              this.getfriendfriendlist();
            }
          }).catch(err => console.log(err))
      });
    }
  }
  getFriendData() {
    this.pendingRequests = []
    this.friendList = [];
    this.outgoingPendingRequests=[];
    axios.get('getFriendData').then(res => {
      //console.log(res.data)
       res.data.forEach((user: any) => {
         if(user.status=='accepted'){
          this.friendList.push( user )
          this.status.set(user.id,user.activeChoice&&user.isConnected)
         }
         else if(user.status=='incoming'){
          this.pendingRequests.push(user)
         }
         else if(user.status=='outgoing'){
          this.outgoingPendingRequests.push(user)
         }
      });
      //console.log(this.friendList)
      //console.log(this.pendingResults)
    }).catch(err => console.log(err))
  }

  getfriendfriendlist() {
    this.friendList = [];
    axios.post('friendsoffriendData', { frnd_id: this.profile_id }).then(res => {
      //console.log(res.data)
      res.data.forEach((data: any) => {
        this.friendList.push( data )
      });
    }).catch(err => console.log(err))
    //console.log(this.friendList)
  }
  acceptReq(frndid:any){
    axios.post('acceptFriend', { frnd_id: frndid}).then(res => {
      //console.log("accepted", res)
      this.pendingRequests=[];
      this.friendList=[];
      //this.getfriendlist();
      this.getFriendData();
    }).catch(err => console.log(err))
  }
  rejectReq(frndid:any){
    axios.post('rejectFriend', { frnd_id: frndid}).then(res => {
      //console.log("rejected", res)
      this.pendingRequests=[];
      this.friendList=[];
      //this.getfriendlist();
      this.getFriendData();
    }).catch(err => console.log(err))
  }
  goToFriend(userid:any){
    //console.log(userid)
    //console.log(this.userparsed.uid)
    if(this.userparsed.id==userid){
      this.router.navigate(['/profile-page/post']);
    }else{
      this.router.navigate(['user','post'], { queryParams: { id: userid } });
    }
  }

  incNotification(){
    this.incomingNotiSubscription = this.socketService.getIncomingNoti().subscribe((data) => {
      this.recData = typeof data === 'string' ? JSON.parse(data) : data;
      //console.log(this.recData);
      if(this.recData.notification=='disc'){
        axios.post('getUserInfo',{id:this.recData.sender}).then(res=>{
         //console.log(res.data);
         this.status.set(this.recData.sender,res.data.activeChoice&&false)
          }).catch(err=>console.log(err));
      }else if(this.recData.notification=='online'){
        axios.post('getUserInfo',{id:this.recData.sender}).then(res=>{
          //console.log(res.data)
          this.status.set(this.recData.sender,res.data.activeChoice&&true)
          }).catch(err=>console.log(err));
      }
    });
  };
  toggle() {
    //TODO will refactor these three lines with notification trigger
    this.pendingRequests=[];
    this.friendList=[];
    this.getFriendData();

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
