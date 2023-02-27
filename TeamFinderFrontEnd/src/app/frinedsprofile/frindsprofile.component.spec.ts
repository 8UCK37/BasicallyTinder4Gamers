import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrindsprofileComponent } from './frindsprofile.component';

describe('FrindsprofileComponent', () => {
  let component: FrindsprofileComponent;
  let fixture: ComponentFixture<FrindsprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrindsprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrindsprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
