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
  ngOnInit(): void {
    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed=usr
      this.chatBackGroundUrl=`https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatBackground%2F${this.userparsed?.id}.jpg?alt=media&token=8f8ec438-1ee6-4511-8478-04f3c418431e`

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
