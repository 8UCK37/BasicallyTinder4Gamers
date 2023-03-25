import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import axios from 'axios';
import { UserService } from '../login/user.service';
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
  ownProfile: any;
  userid:any;
  public usr:any;
  public userparsed:any;
  public userInfo:any;
  public bio:any;
  public bannerPreview:any;
  public dpPreview:any;
  public dPsave:boolean=false;
  public bNsave:boolean=false;
  public formData:any;
  public userName:any;
  public profile_id:any;
  public status:any;
  constructor(public userService:UserService,public modalService: NgbModal, user: UserService,private router : Router,private auth: AngularFireAuth,private route: ActivatedRoute) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
  }

  ngOnInit(): void {
    let lastUrl = this.router.url.split('/')[2]
    //console.log(lastUrl)
    if (lastUrl == 'post') this.radioActivaVal = 1
    if (lastUrl == 'games') this.radioActivaVal = 2;
    if (lastUrl == 'friends') this.radioActivaVal = 3;
    // this.radioAtGame = true
    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);
    if (this.ownProfile) {
      this.userService.userCast.subscribe(usr=>{
        //console.log("user data" , usr)
        this.userparsed = usr;
        this.userInfo = usr;
        this.bio = this.userInfo?.bio;
      })
    } else {
      this.route.queryParams.subscribe(async params => {
        this.radioActivaVal = 1
        this.profile_id = params['id'];
        //console.log(this.profile_id)
        axios.post('getUserInfo', { id: this.profile_id }).then(res => {
          //console.log(res.data)
          this.userInfo = res.data
        }).catch(err => console.log(err))
        axios.post('isFriend', { id: this.profile_id }).then(res => {
          //console.log(res.data)
          if (res.data == 'accepted') {
            this.status = { style: 'button', value: 'Friend' }
            //console.log(this.status)
          } else if (res.data == 'rejected') {
            //this.status = { style: 'fa-sharp fa-solid fa-ban fa-2x', value: '' }
            this.status = { style: 'button', value: 'Send Req' }
            //console.log(this.status)
          }
          else if (res.data == 'pending') {
            this.status = { style: 'button', value: 'Pending' }
            //console.log(this.status)
          }
          else {
            this.status = { style: 'button', value: 'Send Req' }
            //console.log(this.status)
          }
        }).catch(err => console.log(err))
      });
    }
  }
  changeToGame(){
    if(this.ownProfile){
      this.router.navigate(['profile-page','games']);
    }else{
      this.router.navigate(['user','games'],{ queryParams: { id: this.profile_id } });
    }
  }
  changeToPost(){
    if(this.ownProfile){
      this.router.navigate(['profile-page','post']);
    }else{
      this.router.navigate(['user','post'],{ queryParams: { id: this.profile_id } });
    }
  }
  changeToFriends(){
    if(this.ownProfile){
      this.router.navigate(['profile-page','friends']);
    }else{
      this.router.navigate(['user','friends'],{ queryParams: { id: this.profile_id } });
    }
  }
  changeToLinkedAcc(){
    if(this.ownProfile){
      this.router.navigate(['profile-page','linked-accounts']);
    }else{
      this.router.navigate(['user','linked-accounts'],{ queryParams: { id: this.profile_id } });
    }
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
    this.userInfo.profilePicture = this.dpPreview
  }
  cancelProfileUpload(){
    this.input.nativeElement.value=null;
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
    this.userInfo.profileBanner = this.bannerPreview
    //console.log(this.input)
  }
  cancelBannerUpload(){
    this.banner.nativeElement.value=null;
  }
  setBio(){
    const textareaElement = document.getElementById("bio-text") as HTMLTextAreaElement;
    textareaElement.value=this.bio;
  }

  updateBio(){
    axios.post('updateBio',{bio:this.bio}).then(res=>{
      this.userInfo.bio=this.bio;
   }).catch(err=>console.log(err))
  }

  combineUpload(){
    this.updateBio();
    this.uploadBanner();
    this.uploadProfilePic();
    //window.location.reload()
  }
  sendreq(){
    //console.log(this.status.value)
    if(this.status.value!='Pending' && this.status.value!='Friend'){
      axios.post('addFriend', { to:this.profile_id}).then(res => {
        this.status={style:'button',value:'Pending'}
        //console.log(this.status)
      }).catch(err => console.log(err))
      }
  }
  modalOpen(){
    this.bannerPreview=this.userInfo.profileBanner
    this.dpPreview=this.userInfo.profilePicture
    setInterval(() => {
      if(this.input.nativeElement.files[0]!=null){
        let reader = new FileReader();
        reader.onload = (e: any) => {
        this.dpPreview = e.target.result;
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
        this.bannerPreview = e.target.result;
        this.bNsave=true;
      }
    reader.readAsDataURL(this.banner.nativeElement.files[0]);
      }else{
        //console.log("null")
        this.bNsave=false;
      }
    }, 300);
  }
}
