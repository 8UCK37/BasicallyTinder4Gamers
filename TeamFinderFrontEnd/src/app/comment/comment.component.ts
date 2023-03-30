import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import axios from 'axios';
import { CommentService } from '../post/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

@Input() childTreeObj:any={}
@Input() toggle!: boolean;
@Output() toggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
parentComment: any;
  commentOpen!: boolean;
  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.commentService.commentOpen$.subscribe(commentOpen => {
      this.commentOpen = commentOpen;
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
    this.commentService.setCommentOpen(this.commentOpen);
  }

  onToggleChange(newValue: boolean) {
    this.toggle = newValue;
    this.toggleChange.emit(newValue);
  }
}
