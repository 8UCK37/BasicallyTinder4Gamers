import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsServiceService {
  postModalObjSource = new BehaviorSubject<any>({});
  postModalObj = this.postModalObjSource.asObservable();

  linkedAccountObjSource = new BehaviorSubject<any>({});
  linkedAccountObj = this.linkedAccountObjSource.asObservable();

constructor() { }
  setlinkedAccountObj(obj: any) {
    this.linkedAccountObjSource.next(obj);
  }
}
