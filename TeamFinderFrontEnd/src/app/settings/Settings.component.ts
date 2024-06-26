import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import axios from 'axios';
import { UserService } from '../login/user.service';
import { ActivatedRoute } from '@angular/router';
import { UtilsServiceService } from '../utils/utils-service.service';

@Component({
  selector: 'app-Settings',
  templateUrl: './Settings.component.html',
  styleUrls: ['./Settings.component.css']
})
export class SettingsComponent implements OnInit {
  public newUserName: String = "";
  posts: any;
  public userparsed: any;
  public userInfo: any = { name: "" };
  public bio: any;
  public info: any = { Country: "", Gender: "" };
  public cardStyle?: any;
  public cardStyle2?: any;
  public tab: any;
  selected1?: string;
  selected2?: string;
  public newCountry: String = "";
  public newLanguage: String = "";
  public countries: string[]=[]
  public gender: string[] = [
    "Male",
    "Female",
    "Other"
  ];
  visibilityPref: any[]=[] ;
  public langSelect :boolean=false;
  selectedfriendPref: any;
  selectedLinkedPref: any;
  //public languages: string[] = ["Bengali", "Hindi", "English"]
  languages!: Array<{ label: string; id: number }>;

  selectedLanguages!: Array<{ label: string; id: number }>;

  constructor(public userService: UserService, private route: ActivatedRoute,public utilsServiceService : UtilsServiceService) {
    this.countries=this.utilsServiceService.getCountries();
    this.languages =this.utilsServiceService.languages;
   }


  ngOnInit() {
    this.visibilityPref = [
      { name: 'Public', icon: './../../assets/icon-resource/public.png' },
      { name: 'OnlyFriends', icon: './../../assets/icon-resource/people.png' },
      { name: 'Private', icon: './../../assets/icon-resource/compliant.png' },
    ];
    this.route.queryParams.subscribe(async params => {
      this.tab = params['tab'];
      //console.log(this.tab)
    })
    this.userService.userCast.subscribe(usr => {
      //console.log("user data" , usr)
      if (usr) {
        this.userparsed = usr;
        this.newUserName = this.userparsed.name
        this.bio = this.userInfo?.bio;
        axios.post('getUserInfo', { id: usr.id }).then(res => {
          this.userInfo = res.data[0].userInfo;
          console.log(this.userInfo)
          this.selectedfriendPref=this.visibilityPref[this.userInfo.frnd_list_vis]
          this.selectedLinkedPref=this.visibilityPref[this.userInfo.linked_acc_vis]
          this.parseSelectedLanguages(this.userInfo)
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
  updateBio() {
    axios.post('updateBio', { bio: this.bio }).then(res => {
      this.userInfo.bio = this.bio;
    }).catch(err => console.log(err))
  }
  countrySelect(index: number) {
    // console.log(index)
    // console.log(this.states[index])
    this.selected1 = this.countries[index]
    this.cardStyle2 = []
    this.cardStyle = []
  }
  userLanguageSelect(index: number) {
    //this.selected2 = this.languages[index]
    this.cardStyle = []
    this.cardStyle2 = []
  }
  updateinfo() {
    axios.post('updateUserData', {data:this.userInfo}).then(res => {
    }).catch(err => console.log(err))
  }

  updateFriendListVis(){
    console.log(this.visibilityPref.indexOf(this.selectedfriendPref))
    axios.post('updateFriendListVisPref', {pref:this.visibilityPref.indexOf(this.selectedfriendPref)}).then(res => {
    }).catch(err => console.log(err))
  }
  updateLinkedAccVis(){
    console.log(this.visibilityPref.indexOf(this.selectedLinkedPref))
    axios.post('updateLinkedVisPref', {pref:this.visibilityPref.indexOf(this.selectedLinkedPref)}).then(res => {
    }).catch(err => console.log(err))
  }

  updateSelectedLanguage(){
    let dbString:String=""
    for(let i=0;i<this.selectedLanguages.length;i++){
      if(i==0){
        dbString=this.selectedLanguages[i].id.toString()
      }else{
        dbString=dbString+","+this.selectedLanguages[i].id.toString()
      }
    }
    axios.post('updateUserSelectedLanguages', {data:this.userInfo,list:dbString}).then(res => {
    }).catch(err => console.log(err))
  }

  parseSelectedLanguages(info:any){
    const list=info.Language.split(",")
    this.selectedLanguages=[]
    let dump=[]
    for(let i of list){
      dump.push(this.languages[i-1])
    }
    this.selectedLanguages=structuredClone(dump)
  }
}


