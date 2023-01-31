import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowgamesComponent } from './showgames.component';

describe('ShowgamesComponent', () => {
  let component: ShowgamesComponent;
  let fixture: ComponentFixture<ShowgamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowgamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowgamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
