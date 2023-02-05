import { Component, OnInit } from '@angular/core';
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
  
  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    this.socketService.setSocketId(this.userparsed.uid);
    console.log("socket id: "+this.userparsed.uid);
    // this.fetchChatDate()


    this.setActiveChoice();
    this.incomingDataSubscription = this.socketService.getIncomingData().subscribe((data) => {
      console.log(data);
      // Do something with the incoming data

      this.allMsgs.push({rec:true,msg:data})
    });
    this.getfriendlist();
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
  sendMessage(txt:any){
    // this.to=address;
    this.values=txt;
    let data = {receiver: this.to , msg : this.values , sender : this.userparsed.uid}
    console.log("sending to: "+this.to);
    console.log("msg txt: "+this.values);
    this.socketService.send(data);
    this.allMsgs.push({rec:false,msg:this.values})
  }
  getfriendlist(){
    this.friendList=[];
    axios.get('friendData').then(res=>{
      res.data.forEach((element: any) => {
        this.friendList.push({element})
      });

    }).catch(err=>console.log(err))
    //console.log(this.friendList)
  }
  fetchChatDate(friendId:any){
    // let senderId = this.route.snapshot.queryParamMap.get('senderId');
    this.to = friendId
    axios.get('/chatData',
    {
      params:
      {
        friendId: friendId
      }
    }).then(res=>{
      this.allMsgs = []
      res.data.forEach((ele:any) => {
        let left = (ele.sender== this.userparsed.uid) ? false : true
        this.allMsgs.push({rec: left , msg: ele.msg})
        })
      });
    }
    getActiveChoice(){
      axios.get('activeState').then(res=>{
        this.activeState=res.data[0].activeChoice
        console.log(this.activeState)
      }).catch(err=>console.log(err))
    }
    setActiveChoice(){
      axios.post('activeStateChange',{state:true}).then(res=>{
        console.log("sent req" ,res)
      }).catch(err =>console.log(err))
    }
}
