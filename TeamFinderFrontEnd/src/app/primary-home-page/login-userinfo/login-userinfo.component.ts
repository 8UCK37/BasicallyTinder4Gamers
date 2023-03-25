import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService } from '../../login/user.service';
import axios from 'axios';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login-userinfo',
  templateUrl: './login-userinfo.component.html',
  styleUrls: ['./login-userinfo.component.css']
})
export class LoginUserinfoComponent implements OnInit {
  modalRef: BsModalRef<unknown> | undefined;

  @ViewChild("template")
  templateref ?: any

  public cardStyle?: any;

  public cardStyle2?: any;
  public modalState?: boolean
  selected1?: string;
  selected2?: string;
  genderSelect?: string;
  inpmodel:any;
  states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',

  ];
  constructor(private modalService: BsModalService , private  _elementRef : ElementRef,private auth: AngularFireAuth , private userService: UserService ) {

  }
  ngOnInit() {
  }
  ngAfterViewInit(){
    this.userService.userCast.subscribe(usr =>{
      //console.log(usr)
      if(usr.userInfoId == null){
        this.openModal(this.templateref)
      }
    })

  }
  openModal(template: TemplateRef<any>) {
    if(this.modalState) return
    // console.log("open")
    this.modalState = true
    this.modalRef = this.modalService.show(template);
  }
  focus(e:any , index:number){
    console.log(index)
    if(index == 1){
      this.cardStyle2 = []
      if(e) this.cardStyle = ["inc"]
      // else
    }else{
      this.cardStyle = []
      if(e) this.cardStyle2 = ["inc"]
      // else
    }

  }
  countrySelect(index:number){
    // console.log(index)
    // console.log(this.states[index])
    this.selected1 = this.states[index]
    this.cardStyle2 = []
    this.cardStyle = []
  }
  userLanguageSelect(index : number){
    this.selected2 = this.states[index]
    this.cardStyle = []
    this.cardStyle2 = []

  }
  closeAll(e :any ){
    // console.log("all close act" , e)
    this.cardStyle2 = []
    this.cardStyle = []
  }
  submit(){
    console.log("close")
    this.modalState = false
    console.log(this.selected1 , this.selected2 , this.genderSelect)
    if(this.selected1 == undefined || this.selected2 == undefined || this.genderSelect == undefined ) return ;
    axios.post('/saveUserInfo', {Gender : this.genderSelect , Country : this.selected1 , Language : this.selected2})
    this.modalService.hide()
  }
}
