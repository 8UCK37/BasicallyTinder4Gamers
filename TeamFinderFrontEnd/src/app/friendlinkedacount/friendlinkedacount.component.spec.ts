import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendlinkedacountComponent } from './friendlinkedacount.component';

describe('FriendlinkedacountComponent', () => {
  let component: FriendlinkedacountComponent;
  let fixture: ComponentFixture<FriendlinkedacountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendlinkedacountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendlinkedacountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
