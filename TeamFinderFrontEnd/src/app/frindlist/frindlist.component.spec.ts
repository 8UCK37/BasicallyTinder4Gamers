import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrindlistComponent } from './frindlist.component';

describe('FrindlistComponent', () => {
  let component: FrindlistComponent;
  let fixture: ComponentFixture<FrindlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrindlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrindlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
