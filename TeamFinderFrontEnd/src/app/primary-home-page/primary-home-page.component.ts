import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { UserService } from '../login/user.service';


@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',
  styleUrls: ['./primary-home-page.component.css'],
})

export class PrimaryHomePageComponent implements OnInit {
  public show:boolean=true;
  public formData: any;
  selectedImage: any;
  public profileurl:any;
  constructor(public user: UserService ,private auth: AngularFireAuth,private renderer: Renderer2 ) { }
  public usr:any;
  public userparsed:any;
  public posts : any[] = [];
  public utcDateTime:any;
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  @ViewChild('imageInput') input!:ElementRef;
  @ViewChild('tagInput') tagInput!:ElementRef;
  imageFile!: File;
  imageSrcs: string[] = [];
  public tagList = [];
  public imageBlobs:any[]=[];
  myInterval = 0;
  activeSlideIndex = 0;
  public userName:any;

  ngOnInit(): void {
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        //console.log(this.userparsed.uid)
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          axios.post('getUserInfo',{frnd_id:this.userparsed.uid}).then(res=>{
            this.profileurl=res.data.profilePicture;
            this.userName=res.data.name;
           //console.log(res.data);
         }).catch(err=>console.log(err))
        }).catch(err =>console.log(err))
        this.fetchPost()
      }
    })
   }
   fetchPost(){
    this.posts = []
    axios.get("/getPost").then(res=>{
      //console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
      });
      this.posts=res.data
    })
   }
   uploadPostFile(){
    console.error("click"  ,this.input)
    this.formData = new FormData();
    if(this.input.nativeElement.files[0]!=null){
      console.log("not null")
      let type = this.input.nativeElement.files[0].type
    if(type != "image/jpeg" && type != "image/jpg"){
      alert("wrong image type please upload jpg or Jpeg")
      return
    }
    }
    const textareaElement = document.getElementById("message-text") as HTMLTextAreaElement;
    const text = textareaElement.value;
    //console.log(this.input.nativeElement.files);
    for(let i=0;i< this.imageBlobs.length;i++){
      this.formData.append("post", this.imageBlobs[i]);

    }
    console.log(this.imageBlobs)
    this.formData.append("data" , JSON.stringify({data : this.tagList,desc:text}))
    axios.post('/createPost', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
    }).catch(err =>console.log(err))
    //console.log(this.input)
    //console.log(this.formData.data)
    this.tagList = [];
    this.fetchPost();
    //console.log(this.tagList)
    this.clearImages()
    textareaElement.value=''
    this.ngOnInit()
    this.imageBlobs=[]
  }
  toggleMenu() {
    this.show=!this.show;
  }
  //eta lagbei na direct item die korbo
  // addTagToList(){
  //   this.tagsList.push(this.tagInput.nativeElement.value)
  //   this.tagInput.nativeElement.value = ""
  // }
  likeButtonClick(post:any){
    axios.get(`/likePost?id=${post.id}` ).then(res =>{
      console.log(res)
    })
    console.log(post)
  }

  onFileSelected(event: any): void {

    const files: File[] = this.input.nativeElement.files;
    //console.log(this.input.nativeElement.files)

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        this.imageBlobs.push(files[i])
        reader.onload = e => this.imageSrcs.push(reader.result as string);
        reader.readAsDataURL(files[i]);
      }
    }
  }
  removeImage(index: number): void {
    this.imageSrcs.splice(index, 1);
    this.input.nativeElement.value ='';
  }

  clearImages(): void {
    this.imageSrcs = [];
    this.input.nativeElement.value ='';
  }
  onProfilePicError() {
    this.profileurl = this.userparsed?.photoURL;
  }
  async onPostPicError(i:any) {
    //console.log(this.posts[i].author)
    await axios.post('getUserInfo',{frnd_id:this.posts[i].author}).then(res=>{
      //console.log(res.data)
      this.posts[i].authorUrl=res.data.profilePicture
      //console.log(res.data.profilePicture)
    }).catch(err =>console.log(err))
  }
  utcToLocal(utcTime:any){
    this.utcDateTime = new Date(utcTime);
    return this.utcDateTime.toLocaleString('en-US', { timeZone:this.timeZone });
  }
  onNextClick(event:any) {
    event.preventDefault();
  }
  fetchByTag(tag:any){
    axios.get(`/getpostbytagname?tags=${tag}`).then(res=>{
      this.posts = []
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
      });
      this.posts=res.data
    })
    // console.log(tag)
  }

}


