import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentObjSource = new BehaviorSubject<any>({});
  commentObj$ = this.commentObjSource.asObservable();

  private postsObjSource = new BehaviorSubject<any>([]);
  postsObj$ = this.postsObjSource.asObservable();
  constructor() { }

  setPostsObj(obj: any) {
    this.postsObjSource.next(obj);
  }
  setCommentObj(obj: any) {
    this.commentObjSource.next(obj);
  }
}
