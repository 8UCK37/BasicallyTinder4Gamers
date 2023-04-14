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
      console.log(res.data[0].comments)
      this.commentTree = this.buildCommentTree(res.data[0].comments);
      console.log(this.commentTree);
    })
  }

  buildCommentTree(comments: any[], parentCommentId = null) {
    const childComments:any = comments
      .filter(comment => comment.commentOf === parentCommentId)
      .map(comment => ({
        ...comment,
        childs: this.buildCommentTree(comments, comment.id)
      }));
    return childComments.length > 0 ? childComments : null;
  }

  //beofore u ask something akash i'musing the commentTree thing to populate comments and every comment has it's own child if its present
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
   return this.LoggedInUserID == id;
  }

  likeButtonClick(comment: any, type: String) {
    console.log(type," clicked on= ",comment)
    console.log(comment.CommentReaction[0].type)
    if(comment.CommentReaction[0].type==type){
      console.log('dislike called')
      axios.post('comment/commentReactionDisLike', {id: comment.id,type:type}).then(res =>{
      comment.CommentReaction[0].type='dislike'
      console.log(res);
      })

    }else{
      console.log('reaction called',type)
      axios.post('comment/commentReactionLike', {id: comment.id,type:type}).then(res =>{
        comment.CommentReaction[0].type=type
        console.log(res);
    })
    }
    console.log(this.commentTree);
  }

}

