import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService } from '../../login/user.service';
import axios from 'axios';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TitleStrategy } from '@angular/router';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';

interface Sexy {
  name: string;
  code: string;
}
@Component({
  selector: 'app-login-userinfo',
  templateUrl: './login-userinfo.component.html',
  styleUrls: ['./login-userinfo.component.css']
})
export class LoginUserinfoComponent implements OnInit {
  modalRef: BsModalRef<unknown> | undefined;
  @Output() childEvent = new EventEmitter();

  @ViewChild("template")
  templateref?: any

  public cardStyle?: any;

  public cardStyle2?: any;
  public modalState?: boolean
  country?: string;
  language?: string;
  genderSelect?: string;
  inpmodel: any;
  public Countries: any[]=[]
  public languages: string[] = ["Bengali", "Hindi", "English"]
  constructor(private modalService: BsModalService,public utilsServiceService : UtilsServiceService, private _elementRef: ElementRef, private auth: AngularFireAuth, private userService: UserService) {

  }
  sex: Sexy[]=[];

  selectedSex: Sexy | undefined;

  ngOnInit() {
    this.Countries=this.utilsServiceService.getCountries();
      this.sex = [
          { name: 'Male', code: 'M' },
          { name: 'Female', code: 'F' },
          { name: 'Others', code: 'G',}
      ];

    this.userService.userCast.subscribe(usr => {
      //console.log(usr)

      if (usr && usr.userInfoId == null) {
        // this.openModal(this.templateref)
      }
    })

  }
  ngAfterViewInit() {

  }
  openModal(template: TemplateRef<any>) {
    if (this.modalState) return
    // console.log("open")
    this.modalState = true
    this.modalRef = this.modalService.show(template);
  }
  focus(e: any, index: number) {
    console.log(index)
    if (index == 1) {
      this.cardStyle2 = []
      if (e) this.cardStyle = ["inc"]
      // else
    } else {
      this.cardStyle = []
      if (e) this.cardStyle2 = ["inc"]
      // else
    }

  }
  countrySelect(index: number) {
    // console.log(index)
    // console.log(this.states[index])
    this.country = this.Countries[index]
    this.cardStyle2 = []
    this.cardStyle = []
  }
  userLanguageSelect(index: number) {
    this.language = this.languages[index]
    this.cardStyle = []
    this.cardStyle2 = []

  }
  closeAll(e: any) {
    // console.log("all close act" , e)
    this.cardStyle2 = []
    this.cardStyle = []
  }
  submit() {
    this.genderSelect=this.selectedSex?.name;
    console.log("close")
    this.modalState = false
    console.log(this.country, this.language, this.genderSelect)
    if (this.country == undefined || this.language == undefined || this.genderSelect == undefined) return;
    axios.post('/user/welcomepageinfo',{ data:{Gender: this.genderSelect, Country: this.country, Language: this.language}}).then(res=>{
      if(res.status==200)
      {
  this.triggerCustomEvent();
      }
    }).catch(error=> console.log(error))
    this.modalService.hide()
  }

  triggerCustomEvent() {
    console.log("hello darkness my old friend")
    this.childEvent.emit();
  }
}


