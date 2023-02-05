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
  public show: boolean = true;
  public hide: boolean = false;
  public buttonName: any = 'Show';

  constructor(public user: UserService, private auth: AngularFireAuth) { }
  public usr: any;
  public userparsed: any;
  public pendingResults: any[] = [];
  public friendList: any[] = [];
  public profileurl: any;
  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);
    this.getfriendlist();
    this.getPendingReq();

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
  }
  sendReq(data: string) {
    axios.post('addFriend', { from: this.userparsed.uid, to: data }).then(res => {
      console.log("sent req", res)
    }).catch(err => console.log(err))
    //console.log(this.userparsed)
  }
  getPendingReq() {
    this.pendingResults = []
    axios.get('getPendingRequest').then(res => {
      res.data.forEach((element: any) => {
        this.pendingResults.push(element)
      });
      //console.log(res.data)
    }).catch(err => console.log(err))
    console.log(this.pendingResults)
  }
  getfriendlist() {
    this.friendList = [];
    axios.get('friendData').then(res => {
      res.data.forEach((element: any) => {
        this.friendList.push({ element })
      });

    }).catch(err => console.log(err))
    console.log(this.friendList)
  }
  toggle() {
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
