import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredGamesComponent } from './preferred-games.component';

describe('PreferredGamesComponent', () => {
  let component: PreferredGamesComponent;
  let fixture: ComponentFixture<PreferredGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferredGamesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferredGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
