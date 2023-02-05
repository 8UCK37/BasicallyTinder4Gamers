import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-profile-post',
  templateUrl: './profile-post.component.html',
  styleUrls: ['./profile-post.component.css']
})
export class ProfilePostComponent implements OnInit {
  @ViewChild('image') input!:ElementRef;
  constructor() { }

  ngOnInit() {
  }
  upload(){
    var formData = new FormData();
    console.log(this.input.nativeElement.files[0])
    let type = this.input.nativeElement.files[0].type
    if(type != "image/jpeg" && type != "image/jpg"){
      alert("wrong image type please upload jpg or Jpeg")
      return
    }
    formData.append("avatar", this.input.nativeElement.files[0]);
    axios.post('/uploadProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    console.log(this.input)
  }

}
