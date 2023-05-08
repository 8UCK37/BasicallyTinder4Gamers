import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
    
  }
}
