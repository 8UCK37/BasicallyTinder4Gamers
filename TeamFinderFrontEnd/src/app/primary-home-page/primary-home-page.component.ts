import { Component, ElementRef, OnInit, Renderer2, ViewChild,TemplateRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { UserService } from '../login/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommentService } from '../post/comment.service';

@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',
  styleUrls: ['./primary-home-page.component.css'],
})

export class PrimaryHomePageComponent implements OnInit {
  @ViewChild('comment') comment!: ElementRef;
  @ViewChild('closeComments') closeComments!: ElementRef;
  @ViewChild('commentbtn') commentbtn!: ElementRef;
  @ViewChild('imageInput') input!:ElementRef;
  @ViewChild('tagInput') tagInput!:ElementRef;
  public modalRef?: BsModalRef;
  public show:boolean=true;
  public formData: any;
  public selectedImage: any;
  public usr:any;
  public userparsed:any;
  public userInfo:any;
  public posts : any[] = [];
  public utcDateTime:any;
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public imageFile!: File;
  public imageSrcs: string[] = [];
  public tagList = [];
  public imageBlobs:any[]=[];
  myInterval = 0;
  activeSlideIndex = 0;
  constructor(private commentService: CommentService,public user: UserService ,private auth: AngularFireAuth,private renderer: Renderer2,private modalService: BsModalService , private userService : UserService ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.comment?.nativeElement.contains(e.target as HTMLElement) && e.target !== this.commentbtn?.nativeElement) {
        this.closeComments?.nativeElement.click();
      }
    });

  }
  // constructor(public user: UserService ,private auth: AngularFireAuth,private renderer: Renderer2,private modalService: BsModalService ) {}

  ngOnInit(): void {
    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);
    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed = usr;
      this.userInfo = usr;
      if(this.userparsed!=null){
        this.fetchPost();
      }

    })
    this.commentService.postsObj$.subscribe(posts => {
      this.posts= posts;
    });
   }

  fetchPost(){
    this.posts = []
    axios.get("/getPost").then(res=>{
      console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
        if(post.author!=this.userparsed.id){
        this.posts.push(post)
        }
      });
      this.commentService.setPostsObj(this.posts);
    })
   }
   fetchLatestPost(){
    axios.post("/getLatestPost").then(res=>{
      //console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
      });
    const newpost: any[]=[];
    //console.log(this.posts)
    for(var i=this.posts.length-1;i>=0;i--){
      newpost[i+1]=this.posts[i]
    }
    newpost[0]=res.data[0]
    this.posts=newpost
    })
   }
   uploadPostFile(){
    console.error("click"  ,this.input)
    this.formData = new FormData();
    if(this.input.nativeElement.files[0]!=null){
      //console.log("not null")
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
    //console.log(this.imageBlobs)
    this.formData.append("data" , JSON.stringify({data : this.tagList,desc:text}))
    axios.post('/createPost', this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
    }).catch(err =>console.log(err))
    //console.log(this.input)
    //console.log(this.formData.data)
    this.tagList = [];
    //console.log(this.tagList)
    this.clearImages()
    textareaElement.value=''
    this.ngOnInit()
    this.imageBlobs=[]
    setTimeout(() => {
      this.fetchLatestPost();
    }, 1500);
  }
  toggleMenu() {
    this.show=!this.show;
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
    this.imageBlobs.splice(index, 1);
    this.input.nativeElement.value ='';
  }

  clearImages(): void {
    this.imageSrcs = [];
    this.imageBlobs = [];
    this.input.nativeElement.value ='';
  }
  onProfilePicError() {
    //this.profileurl = this.userparsed?.photoURL;
  }
  async onPostPicError(i:any) {
    //console.log(this.posts[i].author)
    // await axios.post('getUserInfo',{id:this.posts[i].author}).then(res=>{
    //   //console.log(res.data)
    //   this.posts[i].authorUrl=res.data.profilePicture
    //   //console.log(res.data.profilePicture)
    // }).catch(err =>console.log(err))
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
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-xl' })
      );
  }

}



