/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FriendSuggestionBoxComponent } from './friend-suggestion-box.component';

describe('FriendSuggestionBoxComponent', () => {
  let component: FriendSuggestionBoxComponent;
  let fixture: ComponentFixture<FriendSuggestionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendSuggestionBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendSuggestionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
