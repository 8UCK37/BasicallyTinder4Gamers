import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import axios from 'axios';
import { CommentService } from '../post/comment.service';

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
  public commentObj:any;
  public treeObj: any = {}
  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.commentService.commentObj$.subscribe(commentObj => {
      this.commentObj = commentObj;
      this.commentOpen = commentObj.open;
      console.log(this.commentObj.id)
      //console.log(this.commentOpen)
      this.fetchComment()
    });
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
  hideComment(){
    this.commentOpen = false
    this.commentService.setCommentObj({open:this.commentOpen,id:null});
  }

  onToggleChange(newValue: boolean) {
    this.toggle = newValue;
    this.toggleChange.emit(newValue);
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
    //console.log(this.treeObj)
    //console.log(this.commentbox)
  }
}
