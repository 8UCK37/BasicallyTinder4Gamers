import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatServicesService } from './chat-services.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  values: string = '';
  id : any ='';
  to : any ;

  constructor(private socketService : ChatServicesService , private route: ActivatedRoute) { }


  ngOnInit() {
    this.socketService.setupSocketConnection();

    this.route.queryParams.subscribe(paramsIds => {
      this.id = paramsIds['id'];
      // this.to = paramsIds['to'];

      this.socketService.setSocketId(this.id);
      console.log("socket id="+this.id);
  });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
  sendMessage(){
    let data = {receiver: this.to , msg : this.values}
    this.socketService.send(data);
  }
  onKey(value: string) {
      this.values = value;
  }
  onKeyTo(value: string) {
    this.to = value;
}

}
