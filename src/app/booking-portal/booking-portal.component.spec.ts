import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingPortalComponent } from './booking-portal.component';

describe('BookingPortalComponent', () => {
  let component: BookingPortalComponent;
  let fixture: ComponentFixture<BookingPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
