import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowfriendpostsComponent } from './showfriendposts.component';

describe('ShowfriendpostsComponent', () => {
  let component: ShowfriendpostsComponent;
  let fixture: ComponentFixture<ShowfriendpostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowfriendpostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowfriendpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
