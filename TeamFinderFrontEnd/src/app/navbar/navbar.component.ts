import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { UserService } from '../login/user.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ChatServicesService } from '../chat-page/chat-services.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChatPageComponent } from '../chat-page/chat-page.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  public show:boolean=false;
  private incomingDataSubscription: Subscription | undefined;


  constructor(public user: UserService ,private renderer: Renderer2 ,private auth: AngularFireAuth,private socketService : ChatServicesService,private router: Router) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
    if(this.toggleButton.nativeElement!=null && this.menu.nativeElement!=null){
     if(e.target !== this.toggleButton.nativeElement && e.target!==this.menu.nativeElement){
         this.show=false;
      }
    }
    });
  }

  public usr:any;
  public userparsed:any;
  public profileurl:any;
  public noti:boolean=false;
  public recData:any;
  ngOnInit(): void {
    // this.show=false;
    // this.usr = localStorage.getItem('user');
    // this.userparsed=JSON.parse(this.usr);
    // console.log("logged in :" ,  this.user.isLoggedIn)
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        //console.log(this.userparsed.uid)
        this.socketService.setupSocketConnection();
        this.socketService.setSocketId(this.userparsed.uid);
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          this.profileurl = `http://localhost:3000/static/profilePicture/${user.uid}.jpg`
        }).catch(err =>console.log(err))
      }
    })
    this.incMsg();
  }

  toggleMenu() {
    this.show=!this.show;
  }
  incMsg(){
    this.incomingDataSubscription = this.socketService.getIncomingData().subscribe((data) => {
      this.recData = typeof data === 'string' ? JSON.parse(data) : data;
      //console.log(recData.sender);
      ChatPageComponent.incSenderIds.push(this.recData.sender)
      this.noti=true;
    });
  }
  onchatClicked(){
    this.noti=false;
    this.router.navigate(['chat']);
  }
}
