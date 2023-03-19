/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoginUserinfoComponent } from './login-userinfo.component';

describe('LoginUserinfoComponent', () => {
  let component: LoginUserinfoComponent;
  let fixture: ComponentFixture<LoginUserinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginUserinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginUserinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
