import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import { MessageService } from 'primeng/api';
import { Theme } from 'src/app/Service/themes';
import { UserService } from 'src/app/login/user.service';
import { average } from 'color.js'
@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.css'],
  providers: [MessageService]
})
export class ThemeSettingsComponent implements OnInit {
  @ViewChild('image') input!:ElementRef;
  @ViewChild('previewImageElement', { static: false }) previewImageElement!: ElementRef<HTMLImageElement>;
  public userparsed:any;
  public themes:Theme[]=[]
  images: any[] =[];
  galeriaPosition: string = 'bottom';
  public selectedTheme:any;
  public responsiveOptions:any;
  public showChatPreview:boolean=false;
  public formData:any;
  public chatBackGroundUrl:any;
  public selectedIndex:any
  public averageHue:any;
  public fileSelected:boolean=false;
  public visible:boolean=false;
  showSpinner:boolean=true;
  deleteSuccess:boolean=false;
  showEmojiPicker = false;
  public defaultBackgrounds: String[]=[
    'https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatBackground%2Fchatbackground_1.jpg?alt=media&token=98132d9e-2a4e-4654-bb5a-d1306434af9c&_gl=1*1gb92rd*_ga*MTA1NzYzMDAxLjE2NzUwODExNjA.*_ga_CW55HF8NVT*MTY4NjA3MDIwNC4xNy4xLjE2ODYwNzAyMTkuMC4wLjA.'
    ,'https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatBackground%2Fchatbackground_2.jpg?alt=media&token=b2df323f-b806-4a14-844e-1849ac335db8&_gl=1*h3hgd7*_ga*MTA1NzYzMDAxLjE2NzUwODExNjA.*_ga_CW55HF8NVT*MTY4NjA3MDIwNC4xNy4xLjE2ODYwNzAyNDAuMC4wLjA.'
    ,'https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatBackground%2Fchatbackground_3.jpg?alt=media&token=9a4dd16b-d8bb-40e7-98e1-a5e65f663bec&_gl=1*zq1a90*_ga*MTA1NzYzMDAxLjE2NzUwODExNjA.*_ga_CW55HF8NVT*MTY4NjA3MDIwNC4xNy4xLjE2ODYwNzAyNTIuMC4wLjA.'
    ,'https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatBackground%2Fchatbackground_4.jpg?alt=media&token=e38faaab-011d-4142-99fd-08f1940159db&_gl=1*22ljas*_ga*MTA1NzYzMDAxLjE2NzUwODExNjA.*_ga_CW55HF8NVT*MTY4NjY2MTE2OC4yNi4xLjE2ODY2NjE0OTcuMC4wLjA.'
  ]
  constructor(public userService:UserService,private messageService: MessageService) {
    this.responsiveOptions=[
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
   }

  ngOnInit(): void {
    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed=usr
      this.chatBackGroundUrl=this.defaultBackgrounds[parseInt(this.userparsed.chatBackground)]
      this.selectedIndex=parseInt(this.userparsed.chatBackground)
      average(this.chatBackGroundUrl,{format:'hex'}).then(color=>{
        //console.log(color)
        this.averageHue=color
      }).catch(err=>console.log(err))
      this.getThemes();

    })
  }

  getThemes(){
    axios.get('/getThemes').then(res=>{
      //console.log(res.data)
      this.themes=structuredClone(res.data)
      console.log(this.themes)
    }).catch(err =>console.log(err))
  }
  previewTheme(theme:any){
    this.images=[]
    this.selectedTheme=theme.id
    this.images[0]=theme.homeBg
    this.images[1]=theme.profileBg
  }
  saveTheme(){
    axios.post('/userThemeUpdate',{id:this.selectedTheme}).then(res=>{
      this.userparsed.theme=this.themes[this.selectedTheme-1]
      this.userService.setCurrentUserChanges(this.userparsed)
      this.messageService.add({ severity: 'success', summary: ` Theme saved`, detail: `${this.userparsed.theme.name} theme applied!!` });
    }).catch(err =>console.log(err))
  }
  toggleAccordion(buttonId: string) {
    const button = document.getElementById(buttonId) as HTMLButtonElement;
    const expanded = button.getAttribute('aria-expanded');
    button.setAttribute('aria-expanded', expanded === 'true' ? 'false' : 'true');
    if(buttonId=="accordion-button-1"){
      this.images[0]=this.userparsed.theme.homeBg
      this.images[1]=this.userparsed.theme.profileBg
      this.showChatPreview=false
      const secondButton=document.getElementById("accordion-button-2") as HTMLButtonElement;
      secondButton.setAttribute('aria-expanded', 'false');
    }else{
      this.showChatPreview=true
      const secondButton=document.getElementById("accordion-button-1") as HTMLButtonElement;
      secondButton.setAttribute('aria-expanded', 'false' );
    }

  }

  changeChatBackground(index:number){
    this.selectedIndex=index
    this.chatBackGroundUrl=this.defaultBackgrounds[index]
    //this.messageService.add({ severity: 'info', summary: `Background no: ${index+1}`, detail: 'Selected Background Applied!!' });
    average(this.chatBackGroundUrl,{format:'hex'}).then(color=>{
      //console.log(color)
      this.averageHue=color
    }).catch(err=>console.log(err))
  }
  saveSelectedChatBg(){
    this.userparsed.chatBackground=this.selectedIndex.toString()
    //console.log(this.userparsed)
    this.userService.setCurrentUserChanges(this.userparsed)
    axios.post('/chat/selectChatBg',{index:this.selectedIndex}).then(res=>{
      this.messageService.add({ severity: 'success', summary: 'Chat Background applied', detail: 'Selected Background saved!!' });
    }).catch(err =>console.log(err))

  }
  previewImage() {
    this.fileSelected = true;
    const file = this.input.nativeElement.files[0];
    const reader = new FileReader();
    if(this.input.nativeElement.files[0]!=null){
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          average(img, { format: 'hex' }).then(color => {
            //console.log(color);
            this.averageHue = color;
          }).catch(err => console.log(err));
        }
        img.src = reader.result as string;
        this.previewImageElement.nativeElement.src = img.src;
      }
      reader.readAsDataURL(file);
    }
  }

  uploadChatBackground(){
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
      this.formData.append("chatbackground", this.input.nativeElement.files[0]);
      this.showUploadProgress()
      axios.post('chat/background', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
          this.input.nativeElement.value=null;
        }).catch(err =>console.log(err))
      }else{
        this.messageService.add({ severity: 'error', summary: 'No image selected', detail: 'No image to upload' });
      }

  }


  cancelSelect(){
    //console.log("upload cancelled")
    this.fileSelected=false;
    if(this.input.nativeElement.value[0]!=null){
      this.messageService.add({ severity: 'info', summary: 'Selected image discarded', detail: 'Selected Image discarded' });
    }else{
      this.messageService.add({ severity: 'warn', summary: 'No image selcted', detail: 'No Image has yet been selected by you' });
    }
    this.input.nativeElement.value=null;
    average(this.chatBackGroundUrl,{format:'hex'}).then(color=>{
      //console.log(color)
      this.averageHue=color
    }).catch(err=>console.log(err))
  }
  showUploadProgress() {
    this.visible=true
    setTimeout(() => {
      this.showSpinner=false
    }, 2000);
    this.showSpinner=true

  }
  closeUploadDialog(){
    this.visible = !this.visible;
    setTimeout(() => {
      window.location.reload()
    }, 500);
  }




}
