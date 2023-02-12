import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import axios from 'axios';
import { UserService } from '../login/user.service';
import {filter} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  @ViewChild('image') input!:ElementRef;
  radioActivaVal:any;
  radioAtGame:any = false;
  public  formData = new FormData();
  constructor(public user: UserService,private router : Router,private auth: AngularFireAuth) {
  //   router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  // )
  //     .subscribe(event => {
  //         console.log(event);
  //     });
  }
  public usr:any;
  public userparsed:any;
  public profileurl:any;

  ngOnInit(): void {
    //console.log(this.router.url);
    let lastUrl = this.router.url.split('/')[2]
    //console.log(lastUrl)
    if(lastUrl == 'post') this.radioActivaVal = 1
    if(lastUrl == 'games') this.radioActivaVal = 2;
    if(lastUrl == 'friends') this.radioActivaVal = 3;
    // this.radioAtGame = true
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        //console.log(this.userparsed)
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          this.profileurl = `http://localhost:3000/static/profilePicture/${user.uid}.jpg`
        }).catch(err =>console.log(err))
      }
    })
    this.usr = localStorage.getItem('user');
    this.usr=JSON.parse(this.usr);

    setInterval(() => {
      if(this.input.nativeElement.files[0]!=null){
        let reader = new FileReader();
        reader.onload = (e: any) => {
        this.profileurl = e.target.result;
    }
    reader.readAsDataURL(this.input.nativeElement.files[0]);
      }else{//console.log("null")
      }
    }, 1500);

  }

  changeToGame(){
    this.router.navigate(['profile-page','games']);
  }
  changeToPost(){
    this.router.navigate(['profile-page','post']);
  }
  changeToFriends(){
    this.router.navigate(['profile-page','friends']);
  }
  changeToLinkedAcc(){
    this.router.navigate(['profile-page','linked-accounts']);
  }
  upload(){
    console.log(this.input.nativeElement.files[0])
    let type = this.input.nativeElement.files[0].type
    if(type != "image/jpeg" && type != "image/jpg"){
      alert("wrong image type please upload jpg or Jpeg")
      return
    }

    this.formData.append("avatar", this.input.nativeElement.files[0]);
    axios.post('/uploadProfile', this.formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    console.log(this.input)

  }
}
