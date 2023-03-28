import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import axios from 'axios';
import { CommentService } from './comment.service';

interface Comment {
  author: String
  commentOf?: String
  commentStr
  : String
  createdAt
  : String
  id
  : Number
  postsId
  :
  Number
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})


export class PostComponent implements OnInit {

  @Input() posts: any[] = [];
  @ViewChild('comment') comment!: ElementRef;
  @ViewChild('closeComments') closeComments!: ElementRef;
  @ViewChild('commentbtn') commentbtn!: ElementRef;
  @ViewChild('commentbox')
  commentbox!: ElementRef;
  parentComment: any;
  @Input() public commentOpen: boolean = false;
  myInterval = 0;
  activeSlideIndex = 0;
  public utcDateTime: any;
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // commentData: Comment[] = [];
  public treeObj: any = {}
  constructor(private commentService: CommentService,private renderer: Renderer2, @Inject(DOCUMENT) document: Document) {
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
    console.log(this.commentbox)
    setInterval(() => {
      console.log("post",this.commentOpen);
    }, 2000);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['commentOpen']) {
      // Call your function here
      console.log("detected")
      this.toggleComment()
    }
  }
  likeButtonClick(post: any, type: String) {
    if ((post.likedbycurrentuser && type == 'like') || (post.hahaedbycurrentuser && type == 'haha') || (post.lovedbycurrentuser && type == 'love') || (post.sadedbycurrentuser && type == 'sad') || (post.poopedbycurrentuser && type == 'poop')) {
      //console.log("dislike call")
      console.log(type)
      post.likedbycurrentuser = false
      post.hahaedbycurrentuser = false
      post.lovedbycurrentuser = false
      post.sadedbycurrentuser = false
      post.poopedbycurrentuser = false
      post.noreaction = true
      axios.post('/dislikePost', { id: post.id, type: type }).then(res => {
        console.log(res)
      });
    } else {
      if (type == 'like') {
        console.log("liked")
        post.likedbycurrentuser = !post.likedbycurrentuser
        post.hahaedbycurrentuser = false
        post.lovedbycurrentuser = false
        post.sadedbycurrentuser = false
        post.poopedbycurrentuser = false
        axios.post('/likePost', { id: post.id, type: type }).then(res => {
          //console.log(res)
          post.noreaction = false
        });
      } else if (type == 'haha') {
        //console.log("hahaed")
        post.hahaedbycurrentuser = !post.hahaedbycurrentuser
        post.likedbycurrentuser = false
        post.lovedbycurrentuser = false
        post.sadedbycurrentuser = false
        post.poopedbycurrentuser = false
        post.noreaction = false
        axios.post('/likePost', { id: post.id, type: type }).then(res => {
          console.log(res)
        });
      } else if (type == 'love') {
        //console.log("loved")
        post.likedbycurrentuser = false
        post.hahaedbycurrentuser = false
        post.sadedbycurrentuser = false
        post.poopedbycurrentuser = false
        post.noreaction = false
        post.lovedbycurrentuser = !post.lovedbycurrentuser
        axios.post('/likePost', { id: post.id, type: type }).then(res => {
          console.log(res)
        });
      } else if (type == 'sad') {
        //console.log("saded")
        post.likedbycurrentuser = false
        post.hahaedbycurrentuser = false
        post.lovedbycurrentuser = false
        post.poopedbycurrentuser = false
        post.noreaction = false
        post.sadedbycurrentuser = !post.sadedbycurrentuser
        axios.post('/likePost', { id: post.id, type: type }).then(res => {
          console.log(res)
        });
      } else if (type == 'poop') {
        //console.log("pooped")
        post.likedbycurrentuser = false
        post.hahaedbycurrentuser = false
        post.lovedbycurrentuser = false
        post.sadedbycurrentuser = false
        post.noreaction = false
        post.poopedbycurrentuser = !post.poopedbycurrentuser
        axios.post('/likePost', { id: post.id, type: type }).then(res => {
          console.log(res)
        });
      }
    }
    console.log(this.posts)
  }

  fetchByTag(tag: any) {
    this.posts = []
    axios.post('/getpostbytagname', { tags: tag }).then(res => {
      console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr = post.tagnames?.split(',')
        post.photoUrlArr = post.photoUrl?.split(',')
      });
      this.posts = res.data
    })
    // console.log(tag)
  }
  utcToLocal(utcTime: any) {
    this.utcDateTime = new Date(utcTime);
    return this.utcDateTime.toLocaleString('en-US', { timeZone: this.timeZone });
  }
  openComment(e: any) {
    console.log(e)
    this.commentOpen = true
    this.toggleComment()
    this.fetchComment()
  }
  fetchComment() {
    axios.get('/comment').then(res => {
      let commentData = res.data[0].comments
      this.filetercomment(commentData)
    })
  }
  filetercomment(commentData: any) {
    console.log(commentData[0].author)
    let hashMap = new Map()
    let dirComment: any[] = [];
    commentData.forEach((ele: any) => {
      if (ele.commentOf != null) {
        if (!hashMap.get(ele.commentOf)) {
          hashMap.set(ele.commentOf, [ele])
        } else {
          hashMap.get(ele.commentOf).push(ele)
        }

      } else {
        dirComment.push(ele)
      }
    });

    this.treeObj = {}
    for (let i = 0; i < dirComment.length; i++) {
      let key = dirComment[i].id
      dirComment[i].edges = hashMap.get(dirComment[i].id)
    }
    this.treeObj["nodes"] = dirComment
    console.log(this.treeObj)
    console.log(this.commentbox)
  }
  submit(data: any, id: any) {
    console.log(data, id)
    let forms = document.querySelectorAll<HTMLInputElement>('.form-p input');
    forms.forEach(elm => {
      if (id == elm.id) {
        console.log(elm.value)
        if (elm.value == "") return
        axios.post('/comment/add', {
          "postId": 3,
          "commentOf": id,
          "msg": elm.value
        }).then(res => {
          console.log(res)
        })
        return;
      }

    });
  }
  parentCommentSave() {
    console.log(this.parentComment)
    axios.post('/comment/add', {
      "postId": 3,
      "msg": this.parentComment
    }).then(res => {
      console.log(res)
    })
  }
  toggleComment() {
    this.commentService.setCommentOpen(this.commentOpen);
  }
  log(){
    this.commentOpen = false
    this.toggleComment()
  }
}
