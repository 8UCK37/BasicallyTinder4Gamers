import { Component,ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() posts: any[]=[];
  @ViewChild('comment') comment!: ElementRef;
  @ViewChild('closeComments') closeComments!: ElementRef;
  @ViewChild('commentbtn') commentbtn!: ElementRef;
  public commentOpen:boolean=false;
  myInterval = 0;
  activeSlideIndex = 0;
  public utcDateTime:any;
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  constructor(private renderer: Renderer2) {
    // this.renderer.listen('window', 'click', (e: Event) => {
    //   const clickedElement = e.target as HTMLElement;
    //   const clickedElementClassList = clickedElement.classList;
    //   if (!this.comment?.nativeElement.contains(e.target as HTMLElement) && !this.commentbtn?.nativeElement.contains(e.target as HTMLElement)) {
    //     if(this.commentOpen && clickedElementClassList[0]!='comment-btn'){
    //     this.closeComments.nativeElement.click();
    //     this.commentOpen=false
    //   }
    //     //console.log("caught")
    //   }
    // });
   }

  ngOnInit(): void {
  }
  likeButtonClick(post:any,type:String){
    if((post.likedbycurrentuser && type=='like')||(post.hahaedbycurrentuser && type=='haha')||(post.lovedbycurrentuser && type=='love')||(post.sadedbycurrentuser && type=='sad')||(post.poopedbycurrentuser && type=='poop')){
      //console.log("dislike call")
      console.log(type)
      post.likedbycurrentuser=false
      post.hahaedbycurrentuser=false
      post.lovedbycurrentuser=false
      post.sadedbycurrentuser=false
      post.poopedbycurrentuser=false
      post.noreaction=true
      axios.post('/dislikePost',{id:post.id,type:type} ).then(res =>{
        console.log(res)
     });
    }else{
      if(type=='like'){
        console.log("liked")
        post.likedbycurrentuser=!post.likedbycurrentuser
        post.hahaedbycurrentuser=false
        post.lovedbycurrentuser=false
        post.sadedbycurrentuser=false
        post.poopedbycurrentuser=false
        axios.post('/likePost',{id:post.id,type:type} ).then(res =>{
              //console.log(res)
              post.noreaction=false
           });
      }else if(type=='haha'){
        //console.log("hahaed")
        post.hahaedbycurrentuser=!post.hahaedbycurrentuser
        post.likedbycurrentuser=false
        post.lovedbycurrentuser=false
        post.sadedbycurrentuser=false
        post.poopedbycurrentuser=false
        post.noreaction=false
        axios.post('/likePost',{id:post.id,type:type} ).then(res =>{
          console.log(res)
       });
      }else if(type=='love'){
        //console.log("loved")
        post.likedbycurrentuser=false
        post.hahaedbycurrentuser=false
        post.sadedbycurrentuser=false
        post.poopedbycurrentuser=false
        post.noreaction=false
        post.lovedbycurrentuser=!post.lovedbycurrentuser
        axios.post('/likePost',{id:post.id,type:type} ).then(res =>{
          console.log(res)
       });
      }else if(type=='sad'){
        //console.log("saded")
        post.likedbycurrentuser=false
        post.hahaedbycurrentuser=false
        post.lovedbycurrentuser=false
        post.poopedbycurrentuser=false
        post.noreaction=false
        post.sadedbycurrentuser=!post.sadedbycurrentuser
        axios.post('/likePost',{id:post.id,type:type} ).then(res =>{
          console.log(res)
       });
      }else if(type=='poop'){
        //console.log("pooped")
        post.likedbycurrentuser=false
        post.hahaedbycurrentuser=false
        post.lovedbycurrentuser=false
        post.sadedbycurrentuser=false
        post.noreaction=false
        post.poopedbycurrentuser=!post.poopedbycurrentuser
        axios.post('/likePost',{id:post.id,type:type} ).then(res =>{
          console.log(res)
       });
      }
    }
    console.log(this.posts)
  }

  fetchByTag(tag:any){
    this.posts = []
    axios.post('/getpostbytagname',{tags:tag}).then(res=>{
      console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
      });
      this.posts=res.data
    })
    // console.log(tag)
  }
  utcToLocal(utcTime:any){
    this.utcDateTime = new Date(utcTime);
    return this.utcDateTime.toLocaleString('en-US', { timeZone:this.timeZone });
  }
  openComment(){
    this.commentOpen=true
  }
}
