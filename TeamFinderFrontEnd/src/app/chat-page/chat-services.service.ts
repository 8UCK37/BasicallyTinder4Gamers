import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatServicesService {
  socket : any;
  private incomingDataSubject = new Subject<string>();
  constructor() {}
  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    ;
    this.socket.on('my broadcast', (data: string) => {
      //incoming msg
      //console.log("inc msg from services:"+data);
      this.incomingDataSubject.next(data);
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
  getIncomingData() {
    return this.incomingDataSubject.asObservable();
  }

}

