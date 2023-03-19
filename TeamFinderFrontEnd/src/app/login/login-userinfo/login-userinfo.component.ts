import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService } from '../user.service';
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
  	
  selected1?: string;
  selected2?: string;
  @Input() openModalFromParent?: Subject<boolean>;
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
  constructor(private modalService: BsModalService , private  _elementRef : ElementRef, private userService : UserService) {
    // this.card =this._elementRef.nativeElement.querySelector('#card')
  }
  ngOnInit() {
    this.openModalFromParent?.subscribe(v=>{
      console.log("child mar ja madarchod")
    })
  }
  ngAfterViewInit(){
    this.openModal(this.templateref)
  }
  openModal(template: TemplateRef<any>) {
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
    this.modalService.hide()
  }
}
