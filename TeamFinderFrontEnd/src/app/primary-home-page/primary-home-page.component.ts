import { Component, ElementRef, OnInit, Renderer2, ViewChild,TemplateRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { UserService } from '../login/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommentService } from '../post/comment.service';
import { UtilsServiceService } from '../utils/utils-service.service';

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
  @ViewChild('textInput') textInput!:ElementRef;
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
  constructor(private commentService: CommentService,public user: UserService ,private auth: AngularFireAuth,private renderer: Renderer2,private modalService: BsModalService , private userService : UserService , public utilsServiceService : UtilsServiceService) {
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
    // this.utilsServiceService.modalObj$.subscribe((modalData:any)=>{
    //   console.log(modalData)
    // })
    this.commentService.postsObj$.subscribe(posts => {
      this.posts= posts;
    });
   }

  fetchPost(){
    axios.get("/getPost").then(res=>{
      //console.log(res.data)
      this.posts = []
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
        if(post.author!=this.userparsed.id){
          post.isOwnPost=false
          this.posts.push(post)
        }
        if(post.shared!=null){
          post.parentpost=JSON.parse(post.parentpost)
          post.parentpost.tagArr=post.parentpost.tagnames?.split(',')
          post.photoUrlArr=post.parentpost.photoUrl?.split(',')
        }
      });
      this.commentService.setPostsObj(this.posts);
      console.log(this.posts)
    })
   }

   fetchLatestPost(){
    axios.post("/getLatestPost").then(res=>{
      //console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
        post.noreaction=true;
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

  toggleMenu() {
    this.show=!this.show;
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

  openModal(){
    this.utilsServiceService.modalObjSource.next({open:true, data:null})
  }
}



