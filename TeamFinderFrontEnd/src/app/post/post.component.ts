import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import axios from 'axios';
import { CommentService } from './comment.service';
import { MenuItem, MessageService,ConfirmationService, ConfirmEventType } from 'primeng/api';
import { UserService } from '../login/user.service';
import { UtilsServiceService } from '../utils/utils-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
  public ownPosts:any=[];
  delay:number=90;
  radi:number=100;
  confirmPosition:string ="top";
  visible: boolean=false;
  showSpinner:boolean=false;
  public userparsed:any;
  deleteHeader:string="Delete Post"
  deleteBody:string="Are you sure you want to delete this post?"
  deleteSuccess:boolean=false;
  constructor(public utilsServiceService : UtilsServiceService, public userService:UserService,private commentService: CommentService,private renderer: Renderer2, @Inject(DOCUMENT) document: Document,private router: Router) {
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
    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed = usr;
      this.commentService.ownPostsObj$.subscribe(posts => {
        this.ownPosts= posts;
      });
    })
    this.childPost.photoUrlArr?.forEach((url: any) => {
      if(url!=''){
      this.images.push({imageSrcUrl:url})
    }
    });
    this.commentService.postsObj$.subscribe(posts => {
      this.postsByTag= posts;
    });

      this.childPost.refinedText= this.childPost.description
      if(this.childPost.mention != null &&  this.childPost.mention.list != undefined )
      {
        // debugger
        this.childPost.mention.list.forEach((mention:any) => {
          if(mention.id==this.userparsed?.id){
            this.childPost.refinedText  = this.childPost.refinedText.replace(mention.id ,
              `<a href="${environment.baseUrl}/profile-page/post">
                <u class="mention-highlight">${mention.name}</u>
              </a>`)
          }else{
          this.childPost.refinedText  = this.childPost.refinedText.replace(mention.id ,
          `<a href="${environment.baseUrl}/user/post?id=${mention.id}">
            <u class="mention-highlight">${mention.name}</u>
          </a>`)
        }
        });
      }

      if(this.childPost.shared && this.childPost.parentpost?.mention != null &&  this.childPost.parentpost?.mention.list != undefined )
      {
        this.childPost.parentpost.refinedText= this.childPost.parentpost?.description
        this.childPost.parentpost.mention.list.forEach((mention:any) => {

          if(mention.id==this.userparsed?.id){
            this.childPost.parentpost.refinedText  = this.childPost.parentpost.refinedText.replace(mention.id ,
              `<a href="${environment.baseUrl}/profile-page/post">
                <u class="mention-highlight">${mention.name}</u>
              </a>`)
          }else{
          this.childPost.parentpost.refinedText  = this.childPost.parentpost.refinedText.replace(mention.id ,
          `<a href="${environment.baseUrl}/user/post?id=${mention.id}">
            <u class="mention-highlight">${mention.name}</u>
          </a>`)
        }
        });
      }

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
          console.log('pencil clicked', this.childPost)
          this.utilsServiceService.postModalObjSource.next({open:true,  data: this.childPost })
        }
    },

    {
      tooltipOptions: {
        tooltipLabel: 'Delete'
      },
        icon: 'pi pi-trash',
        command: () => {
          //console.log('delete clicked')
          this.visible = !this.visible;
        }
    },

    {
      tooltipOptions: {
        tooltipLabel: 'Go to this post'
      },
        icon: 'pi pi-external-link',
        command: () => {
          console.log('placeholder clicked')
          this.goToPostPage()
        }
    }
];

  }

  likeButtonClick(post: any, type: String) {
    if (post.reactiontype==type) {
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
    this.deleteHeader="Deleting your post !!!"
    this.showSpinner = !this.showSpinner ;
    this.deletePost()
    //console.log('confirm clicked with post id',this.childPost.id)
    //console.log(this.ownPosts)
    setTimeout(() => {
      this.deleteSuccess=true
      this.deleteHeader="Suceess !!!"
      this.deleteBody="Successfully deleted your post !!!"
      this.showSpinner = !this.showSpinner ;
    }, 2000);
    setTimeout(() => {
      //console.log(this.ownPosts)
      this.removePostById(this.childPost.id)
      //console.log(this.ownPosts)
    }, 4000);
  }
  cancelDelete(){
    //console.log('cancel clicked with post id',this.childPost.id)
    this.visible = !this.visible;

  }
  closeDelete(){
    //console.log('close clicked with post id',this.childPost.id)
    this.visible = !this.visible;

  }
  removePostById(postId: number) {
    const index = this.ownPosts.findIndex((post: { id: number; }) => post.id === postId);
  if (index !== -1) {
    this.ownPosts.splice(index, 1);
  }
  console.log(this.ownPosts)
  }
  goToPostPage(){
    //console.log(this.childPost.id)
    this.router.navigate(['post-page'],{ queryParams: { post_id: this.childPost.id } });
  }
  quickShare(postId:any){
    console.log('qs',postId)
    axios.post('/quickSharePost', { originalPostId: postId }).then(res => {
      console.log(res.data)
    })
  }
  feedShare(postId:any){
    console.log('fs',postId)
    alert('I know you want to add a custom desc when sharing a post\nbut i cant implement that unless the\nedit/create-post modal is finished and looking pretty and working!!\n ar oi kaj ta ami ekebarei korbo na!!!');
  }
}
