import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
@Component({
  selector: 'app-login-userinfo',
  templateUrl: './login-userinfo.component.html',
  styleUrls: ['./login-userinfo.component.css']
})
export class LoginUserinfoComponent implements OnInit {
  modalRef: BsModalRef<unknown> | undefined;

  
  stateCtrl = new UntypedFormControl();
 
  myForm = new UntypedFormGroup({
    state: this.stateCtrl
  });
 
  states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    
  ];
  constructor(private modalService: BsModalService) {}
  ngOnInit() {
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
