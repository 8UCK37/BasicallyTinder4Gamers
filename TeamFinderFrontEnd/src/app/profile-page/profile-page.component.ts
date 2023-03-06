import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import axios from 'axios';
import { UserService } from '../login/user.service';
import {filter} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  @ViewChild('image') input!:ElementRef;
  @ViewChild('banner') banner!:ElementRef;
  radioActivaVal:any;
  radioAtGame:any = false;

  constructor(public modalService: NgbModal, user: UserService,private router : Router,private auth: AngularFireAuth) {
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
  public bannerUrl:any;
  public bio:any;
  public dPsave:boolean=false;
  public bNsave:boolean=false;
  public formData:any;
  public userName:any;
  backgroundColor = 'rgb(255, 0, 0)';
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
        this.usr = localStorage.getItem('user');
        this.userparsed=JSON.parse(this.usr);
        //console.log(this.userparsed.photoURL)
        axios.get('saveuser').then(res=>{
          axios.post('getUserInfo',{frnd_id:this.userparsed.uid}).then(res=>{
            //console.log(res.data)
            this.profileurl=res.data.profilePicture;
            this.userName=res.data.name;
            this.bannerUrl=res.data.profileBanner;
            this.bio=res.data.bio;
           //console.log(res.data);
         }).catch(err=>console.log(err))
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
        this.dPsave=true;
      }
    reader.readAsDataURL(this.input.nativeElement.files[0]);
      }else{
        //console.log("null")
        this.dPsave=false;
      }

      if(this.banner.nativeElement.files[0]!=null){
        let reader = new FileReader();
        reader.onload = (e: any) => {
        this.bannerUrl = e.target.result;
        this.bNsave=true;
      }
    reader.readAsDataURL(this.banner.nativeElement.files[0]);
      }else{
        //console.log("null")
        this.bNsave=false;
      }
    }, 300);

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
  uploadProfilePic(){
    this.formData = new FormData();
    //this.input.nativeElement.value=null;
    //console.log(this.input.nativeElement.files[0])

    if(this.input.nativeElement.files[0]!=null){
      console.log("not null")
      let type = this.input.nativeElement.files[0].type
    if(type != "image/jpeg" && type != "image/jpg"){
      alert("wrong image type please upload jpg or Jpeg")
      return
    }
    }
    this.formData.append("avatar", this.input.nativeElement.files[0]);
    axios.post('/uploadProfile', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
      this.dPsave=false;
      this.input.nativeElement.value=null;
    }).catch(err =>console.log(err))
    //console.log(this.input)
    //console.log(this.formData)
  }
  cancelProfileUpload(){
    this.input.nativeElement.value=null;
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        //console.log(this.userparsed)
        axios.post('getUserInfo',{frnd_id:this.userparsed.uid}).then(res=>{
          this.profileurl=res.data.profilePicture;
         //console.log(res.data);
       }).catch(err=>console.log(err))
      }
    })
  }
  uploadBanner(){
    //this.banner.nativeElement.value=null;
    this.formData = new FormData();
    if(this.input.nativeElement.files[0]!=null){
      //console.log("not null")
      let type = this.input.nativeElement.files[0].type
    if(type != "image/jpeg" && type != "image/jpg"){
      alert("wrong image type please upload jpg or Jpeg")
      return
    }
    }
    this.formData.append("banner", this.banner.nativeElement.files[0]);
    axios.post('/uploadBanner', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
      this.bNsave=false;
      this.banner.nativeElement.value=null;
    }).catch(err =>console.log(err))
    //console.log(this.input)
  }
  cancelBannerUpload(){
    this.banner.nativeElement.value=null;
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        //console.log(this.userparsed)
        axios.post('getUserInfo',{frnd_id:this.userparsed.uid}).then(res=>{
          this.bannerUrl=res.data.profileBanner;
          //console.log(res.data);
       }).catch(err=>console.log(err))
      }
    })
  }
  setBio(){
    const textareaElement = document.getElementById("bio-text") as HTMLTextAreaElement;
    textareaElement.value=this.bio;
  }
  

  updateBio(){
    axios.post('updateBio',{bio:this.bio}).then(res=>{
      //console.log("updatebiohit")
      axios.post('getUserInfo',{frnd_id:this.userparsed.uid}).then(res=>{
        this.bio=res.data.bio;
        //console.log(res.data);
     }).catch(err=>console.log(err))
   }).catch(err=>console.log(err))
  }
  onProfilePicError() {
    this.profileurl = this.userparsed?.photoURL;
  }
  onBannerError() {
    this.bannerUrl = 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg';
  }
  combineUpload(){
    this.updateBio();
    this.uploadBanner();
    this.uploadProfilePic();
    //window.location.reload()
  }
}
