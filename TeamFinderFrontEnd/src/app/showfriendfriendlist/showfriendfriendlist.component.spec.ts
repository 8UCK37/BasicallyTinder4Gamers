import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowfriendfriendlistComponent } from './showfriendfriendlist.component';

describe('ShowfriendfriendlistComponent', () => {
  let component: ShowfriendfriendlistComponent;
  let fixture: ComponentFixture<ShowfriendfriendlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowfriendfriendlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowfriendfriendlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
