import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsServiceService {
  modalObjSource = new BehaviorSubject<any>({});
  modalObj = this.modalObjSource.asObservable();


constructor() { }

}
