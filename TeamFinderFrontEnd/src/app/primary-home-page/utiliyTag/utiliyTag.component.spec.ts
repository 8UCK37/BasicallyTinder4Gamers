/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UtiliyTagComponent } from './utiliyTag.component';

describe('UtiliyTagComponent', () => {
  let component: UtiliyTagComponent;
  let fixture: ComponentFixture<UtiliyTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtiliyTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtiliyTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
