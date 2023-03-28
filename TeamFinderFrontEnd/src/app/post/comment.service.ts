import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentOpenSource = new BehaviorSubject<boolean>(false);
  commentOpen$ = this.commentOpenSource.asObservable();
  private treeObjSource = new BehaviorSubject<any>({});
  treeObj$ = this.treeObjSource.asObservable();
  constructor() { }
  setCommentOpen(value: boolean) {
    this.commentOpenSource.next(value);
  }
  setTreeObj(obj: any) {
    this.treeObjSource.next(obj);
  }
}
