import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { UserService } from '../login/user.service';
@Component({
  selector: 'app-Settings',
  templateUrl: './Settings.component.html',
  styleUrls: ['./Settings.component.css']
})
export class SettingsComponent implements OnInit {
  public newUserName: String="";
  posts: any;
  public userparsed:any;
  public userInfo:any;
  public bio:any;
  constructor(public userService:UserService) { }

  ngOnInit() {

    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed = usr;
      this.userInfo = usr;
      this.newUserName=this.userparsed.name
      this.bio = this.userInfo?.bio;
    })
  }

  async changeName() {
    console.log(this.newUserName);
    await axios.post('userNameUpdate', { name: this.newUserName }).then(res => {
      //console.log(res.data
      //console.log(res.data.profilePicture)
    }).catch(err => console.log(err))
    window.location.reload();
  }
  updateBio(){
    axios.post('updateBio',{bio:this.bio}).then(res=>{
      this.userInfo.bio=this.bio;
   }).catch(err=>console.log(err))
  }
}
