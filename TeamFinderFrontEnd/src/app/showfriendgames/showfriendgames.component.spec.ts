import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowfriendgamesComponent } from './showfriendgames.component';

describe('ShowfriendgamesComponent', () => {
  let component: ShowfriendgamesComponent;
  let fixture: ComponentFixture<ShowfriendgamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowfriendgamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowfriendgamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
