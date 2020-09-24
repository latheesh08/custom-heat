import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNotfoundComponent } from './customer-notfound.component';

describe('CustomerNotfoundComponent', () => {
  let component: CustomerNotfoundComponent;
  let fixture: ComponentFixture<CustomerNotfoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerNotfoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerNotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
