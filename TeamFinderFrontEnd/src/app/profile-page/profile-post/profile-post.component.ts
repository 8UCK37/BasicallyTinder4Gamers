import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';

@Component({
  selector: 'app-profile-post',
  templateUrl: './profile-post.component.html',
  styleUrls: ['./profile-post.component.css']
})
export class ProfilePostComponent implements OnInit {
@ViewChild('image') input!:ElementRef;

constructor(private auth: AngularFireAuth) { }
public ownPosts:any=[];
public usr:any;
public userName:any;
  public userparsed:any;
  public profileurl:any;
  public utcDateTime:any;
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  ngOnInit() {
    this.getOwnPost();
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.usr = localStorage.getItem('user');
        this.userparsed=JSON.parse(this.usr);
        //console.log(this.userparsed.photoURL)
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          axios.post('getUserInfo',{frnd_id:this.userparsed.uid}).then(res=>{
            this.profileurl=res.data.profilePicture;
            this.userName=res.data.name;
           //console.log(res.data);
         }).catch(err=>console.log(err))
        }).catch(err =>console.log(err))
      }
    })
  }
  getOwnPost(){
    axios.get('getOwnpost').then(res=>{
      //console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.urlArr=post.photoUrl?.split(',')
      });
      this.ownPosts=res.data
      //console.log(this.ownPosts)
    }).catch(err=>console.log(err))
  }
  onProfilePicError() {
    this.profileurl = this.userparsed?.photoURL;
  }
  utcToLocal(utcTime:any){
    this.utcDateTime = new Date(utcTime);
    return this.utcDateTime.toLocaleString('en-US', { timeZone:this.timeZone });
}
}
