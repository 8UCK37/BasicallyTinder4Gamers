import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServicesService } from './chat-services.service';

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


  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.usr = localStorage.getItem('user');
    this.userparsed=JSON.parse(this.usr);
    // this.route.queryParams.subscribe(paramsIds => {
    //   this.id = paramsIds['id'];
    //   // this.to = paramsIds['to'];
    //   if(this.id==this.userparsed.uid){
    //   this.socketService.setSocketId(this.id);
    //   console.log("socket id="+this.id);
    // }else{
    //   //this.router.navigate(['/']);
    // }

  //});         BUCKET er code
  if (this.userparsed.uid)
  this.socketService.setSocketId(this.userparsed.uid)
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
  sendMessage(){
    let data = {receiver: this.to , msg : this.values}
    console.log("sending to:"+this.to);
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
