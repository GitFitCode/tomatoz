import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleProgressionBarComponent } from '@src/app/home/circle-progression-bar/circle-progression-bar.component';

describe('CircleProgressionBarComponent', () => {
  let component: CircleProgressionBarComponent;
  let fixture: ComponentFixture<CircleProgressionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleProgressionBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleProgressionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
