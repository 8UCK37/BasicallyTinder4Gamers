import { AfterViewInit, Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServicesService } from './chat-services.service';
import { Subscription } from 'rxjs';
import axios from 'axios';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  @ViewChild('messageContainer', {static: false}) messageContainer!: ElementRef;

  name = 'Angular';
  message = '';
  showEmojiPicker = false;
  set1:String= 'google' ;
  values: string = '';
  id : any ='';
  to : any ='';
  incomingmsg: string='';
  allMsgs:any []=[];
  constructor(private socketService : ChatServicesService , private route: ActivatedRoute,private auth: AngularFireAuth) { }
  public usr:any;
  public userparsed:any;
  private incomingDataSubscription: Subscription | undefined;
  private incomingNotiSubscription: Subscription | undefined;
  public friendList: any[]=[];
  public activeState:boolean=true;
  public selectedFrnd:any=null;
  public selectedFrndId:any=null;
  public status=new Map();
  public notification=new Map();
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public now = new Date();
  public utcDateTime:any;
  public timeNow:any;
  public timeArr:any;
  public profileurl:any;
  public activeConvList:any[]=[];
  public static incSenderIds:any[]=[];
  public recData:any;
  ngOnInit() {
    //this.socketService.setupSocketConnection();
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    //this.socketService.setSocketId(this.userparsed.uid);
    //console.log("socket id: "+this.userparsed.uid);
    // this.fetchChatDate()
    //console.log(ChatPageComponent.incSenderIds)

    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        //console.log(this.userparsed)
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          axios.post('getUserInfo',{frnd_id:this.userparsed.uid}).then(res=>{
            this.profileurl=res.data.profilePicture;

           //console.log(res.data);
         }).catch(err=>console.log(err))
        }).catch(err =>console.log(err))
      }
    })
    this.getActiveChoice();
    this.getfriendlist();
    this.incMsg();

    // setInterval(() => {
    //   this.friendList.forEach(element => {
    //     axios.post('getUserInfo',{ frnd_id: element.data.id}).then(res => {
    //       //console.log(res.data)
    //       //console.log(element.data.id,res.data.activeChoice&&res.data.isConnected)
    //       this.status.set(element.data.id,res.data.activeChoice&&res.data.isConnected)
    //     }).catch(err => console.log(err))
    //   });
    // }, 1000);
    setTimeout(() => {
      //console.log(ChatPageComponent.incSenderIds)
      this.friendList.forEach(frnd => {
        ChatPageComponent.incSenderIds.forEach(sender => {
          if(frnd.data.id==sender){
            this.notification.set(frnd.data.id,true)
          }
        });
      });
    }, 300);
    this.getActiveConvo();
    this.incNotification();
  }

  ngOnDestroy() {
    //this.socketService.disconnect();
  }

  sendMessage(){

    let data = {receiver: this.to , msg : this.values , sender : this.userparsed.uid}
    //console.log("sending to: "+this.to);
    //console.log("msg txt: "+this.values);
    this.socketService.send(data);
    this.allMsgs.push({sender:this.to,rec:false,msg:this.values,time:this.getLocalTime()})
    //console.log(this.getLocalTime())
    this.scrollToBottom();
    if(this.selectedFrndId!=this.to)
    {
    setTimeout(() => {
      this.getActiveConvo();
    }, 400);
    }
  }

  getfriendlist(){
    this.friendList=[];
    axios.get('friendData').then(res=>{
      res.data.forEach((data: any) => {
        this.friendList.push({data})
        //this.status.set(data.id,false);
        this.notification.set(data.id,false);
        this.status.set(data.id,data.activeChoice&&data.isConnected)
      });
    }).catch(err=>console.log(err))
    //console.log(this.friendList)
  }
  fetchChatData(friendId:any){
    // let senderId = this.route.snapshot.queryParamMap.get('senderId');
    this.to = friendId
    axios.get('/chatData',{params:{friendId: friendId}}).then(res=>{
      this.allMsgs = []
      res.data.forEach((ele:any) => {
        this.timeArr=this.utcToLocal(ele.createdAt).split(" ")[1].split(":")
        let left = (ele.sender== this.userparsed.uid) ? false : true
        this.allMsgs.push({sender:friendId,rec: left , msg: ele.msg,time:this.timeArr[0]+":"+this.timeArr[1]})
        })
        //console.log(this.allMsgs)
      });
      this.scrollToBottom();
    }

    getActiveChoice(){
      axios.get('activeState').then(res=>{
        this.activeState=res.data[0].activeChoice
        //console.log("state:"+this.activeState)
      }).catch(err=>console.log(err))
    }

    setActiveChoice(state:boolean){
      axios.post('activeStateChange',{state}).then(res=>{
        console.log("sent req" ,res)
      }).catch(err =>console.log(err))
    }

    toggleState(){
      //console.log("state:"+this.activeState)
      this.activeState=!this.activeState;
      //console.log("state:"+this.activeState)
      this.setActiveChoice(this.activeState);
    }

    onclick(frndid:any){
      this.values='';
      this.fetchChatData(frndid);
      this.selectedFrndId=frndid;
      this.selectedFrnd=null;
      this.notification.set(frndid,false);
      axios.post('getUserInfo',{frnd_id:frndid}).then(res=>{
        //console.log(res.data)
        this.selectedFrnd=res.data
      }).catch(err =>console.log(err))
      this.scrollToBottom();
    }

    utcToLocal(utcTime:any){
        this.utcDateTime = new Date(utcTime);
        return this.utcDateTime.toLocaleString('en-US', { timeZone:this.timeZone });
    }

    getLocalTime(){
      this.timeNow=this.now.toLocaleString('en-US', { hour12: true })
      this.timeArr=this.timeNow.split(" ")[1].split(":");
      return (this.timeArr[0]+":"+this.timeArr[1])
    }

    scrollToBottom() {
      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }, 100);
    }

    incMsg(){
      this.incomingDataSubscription = this.socketService.getIncomingMsg().subscribe((data) => {
        const recData = typeof data === 'string' ? JSON.parse(data) : data;
        //console.log(recData.sender);
        this.allMsgs.push({sender:recData.sender,rec:true,msg:recData.msg,time:this.getLocalTime()});
        if(recData.sender==this.selectedFrndId){
        this.scrollToBottom();
        //this.getActiveConvo();
        }else{
          this.notification.set(recData.sender,true);
          this.getActiveConvo();
        }
      });
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


    getActiveConvo(){
      this.activeConvList=[];
      const uniqueConv:any=[];

      axios.get('getActiveList').then(res=>{
       //console.log(res.data)
       res.data.forEach((element: any)=> {
        //console.log(element.sender)
        if(!uniqueConv.includes(element.sender)){
          uniqueConv.push(element.sender)
        }
       });

      axios.get('sentOnly').then(res=>{
          res.data.forEach((element: any) => {
            if(!uniqueConv.includes(element.receiver)){
              uniqueConv.push(element.receiver)
            }

          });
        //console.log(uniqueConv.length)
          uniqueConv.forEach((sender: any) => {
            //console.log(sender)
            axios.post('getUserInfo',{frnd_id:sender}).then(res=>{
              this.activeConvList.push(res.data)
            }).catch(err =>console.log(err))
              });
            }).catch(err=>console.log(err))

      }).catch(err=>console.log(err))
      //console.log(this.activeConvList)
    }
    toggleEmojiPicker() {
      console.log(this.showEmojiPicker);
          this.showEmojiPicker = !this.showEmojiPicker;
    }

    addEmoji(event:any) {
      console.log(this.message)
      const { message } = this;
      console.log(message);
      console.log(`${event.emoji.native}`)
      const text = `${message}${event.emoji.native}`;

      this.values += text;
      // this.showEmojiPicker = false;
    }
    onProfilePicError() {
      this.profileurl = this.userparsed.photoURL;
    }
    sendnoti(frndid:any){
      // console.log("test clicked : "+frndid)
      // this.socketService.sendNoti({sender:this.userparsed.uid,receiver:frndid,noti:"test notification"})
      axios.post('sendNoti',{receiver_id:frndid}).then(res=>{
        console.log(res.data);
     }).catch(err=>console.log(err))
    }
}

