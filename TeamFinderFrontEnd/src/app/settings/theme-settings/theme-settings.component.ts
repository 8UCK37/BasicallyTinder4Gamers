import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { MessageService } from 'primeng/api';
import { Theme } from 'src/app/Service/themes';
import { UserService } from 'src/app/login/user.service';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.css'],
  providers: [MessageService]
})
export class ThemeSettingsComponent implements OnInit {
  responsiveOptions: any=[
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }];

  public themes:Theme[]=[]
  images: any[] =[];
  galeriaPosition: string = 'bottom';
  public selectedTheme:any;
  constructor(public userService:UserService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.userService.userCast.subscribe(usr=>{
      console.log("user data" , usr)
      this.getThemes();
    })
  }
  getThemes(){
    axios.get('/getThemes').then(res=>{
      console.log(res.data)
      this.themes=structuredClone(res.data)
      console.log(this.themes)
    }).catch(err =>console.log(err))
  }
  previewTheme(theme:any){
    this.images=[]
    console.log(theme)
    this.selectedTheme=theme.id
    this.images[0]=theme.homeBg
    this.images[1]=theme.profileBg
    console.log(this.images)
  }
  saveTheme(){
    console.log(typeof(this.selectedTheme))
    axios.post('/userThemeUpdate',{id:this.selectedTheme}).then(res=>{
      this.messageService.add({ severity: 'success', summary: 'Theme applied', detail: 'Selected Theme saved!!' });
    }).catch(err =>console.log(err))
  }
}
