import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsServiceService {
  postModalObjSource = new BehaviorSubject<any>({});
  postModalObj = this.postModalObjSource.asObservable();


constructor() { }

}
