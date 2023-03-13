import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { UserService } from '../login/user.service';
import { ChatServicesService } from '../chat-page/chat-services.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChatPageComponent } from '../chat-page/chat-page.component';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  @ViewChild('togglenoti') togglenoti!: ElementRef;
  @ViewChild('notiMenu') notiMenu!: ElementRef;
  public show: boolean = false;
  public notiShow: boolean = false;
  public notificationArray: any = [];
  private incomingMsgSubscription: Subscription | undefined;
  private incomingNotiSubscription: Subscription | undefined;
  isMenuOpened: boolean = false;
  private toastElement!: HTMLElement;
  public usr: any;
  public userparsed: any;
  public userInfo:any
  public noti: boolean = false;
  public recData: any;
  constructor(public user: UserService, private renderer: Renderer2, private auth: AngularFireAuth, private socketService: ChatServicesService, private router: Router) {
    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (this.toggleButton?.nativeElement != null && this.menu?.nativeElement != null) {
        if (e.target !== this.toggleButton.nativeElement && e.target !== this.menu.nativeElement) {
          this.show = false;
        }
      }
      if (this.togglenoti?.nativeElement != null && this.notiMenu?.nativeElement != null) {
        if (e.target !== this.togglenoti.nativeElement && e.target !== this.notiMenu.nativeElement) {
          this.isMenuOpened = false;
        }
      }
    });
  }


  ngOnInit(): void {

    this.usr = localStorage.getItem('user');
    this.userparsed = JSON.parse(this.usr);

    this.auth.authState.subscribe(user => {
      if (user) {
        this.usr = localStorage.getItem('user');
        this.userparsed = JSON.parse(this.usr);
        //console.log(this.userparsed)
        this.socketService.setupSocketConnection();
        this.socketService.setSocketId(this.userparsed.uid);

        axios.get('saveuser').then(res => {
        }).catch(err => console.log(err))
        
        axios.post('getUserInfo', { frnd_id: this.userparsed.uid }).then(res => {
          if(res.data!=null){
            this.userInfo=res.data
          }else{
            this.userInfo={profilePicture:this.userparsed.photoURL,name:this.userparsed.displayName}
          }
          //console.log(res.data);
        }).catch(err => console.log(err))
        this.incMsg();
        this.incNotification();
        this.getPendingReq();
      }
    })
    setInterval(() => {
      //console.log(this.router.url);
      if (this.router.url == "/chat") {
        this.noti = false;
      }
    }, 5000);
  }

  toggleMenu() {
    this.show = !this.show;
  }
  toggleNotiDropDown() {
    if (this.notificationArray?.length != 0) {
      this.notiShow = !this.notiShow;
    }
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
          axios.post('getUserInfo', { frnd_id: noti.sender }).then(res => {
            noti.profileurl = res.data.profilePicture;
            noti.userName = res.data.name;
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
  togglenav(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }
  onclick(userid: any) {
    console.log(userid)
    this.router.navigate(['/user'], { queryParams: { id: userid } });
  }
  acceptReq(frndid: any) {
    axios.post('acceptFriend', { frnd_id: frndid }).then(res => {
      //console.log("accepted", res)
      this.getPendingReq();
    }).catch(err => console.log(err))
  }
  rejectReq(frndid: any) {
    axios.post('rejectFriend', { frnd_id: frndid }).then(res => {
      //console.log("rejected", res)
      this.getPendingReq();
    }).catch(err => console.log(err))
  }

  toggleTostAccept() {
    //console.log("hello1");
    const toastTrigger = document.getElementById('liveToastBtnAccept')
    const toastLiveExample: any = document.getElementById('liveToastAccept')
    if (toastTrigger) {
      toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
      })
    }
  }
  toggleTostReject() {
    //console.log("hello2");
    const toastTrigger = document.getElementById('liveToastBtnReject')
    const toastLiveExample: any = document.getElementById('liveToastReject')
    if (toastTrigger) {
      toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
      })
    }
  }
}

