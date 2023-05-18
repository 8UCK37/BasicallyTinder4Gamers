import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import { UserService } from '../login/user.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-Settings',
  templateUrl: './Settings.component.html',
  styleUrls: ['./Settings.component.css']
})
export class SettingsComponent implements OnInit {
  public newUserName: String="";
  posts: any;
  public userparsed:any;
  public userInfo:any={name:""};
  public bio:any;
  public info:any={Country:"",Gender:""};
  public cardStyle?: any;
  public cardStyle2?: any;
  public tab:any;
  selected1?: string;
  selected2?: string;
  public indianStates: string[] = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ];
  public gender: string[] = [
    "Male",
    "Female",
    "Other"
  ];
  constructor(public userService:UserService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.tab = params['tab'];
      //console.log(this.tab)
    })
    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      if(usr){
      this.userparsed = usr;
      this.userInfo = usr;
      //console.log(this.userInfo)
      this.newUserName=this.userparsed.name
      this.bio = this.userInfo?.bio;
      axios.post('getUserInfo',{id:usr.id}).then(res => {
        this.info=res.data.userInfo;
        console.log(res.data.userInfo)
      })
      }
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
  countrySelect(index:number){
    // console.log(index)
    // console.log(this.states[index])
    this.selected1 = this.indianStates[index]
    this.cardStyle2 = []
    this.cardStyle = []
  }
  updateinfo(){

  }

}
