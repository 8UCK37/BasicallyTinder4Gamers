import { AfterViewInit, Component, OnInit,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServicesService } from './chat-services.service';
import { ConnectableObservable, Subscription } from 'rxjs';
import axios from 'axios';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../login/user.service';
import { prominent } from 'color.js'
import { average } from 'color.js'
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  @ViewChild('messageContainer', {static: false}) messageContainer!: ElementRef;
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  @ViewChild('image') input!:ElementRef;
  @ViewChild('imagePreview', { static: false }) imagePreview!: ElementRef<HTMLImageElement>;
  name = 'Angular';
  message = '';
  showEmojiPicker = false;
  set1:String= 'google' ;
  values: string = '';
  id : any ='';
  to : any ='';
  incomingmsg: string='';
  allMsgs:any []=[];
  public usr:any;
  public userparsed:any;
  private incomingDataSubscription: Subscription | undefined;
  private incomingNotiSubscription: Subscription | undefined;
  public friendList: any[]=[];
  public activeState:boolean=true;
  public selectedFrnd:any=null;
  public selectedFrndId:any=null;
  public status=new Map();
  public notification=new Map();
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public now = new Date();
  public utcDateTime:any;
  public timeNow:any;
  public timeArr:any;
  public userInfo:any;
  public activeConvList:any[]=[];
  public static incSenderIds:any[]=[];
  public recData:any;
  public chatBackGroundUrl:any;
  public averageHue:any;

  public showLoading:boolean=false;
  public fileSelected:boolean=false;
  public formData:any;
  public sentImages:any;
  constructor(public userService:UserService,private socketService : ChatServicesService , private route: ActivatedRoute,private auth: AngularFireAuth , private renderer: Renderer2,private router: Router) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      // console.log(this.toggleButton.nativeElement , this.menu.nativeElement)
    if(this.toggleButton?.nativeElement!=null && this.menu?.nativeElement!=null){

        if(e.target !== this.toggleButton.nativeElement && e.target!==this.menu.nativeElement){
          console.log("mussssssssssss")
          this.showEmojiPicker = false
        }
      }
    })
  }
  ngOnInit() {
    this.incMsg();
    this.userService.userCast.subscribe(usr=>{
      //console.log("user data" , usr)
      this.userparsed = usr;
      this.userInfo = usr;
      //console.log(this.userparsed.id)
      this.chatBackGroundUrl=`https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatBackground%2F${this.userparsed?.id}.jpg?alt=media&token=8f8ec438-1ee6-4511-8478-04f3c418431e`
      this.getActiveChoice();
      this.getfriendlist();
      this.getActiveConvo();
      average(this.chatBackGroundUrl,{format:'hex'}).then(color=>{
        //console.log(color)
        this.averageHue=color
      }).catch(err=>console.log(err))

    setTimeout(() => {
      this.onclick(this.activeConvList[0])
      this.friendList.forEach(frnd => {
        ChatPageComponent.incSenderIds.forEach(sender => {
          if(frnd.data.id==sender){
            this.notification.set(frnd.data.id,true)
          }
        });
      });
    }, 500);
    })
    this.incNotification();
  }

  ngOnDestroy() {
    //this.socketService.disconnect();
  }

  sendMessage(){
    this.formData = new FormData();

    if((this.values == "" || this.values.length == 0) && !this.fileSelected) return;
    let data = {receiver: this.to , msg : this.values , sender : this.userparsed.id,photo:this.fileSelected}
    console.log(data);

    this.socketService.send(data);
    if(this.input.nativeElement.files[0]!=null){
      console.log("not null")
      let type = this.input.nativeElement.files[0].type
      if(type != "image/jpeg" && type != "image/jpg"){
        alert("wrong image type please upload jpg or Jpeg")
        return
      }
      this.formData.append("chatimages", this.input.nativeElement.files[0]);

      this.allMsgs.push({sender:this.to,rec:false,msg:this.values,photoUrl:this.sentImages,time:this.getLocalTime(),stl:"anim"})
    }else{
      this.allMsgs.push({sender:this.to,rec:false,msg:this.values,time:this.getLocalTime(),stl:"anim"})
    }

      this.formData.append("data" , JSON.stringify({data : data}))
      axios.post('chat/Images',this.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res=>{
          this.input.nativeElement.value=null;
          this.imagePreview.nativeElement.src=''
          this.fileSelected=false
        }).catch(err =>console.log(err))
    this.scrollToBottom();

    // this.messageContainer.nativeElement.
    this.values= ''

    setTimeout(() => {
      this.getActiveConvo();
    }, 300);

  }

  getfriendlist(){
    this.friendList=[];
    axios.get('friendData').then(res=>{
      res.data.forEach((data: any) => {
        this.friendList.push({data})
        //this.status.set(data.id,false);
        this.notification.set(data.id,false);
        this.status.set(data.id,data.activeChoice&&data.isConnected)
      });
    }).catch(err=>console.log(err))
    //console.log(this.friendList)
  }
  fetchChatData(friendId:any){
    // let senderId = this.route.snapshot.queryParamMap.get('senderId');
    this.to = friendId
    axios.get('/chatData',{params:{friendId: friendId}}).then(res=>{
      this.allMsgs = []
      res.data.forEach((ele:any) => {
        this.timeArr=this.utcToLocal(ele.createdAt).split(" ")[1].split(":")
        let left = (ele.sender== this.userparsed?.id) ? false : true
        this.allMsgs.push({sender:friendId,rec: left , msg: ele.msg,time:this.timeArr[0]+":"+this.timeArr[1],photoUrl:ele.photoUrl})
        })
        //console.log(this.allMsgs)
      }).catch(err=>console.log(err));
      this.scrollToBottom();
    }

    getActiveChoice(){
      axios.get('activeState').then(res=>{
        this.activeState=res.data[0].activeChoice
        //console.log("state:"+this.activeState)
      }).catch(err=>console.log(err))
    }

    setActiveChoice(state:boolean){
      axios.post('activeStateChange',{state}).then(res=>{
        console.log("sent req" ,res)
      }).catch(err =>console.log(err))
    }

    toggleState(){
      //console.log("state:"+this.activeState)
      this.activeState=!this.activeState;
      //console.log("state:"+this.activeState)
      this.setActiveChoice(this.activeState);
    }

    onclick(frnd:any){
      //console.log(frnd.id)
      this.values='';
      this.fetchChatData(frnd?.id);
      this.selectedFrndId=frnd?.id;
      this.selectedFrnd=frnd;
      this.notification.set(frnd?.id,false);
      this.scrollToBottom();
    }

    utcToLocal(utcTime:any){
        this.utcDateTime = new Date(utcTime);
        return this.utcDateTime.toLocaleString('en-US', { timeZone:this.timeZone });
    }

    getLocalTime(){
      this.timeNow=this.now.toLocaleString('en-US', { hour12: true })
      this.timeArr=this.timeNow.split(" ")[1].split(":");
      return (this.timeArr[0]+":"+this.timeArr[1])
    }

    scrollToBottom() {
      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement?.scrollHeight;
      }, 200);
    }

    incMsg(){
      this.incomingDataSubscription = this.socketService.getIncomingMsg().subscribe((data) => {
        const recData = typeof data === 'string' ? JSON.parse(data) : data;
        console.log(recData);
        if(recData.photo){
          console.log(recData.sender)
          this.showLoading=true
          setTimeout(() => {
          this.showLoading=false
          }, 2000);
          setTimeout(() => {
            this.fetchChatData(recData.sender)
          }, 2000);
        }
        this.allMsgs.push({sender:recData.sender,rec:true,msg:recData.msg,time:this.getLocalTime(),photo:recData.photo});
        if(recData.sender==this.selectedFrndId){
        this.scrollToBottom();
        //this.getActiveConvo();
        }else{
          this.notification.set(recData.sender,true);
          //this.getActiveConvo();
          this.getActiveConvo()
        }
      });
    }

    incNotification(){
      this.incomingNotiSubscription = this.socketService.getIncomingNoti().subscribe((data) => {
        this.recData = typeof data === 'string' ? JSON.parse(data) : data;
        //console.log(this.recData);
        if(this.recData.notification=='disc'){
          axios.post('getUserInfo',{id:this.recData.sender}).then(res=>{
           //console.log(res.data);
           this.status.set(this.recData.sender,res.data.activeChoice&&false)
            }).catch(err=>console.log(err));
        }else if(this.recData.notification=='online'){
          axios.post('getUserInfo',{id:this.recData.sender}).then(res=>{
            //console.log(res.data)
            this.status.set(this.recData.sender,res.data.activeChoice&&true)
            }).catch(err=>console.log(err));
        }
      });
    };

    getActiveConvo(){
      const uniqueConvId:any=[];
      const uniqueConv:any=[];
      axios.get('getChats').then(res=>{
        //console.log(res.data)
        res.data.forEach((data: any)=> {
         if(data.chat_type=='received'){
          if(!uniqueConvId.includes(data.sender)){
            uniqueConvId.push(data.sender)
            uniqueConv.push(data)
          }
         }
         if(data.chat_type=='sent'){
          //console.log(data.receiver)
          if(!uniqueConvId.includes(data.receiver)){
            uniqueConvId.push(data.receiver)
            uniqueConv.push(data)
          }
         }
         });
         this.activeConvList = uniqueConv
        });
        //console.log(uniqueConvId)
        //console.log(uniqueConv)
    }



    toggleEmojiPicker() {
      console.log(this.showEmojiPicker);
        this.showEmojiPicker = !this.showEmojiPicker;
    }

    addEmoji(event:any) {
      console.log(this.message)
      const { message } = this;
      console.log(message);
      console.log(`${event.emoji.native}`)
      const text = `${message}${event.emoji.native}`;

      this.values += text;
      // this.showEmojiPicker = false;
    }

    sendnoti(frndid:any){
      // console.log("test clicked : "+frndid)
      // this.socketService.sendNoti({sender:this.userparsed.uid,receiver:frndid,noti:"test notification"})
      axios.post('sendNoti',{receiver_id:frndid}).then(res=>{
        console.log(res.data);
     }).catch(err=>console.log(err))
    }
    goToChatSettings(){
      this.router.navigate(['/settings'], { queryParams: { tab:"chat-settings" } });
    }
    deleteSelected(){
      this.fileSelected=false;
      this.input.nativeElement.value=null;
    }
    previewImage() {
      this.fileSelected = true;
      const file = this.input.nativeElement.files[0];
      const reader = new FileReader();
      if(this.input.nativeElement.files[0]!=null){
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          this.imagePreview.nativeElement.src=img.src
          this.sentImages=img.src
        }
        reader.readAsDataURL(file);
      }
    }
}

