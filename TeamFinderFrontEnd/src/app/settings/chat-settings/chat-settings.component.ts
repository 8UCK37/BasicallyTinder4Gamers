import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.css']
})
export class ChatSettingsComponent implements OnInit {

  constructor() { }
  @ViewChild('image') input!:ElementRef;
  @ViewChild('previewImageElement', { static: false }) previewImageElement!: ElementRef<HTMLImageElement>;
  public formData:any;
  ngOnInit(): void {
  }

  previewImage() {
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
    }
    this.formData.append("chatbackground", this.input.nativeElement.files[0]);
    axios.post('chat/background', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{

      this.input.nativeElement.value=null;
    }).catch(err =>console.log(err))
    //console.log(this.input)
    //console.log(this.formData)
  }


  cancelSelect(){
    console.log("upload cancelled")
  }
}
