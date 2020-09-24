import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStepperComponent } from './details-stepper.component';

describe('DetailsStepperComponent', () => {
  let component: DetailsStepperComponent;
  let fixture: ComponentFixture<DetailsStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
