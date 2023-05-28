import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import axios from 'axios';
import { UserService } from 'src/app/login/user.service';
import { UtilsServiceService } from '../utils-service.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { first} from 'rxjs/internal/operators/first';
import { take } from 'rxjs/internal/operators/take';
import { CommentService } from 'src/app/post/comment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.css']
})
export class CreatePostModalComponent implements OnInit {
  public userInfo:any;
  public userparsed:any;
  public imageBlobs:any[]=[];
  public imageSrcs: string[] = [];
  public formData: any;
  public tagList = [];
  public modalRef?: BsModalRef;
  selectImage:any;
  postData?:any;
  ownProfile: any;
  public ownPosts:any=[];
  public mentionList:any[]=[];
  @ViewChild('imageInput') imageInput!:ElementRef;
  @ViewChild('textInput') textInput!:ElementRef;
  @ViewChild('modal') modal!:TemplateRef<any>;
  isOpen:boolean = false;
  desc: any;
  textObj: any;
  edit:boolean=false
  share:boolean=false
  constructor(private commentService: CommentService,private route: ActivatedRoute,private modalService: BsModalService , public userService: UserService , public utilsServiceService : UtilsServiceService) {
    this.ownProfile = this.route.snapshot.data['ownProfile'];
  }

  ngOnInit() {
    this.userService.userCast.subscribe((usr:any)=>{
      //console.log("user data" , usr)
      this.userparsed = usr;
      this.userInfo = usr;
      if(this.userparsed!=null){
      }

    })

    this.modalService.onHide.pipe(take(1)).subscribe(()=>{
      // alert("close")
      // this.utilsServiceService.modalObjSource.next({open:false })
      this.isOpen = false
    })

    this.utilsServiceService.postModalObj.subscribe((modalData:any)=>{
      console.log(modalData)
      this.share=modalData.share
      this.edit=false
      if(modalData.data){
        this.edit=true
        this.postData =  modalData.data
        this.desc = modalData.data.description
        this.imageSrcs=modalData.data.photoUrlArr
        console.log(this.desc)
        //console.log(modalData, this.modalData)
      }

      if( modalData.open){
        this.openModal(this.modal )
        this.isOpen = true
      }
    })


  }
  ngAfterViewInit(){
    console.log(this.imageInput)
 }

  adjustHeight(e:any){
    e.target.style.height = "5px";
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

  onFileSelected(event: any): void {
    const files: File[] = event.target.files;
    console.log(this.imageSrcs , files)

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        this.imageBlobs.push(files[i])
        reader.onload = e => this.imageSrcs.push(reader.result as string);
        reader.readAsDataURL(files[i]);
      }
    }
    event.target.value = ''
  }

  clearImages(): void {
    this.imageSrcs = [];
    this.imageBlobs = [];
    // this.imageInput.nativeElement.value ='';
  }

  removeImage(index: number): void {
    this.imageSrcs.splice(index, 1);
    this.imageBlobs.splice(index, 1);
    // this.imageInput.nativeElement.value ='';
  }

  uploadPostFile() {

    this.formData = new FormData();
    if (this.imageSrcs && this.imageSrcs.length != 0) {

    }

    for (let i = 0; i < this.imageBlobs.length; i++) {
      this.formData.append("post", this.imageBlobs[i]);

    }


    if(this.edit && !this.share){
      console.log("first")
      this.formData.append("data", JSON.stringify({id:this.postData.id, data: this.tagList, desc: this.textObj }))
      console.log("this is a edit",{ data: this.tagList, desc: this.textObj })
      axios.post('/editPost', this.formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
      }).catch(err => console.log(err))
      setTimeout(() => {
        this.getPostById(this.userparsed?.id);
      }, 1500);
     }
    else if(this.edit && this.share){
      console.log("here")
      axios.post('/shareToFeed', { data:{ id:this.postData.id,tags: this.tagList, desc: this.textObj } }).then(res => {
      }).catch(err => console.log(err))
    }
    else{
      this.formData.append("data", JSON.stringify({ data: this.tagList, desc: this.textObj }))
    axios.post('/createPost', this.formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
    }).catch(err => console.log(err))
    }

    this.tagList = [];

    this.clearImages()
    this.isOpen = false

    this.utilsServiceService.postModalObjSource.next({ open: false })
    this.closeModal(this.modal)

    this.imageBlobs = []

    this.mentionNotification(this.textObj)

  }
  openModal(template: TemplateRef<any>) {
    console.log("open")
    this.modalRef = this.modalService.show(template,
      //  Object.assign({}, { class: 'gray modal-xl' })
      );
  }

  closeModal(template: TemplateRef<any>){
    this.imageSrcs = [];
    this.edit=false;
    this.modalService.hide()
    this.isOpen = false
  }

  update(data:any){
    console.log(data)
    this.textObj = data
  }

  mentionNotification(data:any){
    this.mentionList=[]
    if (Array.isArray(data)) {
    data.forEach((ele:any) => {
      //console.log(ele)
      if(ele.insert.mention){
        //console.log(ele.insert.mention)
        this.mentionList.push({id:ele.insert.mention.id})
      }
    });

    //console.log(this.mentionList)
    axios.post('/mention',{mentionlist:this.mentionList}).then(res=>{
    }).catch(err =>console.log(err))
    }
  }
  getPostById(id:any){
    axios.post('getPostById',{uid:id}).then(res=>{
      console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
        post.isOwnPost=true
        if(post.shared!=null){
          post.parentpost=JSON.parse(post.parentpost)
          post.parentpost.tagArr=post.parentpost.tagnames?.split(',')
          post.photoUrlArr=post.parentpost.photoUrl?.split(',')
        }
      });
      this.ownPosts=res.data
      console.log(this.ownPosts)
      this.commentService.setOwnPostsObj(this.ownPosts);
    }).catch(err=>console.log(err))
  }
}
