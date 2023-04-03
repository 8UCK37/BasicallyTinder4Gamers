import {Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { UserService } from '../login/user.service';
import { ChatServicesService } from '../chat-page/chat-services.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChatPageComponent } from '../chat-page/chat-page.component';
import * as bootstrap from 'bootstrap';
import { animation } from '@angular/animations';
import { CommentService } from '../post/comment.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [MessageService]
})
export class NavbarComponent implements  OnInit {
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  @ViewChild('togglenoti') togglenoti!: ElementRef;
  @ViewChild('notiMenu') notiMenu!: ElementRef;
  public toastTrigger:any;
  public toastLive: any;
  public show: boolean = false;
  public notiShow: boolean = false;
  public notificationArray: any = [];
  private incomingMsgSubscription: Subscription | undefined;
  private incomingNotiSubscription: Subscription | undefined;
  private toastElement!: HTMLElement;
  public usr: any;
  public userparsed: any;
  public userInfo:any
  public noti: boolean = false;
  public recData: any;
  commentOpen: boolean=false;
  constructor(private messageService: MessageService,public user: UserService, private renderer: Renderer2, private auth: AngularFireAuth, private socketService: ChatServicesService, private router: Router , public userService : UserService) {
    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      const clickedElement = e.target as HTMLElement;
      const clickedElementClassList = clickedElement.classList;
      if (this.toggleButton?.nativeElement != null && this.menu?.nativeElement != null) {
        if (e.target !== this.toggleButton.nativeElement && e.target !== this.menu.nativeElement) {
          this.show = false;
        }
      }
      if (this.togglenoti?.nativeElement != null && !this.notiMenu?.nativeElement.contains(e.target as HTMLElement)) {
        if (e.target !== this.togglenoti.nativeElement && e.target !== this.notiMenu?.nativeElement) {
          console.log(clickedElementClassList)
          if(this.notiShow  && clickedElementClassList[0]!='btn-close'){
            console.log('cot')
            this.notiShow = false;
          }


        }
      }
    });
  }


  ngOnInit(): void {

    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed = usr
      this.userInfo = usr
      //console.log(usr)
      if (usr) {
      this.socketService.setupSocketConnection();
      this.socketService.setSocketId(this.userparsed.id);
      this.incMsg();
      this.incNotification();
      this.getPendingReq();
    }
    })
    setInterval(() => {
      if (this.router.url == "/chat") {
        this.noti = false;
      }
    }, 5000);
    console.log(this.notiShow)
  }
//OnInitEnd
  toggleMenu() {
    this.show = !this.show;
  }
  toggleNotiDropDown() {
    if (this.notificationArray?.length != 0) {

    }
    this.notiShow = !this.notiShow;
    console.log(this.notiShow)
  }
  incMsg() {
    this.incomingMsgSubscription = this.socketService.getIncomingMsg().subscribe((data) => {
      this.recData = typeof data === 'string' ? JSON.parse(data) : data;
      //console.log(this.recData);
      ChatPageComponent.incSenderIds.push(this.recData.sender)
      this.noti = true;
    });
  }
  incNotification() {
    this.incomingNotiSubscription = this.socketService.getIncomingNoti().subscribe((data) => {
      this.recData = typeof data === 'string' ? JSON.parse(data) : data;
      //console.log(this.recData);
      if (this.recData.notification != 'disc' && this.recData.notification != 'online') {
        this.notificationArray.push({ sender: this.recData.sender, notiType: this.recData.notification })
        this.notificationArray.forEach((noti: any) => {
          axios.post('getUserInfo', { id: noti.sender }).then(res => {
            noti.profileurl = res.data.profilePicture;
            noti.userName = res.data.name;
            if(noti.notiType =="frndReqAcc"){
              this.messageService.add({ severity: 'success', summary: 'Accepted', detail: noti.userName.toString()+' accepted your friend request' });
            }
            //console.log("res.data");
          }).catch(err => console.log(err))

        });

      }
      //console.log(this.notificationArray)
    });
  }
  onchatClicked() {
    this.noti = false;
    this.router.navigate(['chat']);
  }

  getPendingReq() {
    this.notificationArray=[];
    axios.get('getFriendData').then(res => {
      //console.log(res.data)
      res.data.forEach((user: any) => {
        if(user.status=='incoming'){
          this.notificationArray.push({ sender: user.id, notiType: "frnd req", profileurl: user.profilePicture, userName: user.name })
         }
      });
    }).catch(err => console.log(err))
  }

  onclick(userid: any) {
    console.log(userid)
    this.router.navigate(['/user'], { queryParams: { id: userid } });
  }
  acceptReq(frndid: any) {
    this.messageService.add({ severity: 'success', summary: 'Accepted', detail: 'Friend request Accepted Good Call!!' });
     axios.post('acceptFriend', { frnd_id: frndid }).then(res => {
       //console.log("accepted", res)
       this.getPendingReq();
     }).catch(err => console.log(err))
  }
  rejectReq(frndid: any) {
    this.messageService.add({ severity: 'success', summary: 'Rejected', detail: 'Friend request Rejected Good Call!!' });
     axios.post('rejectFriend', { frnd_id: frndid }).then(res => {
       //console.log("rejected", res)
       this.getPendingReq();
     }).catch(err => console.log(err))
  }

  notiDismiss(index:any){
    console.log(index)
    this.notificationArray.splice(index,1)
    console.log(this.notificationArray)
  }
}

