import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.css']
})
export class ChatSettingsComponent implements OnInit {

  constructor(public userService:UserService) { }
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
  ngOnInit(): void {
    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed=usr
      this.chatBackGroundUrl=`https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatBackground%2F${usr.id}.jpg?alt=media&token=8f8ec438-1ee6-4511-8478-04f3c418431e`
    })
  }

  previewImage() {
    this.fileSelected=true
    const file = this.input.nativeElement.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImageElement.nativeElement.src = reader.result as string;
    }
    reader.readAsDataURL(file);
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
      axios.post('chat/background', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
          this.input.nativeElement.value=null;
        }).catch(err =>console.log(err))
      }else{
      console.log("empty")
      }
    this.showUploadProgress()
  }


  cancelSelect(){
    console.log("upload cancelled")
    this.fileSelected=false;
    this.input.nativeElement.value=null;
  }
  showUploadProgress() {
    this.visible=true
    setTimeout(() => {
      this.showSpinner=false
    }, 2000);
    this.showSpinner=true
  }
  closeDelete(){
    this.visible = !this.visible;
  }
}
