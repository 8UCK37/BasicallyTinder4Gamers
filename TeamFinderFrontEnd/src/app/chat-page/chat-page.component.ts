import { AfterViewInit, Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServicesService } from './chat-services.service';
import { Subscription } from 'rxjs';
import axios from 'axios';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  @ViewChild('messageContainer', {static: false}) messageContainer!: ElementRef;
  values: string = '';
  id : any ='';
  to : any ='';
  incomingmsg: string='';
  allMsgs:any []=[];
  constructor(private socketService : ChatServicesService , private route: ActivatedRoute) { }
  public usr:any;
  public userparsed:any;
  private incomingDataSubscription: Subscription | undefined;
  public friendList: any[]=[];
  public activeState:boolean=true;
  public selectedFrnd:any=null;
  public status=new Map();
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public now = new Date();
  public utcDateTime:any;
  public timeNow:any;
  public timeArr:any;
  ngOnInit() {
    //this.socketService.setupSocketConnection();
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    //this.socketService.setSocketId(this.userparsed.uid);
    //console.log("socket id: "+this.userparsed.uid);
    // this.fetchChatDate()

    this.getActiveChoice();

    this.incomingDataSubscription = this.socketService.getIncomingData().subscribe((data) => {
      console.log(data);
      this.allMsgs.push({rec:true,msg:data,time:this.getLocalTime()})
    });
    this.getfriendlist();

    setInterval(() => {
      this.friendList.forEach(element => {
        axios.post('getUserInfo',{ frnd_id: element.data.id}).then(res => {
          //console.log(res.data)
          //console.log(element.data.id,res.data.activeChoice&&res.data.isConnected)
          this.status.set(element.data.id,res.data.activeChoice&&res.data.isConnected)
        }).catch(err => console.log(err))
      });
    }, 1000);

  }

  ngOnDestroy() {
    //this.socketService.disconnect();
  }
  sendMessage(txt:any){
    // this.to=address;
    this.values=txt;
    let data = {receiver: this.to , msg : this.values , sender : this.userparsed.uid}
    console.log("sending to: "+this.to);
    console.log("msg txt: "+this.values);
    this.socketService.send(data);
    this.allMsgs.push({rec:false,msg:this.values,time:this.getLocalTime()})
    //console.log(this.getLocalTime())
    this.scrollToBottom();
  }
  getfriendlist(){
    this.friendList=[];
    axios.get('friendData').then(res=>{
      res.data.forEach((data: any) => {
        this.friendList.push({data})
        this.status.set(data.id,false);
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
        this.allMsgs.push({rec: left , msg: ele.msg,time:this.timeArr[0]+":"+this.timeArr[1]})
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
      console.log("state:"+this.activeState)
      this.activeState=!this.activeState;
      console.log("state:"+this.activeState)
      this.setActiveChoice(this.activeState);
    }
    onclick(frndid:any){
      this.fetchChatData(frndid);
      this.selectedFrnd=null;
      axios.post('getUserInfo',{frnd_id:frndid}).then(res=>{
        //console.log(res.data)
        this.selectedFrnd=res.data
      }).catch(err =>console.log(err))
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

}

