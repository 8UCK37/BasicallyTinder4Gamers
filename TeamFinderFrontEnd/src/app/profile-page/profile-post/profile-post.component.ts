import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/login/user.service';

@Component({
  selector: 'app-profile-post',
  templateUrl: './profile-post.component.html',
  styleUrls: ['./profile-post.component.css']
})
export class ProfilePostComponent implements OnInit {
  @ViewChild('image') input!:ElementRef;
  ownProfile: any;
  public profile_id: any;
  public ownPosts:any=[];
  public usr:any;
  public userparsed:any;
  public userInfo:any;
  public utcDateTime:any;
  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public modalRef?: BsModalRef;
constructor(public userService:UserService,private auth: AngularFireAuth,private route: ActivatedRoute,private modalService: BsModalService) {
  this.ownProfile = this.route.snapshot.data['ownProfile'];
 }

  ngOnInit() {
    //console.log(this.ownProfile)
    if (this.ownProfile) {
      this.userService.userCast.subscribe(usr=>{
        //console.log("user data" , usr)
        this.userparsed = usr;
        this.userInfo = usr;
        this.getPostById(this.userparsed?.id);
      })
    } else {
      this.route.queryParams.subscribe(params => {
        this.profile_id = params['id'];
        this.getPostById(this.profile_id);
      });
    }
  }
  getPostById(id:any){
    axios.post('getPostById',{uid:id}).then(res=>{
      //console.log(res.data)
      res.data.forEach((post: any) => {
        post.tagArr=post.tagnames?.split(',')
        post.photoUrlArr=post.photoUrl?.split(',')
      });
      this.ownPosts=res.data
      console.log(this.ownPosts)
    }).catch(err=>console.log(err))
  }

  utcToLocal(utcTime:any){
    this.utcDateTime = new Date(utcTime);
    return this.utcDateTime.toLocaleString('en-US', { timeZone:this.timeZone });
}
openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template,
    Object.assign({}, { class: 'gray modal-xl' })
    );
}
}
