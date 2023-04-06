import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import axios from 'axios';
import { CommentService } from './comment.service';
import { MenuItem, MessageService,ConfirmationService, ConfirmEventType } from 'primeng/api';


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
  styleUrls: ['./post.component.css'],
  providers: [MessageService]

})


export class PostComponent implements OnInit {

  @Input() childPost: any;
  @ViewChild('comment') comment!: ElementRef;
  @ViewChild('closeComments') closeComments!: ElementRef;
  @ViewChild('commentbtn') commentbtn!: ElementRef;

  parentComment: any;
  @Input() public commentOpen: boolean = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  myInterval = 0;
  public postsByTag=[];
  activeSlideIndex = 0;
  public utcDateTime: any;
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // commentData: Comment[] = [];
  public treeObj: any = {}
  images: any[] =[];
  galeriaPosition: string = 'bottom';
  responsiveOptions: any[] = [];
  items:any[]=[];
  delay:number=90;
  radi:number=100;
  confirmPosition:string ="top";
  visible: boolean=false;

  constructor(private messageService: MessageService,private commentService: CommentService,private renderer: Renderer2, @Inject(DOCUMENT) document: Document) {
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

    this.childPost.photoUrlArr.forEach((url: any) => {
      if(url!=''){
      this.images.push({imageSrcUrl:url})
    }
    });
    this.commentService.postsObj$.subscribe(posts => {
      this.postsByTag= posts;
    });

    this. responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];
  this.items = [
    {
      tooltipOptions: {
        tooltipLabel: 'Edit'
      },
        icon: 'pi pi-pencil',
        command: () => {
          console.log('pencil clicked')

        }
    },

    {
      tooltipOptions: {
        tooltipLabel: 'Delete'
      },
        icon: 'pi pi-trash',
        command: () => {
          console.log('delete clicked')
          this.visible = !this.visible;
        }
    },

    {
      tooltipOptions: {
        tooltipLabel: 'Placeholder'
      },
        icon: 'pi pi-external-link',
        command: () => {
          console.log('placeholder clicked')
        }
    }
];

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
    this.commentOpen = true
    this.commentService.setCommentObj({open:this.commentOpen,id:post.id});

  }
  deletePost(){
    //console.log(this.childPost.id)
    axios.post('/deletePost', { id: this.childPost.id}).then(res => {
      console.log(res)
    });
  }
  confirmDelete(){
    //console.log('confirm clicked with post id',this.childPost.id)
    this.messageService.add({key:this.childPost.id.toString(), severity: 'info', summary: 'Confirmed', detail: 'Post deleted' });
    this.deletePost()
  }
  cancelDelete(){
    //console.log('cancel clicked with post id',this.childPost.id)
    this.visible = !this.visible;
    this.messageService.add({key:this.childPost.id.toString(),severity: 'error', summary: 'Cancelled', detail: 'The post was not deleted' });
  }
  closeDelete(){
    //console.log('close clicked with post id',this.childPost.id)
    this.visible = !this.visible;
    this.messageService.add({key:this.childPost.id.toString(),severity: 'warn', summary: 'Cancelled', detail: 'You have closed the delete dialog' });
  }
}
