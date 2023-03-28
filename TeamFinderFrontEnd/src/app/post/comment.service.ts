import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentOpenSource = new BehaviorSubject<boolean>(false);
  commentOpen$ = this.commentOpenSource.asObservable();
  constructor() { }
  setCommentOpen(value: boolean) {
    this.commentOpenSource.next(value);
  }
}
