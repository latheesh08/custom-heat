import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsStepperComponent } from './appointments-stepper.component';

describe('AppointmentsStepperComponent', () => {
  let component: AppointmentsStepperComponent;
  let fixture: ComponentFixture<AppointmentsStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
