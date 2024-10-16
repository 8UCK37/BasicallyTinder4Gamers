import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';
import { average } from 'color.js'
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.css'],
  providers: [MessageService]
})
export class ChatSettingsComponent implements OnInit {

  constructor(public userService:UserService,private messageService: MessageService) { }
  @ViewChild('image') input!:ElementRef;
  @ViewChild('previewImageElement', { static: false }) previewImageElement!: ElementRef<HTMLImageElement>;
  public chatBackGroundUrl:any;
  public formData:any;
  showEmojiPicker = false;
  public userparsed:any;
  public fileSelected:boolean=false;
  public visible:boolean=false;
  showSpinner:boolean=true;
  deleteSuccess:boolean=false;
  public averageHue:any;
  public defaultBackgrounds: String[]=[
    'https://i.imgur.com/COogfN1.jpeg'
    ,'https://i.imgur.com/RlCtvx0.jpeg'
    ,'https://i.imgur.com/JoL2BfK.jpeg'
    ,'https://i.imgur.com/P1g2Pp2.jpeg'
  ]
  public selectedIndex:any
  ngOnInit(): void {
    this.userService.userCast.subscribe(usr=>{
      console.log("user data" , usr)
      this.userparsed=usr
      console.log(this.defaultBackgrounds[parseInt(this.userparsed.chatBackground)])
      this.chatBackGroundUrl=this.defaultBackgrounds[parseInt(this.userparsed.chatBackground)]
      this.selectedIndex=parseInt(this.userparsed.chatBackground)
      average(this.chatBackGroundUrl,{format:'hex'}).then(color=>{
        //console.log(color)
        this.averageHue=color
      }).catch(err=>console.log(err))

    })
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
}
