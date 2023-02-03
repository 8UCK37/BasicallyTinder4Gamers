import { Component, OnInit } from '@angular/core';
import { UserService } from '../login/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AnimateTimings } from '@angular/animations';
import axios from 'axios';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})

export class FriendsComponent implements OnInit {


  constructor(public user: UserService  ,private auth: AngularFireAuth) { }
  public usr:any;
  public userparsed:any;
  public pendingResults:any[]=[];
  public friendList: any[]=[];
  public friendListData: any[]=[];
  public profileurl:any;
  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    this.getfriendlist();

    //console.log(this.userparsed);
    //this.getPendingReq()
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          this.profileurl = `http://localhost:3000/static/profilePicture/${user.uid}.jpg`
        }).catch(err =>console.log(err))

      }
    })
  }
  sendReq(data:string){
    axios.post('addFriend',{from:this.userparsed.uid,to:data}).then(res=>{
      console.log("sent req" ,res)
    }).catch(err =>console.log(err))
    //console.log(this.userparsed)
  }
  getPendingReq(){
    this.pendingResults=[]
    axios.get('getPendingRequest').then(res=>{
      res.data.forEach((element: any) => {
        this.pendingResults.push(element)
      });
      //console.log(res.data)
    }).catch(err=>console.log(err))
    console.log(this.pendingResults)
  }
  getfriendlist(){
    this.friendList=[];
    axios.get('friendData').then(res=>{
      console.log(res.data)


    }).catch(err=>console.log(err))
    //console.log(this.friendList)
  }

}

