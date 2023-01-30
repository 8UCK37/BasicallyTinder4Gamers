import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChatServicesService {
  socket : any;

  constructor() { }
  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    ;
    this.socket.on('my broadcast', (data: string) => {
      console.log(data);
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
}

