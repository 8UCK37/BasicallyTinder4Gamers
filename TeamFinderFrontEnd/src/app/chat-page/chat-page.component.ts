import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServicesService } from './chat-services.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  values: string = '';
  id : any ='';
  to : any ='';
  usermsg: string='';

  constructor(private socketService : ChatServicesService , private route: ActivatedRoute,private router :Router) { }
  public usr:any;
  public userparsed:any;
  private incomingDataSubscription: Subscription | undefined;

  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    this.socketService.setSocketId(this.userparsed.uid);
    console.log("socket id: "+this.userparsed.uid);


    this.incomingDataSubscription = this.socketService.getIncomingData().subscribe((data) => {
      console.log(data);
      // Do something with the incoming data
      this.getMessage(data)
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
  sendMessage(address:any,txt:any){
    this.to=address;
    this.values=txt;
    let data = {receiver: this.to , msg : this.values}
    console.log("sending to: "+this.to);
    console.log("msg txt: "+this.values);
    this.socketService.send(data);

  }
  onKey(value: string) {
    this.values = value;
  }
  onKeyTo(value: string) {
    this.to = value;
    console.log("onkeyto:"+this.to)
 }
getMessage(message:string){
  this.usermsg=message;
  return this.usermsg;
}

}
