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

  @Input() childPost: any;
  @ViewChild('comment') comment!: ElementRef;
  @ViewChild('closeComments') closeComments!: ElementRef;
  @ViewChild('commentbtn') commentbtn!: ElementRef;
  @ViewChild('commentbox')
  commentbox!: ElementRef;
  parentComment: any;
  @Input() public commentOpen: boolean = false;
  myInterval = 0;
  public postsByTag=[];
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
    //console.log(this.commentbox)
    this.commentService.postsObj$.subscribe(posts => {
      this.postsByTag= posts;
    });

  }

  likeButtonClick(post: any, type: String) {
    if ((post.reactiontype=='like' && type == 'like') || (post.reactiontype=='haha' && type == 'haha') || (post.reactiontype=='love' && type == 'love') || (post.reactiontype=='sad' && type == 'sad') || (post.reactiontype=='poop' && type == 'poop')) {
      //console.log("dislike call")
      console.log(type)
      post.reactiontype='dislike'
      post.noreaction = true
      axios.post('/dislikePost', { id: post.id, type: type }).then(res => {
        console.log(res)
      });
    } else {
      if (type == 'like') {
        console.log("liked")
        post.reactiontype='like'

      } else if (type == 'haha') {
        //console.log("hahaed")
        post.reactiontype='haha'
        post.noreaction = false

      } else if (type == 'love') {
        //console.log("loved")
        post.reactiontype='love'
        post.noreaction = false

      } else if (type == 'sad') {
        //console.log("saded")
        post.reactiontype='sad'
        post.noreaction = false

      } else if (type == 'poop') {
        //console.log("pooped")
        post.reactiontype='poop'
        post.noreaction = false
      }
      axios.post('/likePost', { id: post.id, type: type }).then(res => {
        //console.log(res)
        post.noreaction = false
      });
    }
    console.log(this.childPost)
  }

  fetchByTag(tag: any) {
    this.postsByTag = []
    axios.post('/getpostbytagname', { tags: tag }).then(res => {
      console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr = post.tagnames?.split(',')
        post.photoUrlArr = post.photoUrl?.split(',')
      });
      this.postsByTag = res.data
      this.commentService.setPostsObj(this.postsByTag);
    })
    // console.log(tag)
  }
  utcToLocal(utcTime: any) {
    this.utcDateTime = new Date(utcTime);
    return this.utcDateTime.toLocaleString('en-US', { timeZone: this.timeZone });
  }
  openComment(post: any) {
    console.log(post)
    console.log(post.id)
    this.commentOpen = true
    this.commentService.setCommentOpen(this.commentOpen);
    this.fetchComment()
  }
  fetchComment() {
    axios.get('/comment').then(res => {
      let commentData = res.data[0].comments
      this.filtercomment(commentData)
    })
  }
  filtercomment(commentData: any) {
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
    this.commentService.setTreeObj(this.treeObj);
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

}
