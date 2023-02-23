import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { ChatServicesService } from '../chat-page/chat-services.service';
import { UserService } from '../login/user.service';


@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',
  styleUrls: ['./primary-home-page.component.css']
})

export class PrimaryHomePageComponent implements OnInit {
  public show:boolean=true;
  public formData: any;
  public tagsList : string[] = [];

  constructor(public user: UserService ,private renderer: Renderer2 ) { }

  public usr:any;
  public userparsed:any;
  public posts : any[] = [];
  @ViewChild('image') input!:ElementRef;
  @ViewChild('tagInput') tagInput!:ElementRef;
  ngOnInit(): void {
    this.fetchPost()

   }
   fetchPost(){
    this.posts = []
    axios.get("/getPost").then(res=>{
      console.log(res.data)
      res.data.forEach((url : any)=> {
        let eachUrl  ="http://localhost:3000/static/post/" + url.data
        this.posts.push(eachUrl)
      });
    })
   }
   uploadPostFile(){
    console.error("click"  ,this.input)
    this.formData = new FormData();
    let type = this.input.nativeElement.files[0].type
    if(type != "image/jpeg" && type != "image/jpg"){
      alert("wrong image type please upload jpg or Jpeg")
      return
    }
    this.formData.append("post", this.input.nativeElement.files[0]);
    this.formData.append("data" , JSON.stringify({data : this.tagsList}) )
    axios.post('/createPost', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{

    }).catch(err =>console.log(err))
    //console.log(this.input)
    console.log(this.formData)
    this.tagsList = []
    this.fetchPost()
  }
  toggleMenu() {
    this.show=!this.show;
  }
  addTagToList(){
    this.tagsList.push(this.tagInput.nativeElement.value)
    this.tagInput.nativeElement.value = ""
  }

}
