import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomatozComponent } from '@src/app/tomatoz/tomatoz.component';

describe('TomatozComponent', () => {
  let component: TomatozComponent;
  let fixture: ComponentFixture<TomatozComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TomatozComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TomatozComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
