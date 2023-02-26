import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  selectedImage: any;
  public profileurl:any;
  constructor(public user: UserService ,private auth: AngularFireAuth,private renderer: Renderer2 ) { }

  public usr:any;
  public userparsed:any;
  public posts : any[] = [];
  @ViewChild('imageInput') input!:ElementRef;
  @ViewChild('tagInput') tagInput!:ElementRef;
  imageFile!: File;
  imageSrcs: string[] = [];
  ngOnInit(): void {
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        //console.log(this.userparsed.uid)
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          this.profileurl = `http://localhost:3000/static/profilePicture/${user.uid}.jpg`
        }).catch(err =>console.log(err))
      }
    })
    this.fetchPost()
   }
   fetchPost(){
    this.posts = []
    axios.get("/getPost").then(res=>{
      console.log(res.data)
      res.data.forEach((url : any)=> {
        let eachUrl  ="http://localhost:3000/static/post/" + url.data
        this.posts.push({url : eachUrl, id : url.id})
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
  likeButtonClick(post:any){
    axios.get(`/likePost?id=${post.id}` ).then(res =>{
      console.log(res)
    })
    console.log(post)
  }


  onFileSelected(event: any): void {
    const files: File[] = this.input.nativeElement.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = e => this.imageSrcs.push(reader.result as string);
        reader.readAsDataURL(files[i]);
      }
    }
  }
  removeImage(index: number): void {
    this.imageSrcs.splice(index, 1);
  }

  clearImages(): void {
    this.imageSrcs = [];
  }
}


