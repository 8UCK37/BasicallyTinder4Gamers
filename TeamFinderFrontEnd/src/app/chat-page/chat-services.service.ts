import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatServicesService {
  socket : any;
  private incomingMsgSubject = new Subject<string>();
  private incomingNotiSubject = new Subject<string>();
  constructor() {}
  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    ;
    this.socket.on('my broadcast', (data: string) => {
      //incoming msg
      //console.log("inc msg from services:"+data);
      this.incomingMsgSubject.next(data);
    });
    this.socket.on('notification', (data: string) => {
      //incoming notification
      //console.log("inc notification:");
      this.incomingNotiSubject.next(data);
      //console.log(data)
    });
  }
  setSocketId(id : any){
    let data = {name: id};
    this.socket.emit('setSocketId', data)
  }
  disconnect() {
      if (this.socket) {
          this.socket.disconnect();
      }
  }
  send(msg: object){
    console.log("sending this msg : " + msg);
    this.socket.emit('my message', msg);
  }
  sendNoti(noti:object){
    console.log("sending this noti : " + noti);
    this.socket.emit('notification', noti);
  }
  getIncomingMsg() {
    return this.incomingMsgSubject.asObservable();
  }
  getIncomingNoti() {
    return this.incomingNotiSubject.asObservable();
  }
}

