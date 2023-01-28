import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryHomePageComponent } from './primary-home-page.component';

describe('PrimaryHomePageComponent', () => {
  let component: PrimaryHomePageComponent;
  let fixture: ComponentFixture<PrimaryHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryHomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
