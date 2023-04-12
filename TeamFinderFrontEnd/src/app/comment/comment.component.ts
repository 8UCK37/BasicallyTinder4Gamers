import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import axios from 'axios';
import { CommentService } from '../post/comment.service';
import { UserService } from '../login/user.service';
import { forEach } from '@angular-devkit/schematics';
interface User { id: string; email: string; displayName: string; photoURL: string; emailVerified: boolean; }

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent implements OnInit {

  @Input() toggle!: boolean;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('commentbox')
  commentbox!: ElementRef;
  parentComment: any;
  commentOpen!: boolean;
  public commentObj: any;
  public treeObj: any = {};
  public commentTree:any[]=[]
  sections = [];
  showSection: boolean[] = [];
  showEditSection: boolean[] = [];
  showReplySection: boolean[] = [];
  showReplySectionChild: boolean[] = [];
  utcDateTime: any;
  LoggedInUserID: any;
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  constructor(private commentService: CommentService, private userService: UserService) {
    this.showSection = this.sections.map(() => false);
  }

  ngOnInit(): void {
    this.userService.userCast.subscribe((usr: User) => {
      this.LoggedInUserID = usr.id;
      console.log("this user", usr.id)
    });
    this.commentService.commentObj$.subscribe(commentObj => {
      this.commentObj = commentObj;
      this.commentOpen = commentObj.open;
      //console.log(this.commentObj.id)
      //console.log(this.commentOpen)
      if (this.commentObj.open) this.fetchComment()
    });

  }
  submit(data: any, id: any) {
    console.log(data, id)
        axios.post('/comment/add', {
          "postId": this.commentObj.id,
          "commentOf": id,
          "msg": data
        }).then(res => {
          console.log(res)
        })
      }

  submitEdit(data: any, id: any) {
    console.log(data, id)
        axios.post('comment/commentEdit', {
          "id": id,
          "new_comment": data
        }).then(res => {
            console.log(res);
        })
      }

  parentCommentSave() {
    console.log(this.parentComment)
    axios.post('/comment/add', {
      "postId": this.commentObj.id,
      "msg": this.parentComment
    }).then(res => {
      console.log(res)
    })
    this.parentComment="";
  }
  hideComment() {
    this.commentOpen = false
    this.commentService.setCommentObj({ open: this.commentOpen, id: null });
    this.treeObj = {}
    this.commentTree=[]
  }

  onToggleChange(newValue: boolean) {
    this.toggle = newValue;
    this.toggleChange.emit(newValue);
  }
  AlfF4Comment(id:any){
    axios.post('comment/commentDelete', {
      "id": id,
    }).then(res => {
        console.log(res);
    })
  }
  fetchComment() {
    axios.get(`/comment?id=${this.commentObj.id}`).then(res => {
      //this.filtercomment(res.data[0].comments)
      this.parseComments(res.data[0].comments)
      console.log(res.data);
    })
  }
  //beofore u ask something akash i'musing the commentTree thing to populate comments and every comment has it's own child if its present
  parseComments(commentData: any){
    console.log(commentData)
    let commentmap=new Map()
    commentData.forEach((comment:any) => {
      comment.childs=[]
      commentmap.set(comment.id,comment)
      if(comment.commentOf!=null){
        //console.log(comment.commentOf)
        //console.log(commentmap.get(comment.commentOf))

        if(commentmap.get(comment.commentOf)==null || commentmap.get(comment.commentOf)==undefined)
        {
          debugger
        }
        commentmap.get(comment.commentOf).childs.push(comment)
      }
    });
    //console.log(commentmap)
    commentmap.forEach(comment => {
      if(comment.commentOf==null){
        //console.log(comment)
        this.commentTree.push(comment)
      }
    });
    //console.log(this.commentTree)
  }

  toggleSection(index: number) {
    this.showSection[index] = !this.showSection[index];
  }
  toggleSectionEdit(index: number) {
    this.showEditSection[index] = !this.showEditSection[index];
  }
  toggleSectionAllReply(index: number) {
    this.showReplySection[index] = !this.showReplySection[index];
  }
  toggleSectionAllReplyChild(index: number) {
    this.showReplySectionChild[index] = !this.showReplySectionChild[index];
  }
  utcToLocal(utcTime: any) {
    this.utcDateTime = new Date(utcTime);
    return this.utcDateTime.toLocaleString('en-US', { timeZone: this.timeZone });
  }
  UserVerify(id: any) {
   return (this.LoggedInUserID == id);
  }
}
