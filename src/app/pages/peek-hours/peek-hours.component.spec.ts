import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeekHoursComponent } from './peek-hours.component';

describe('PeekHoursComponent', () => {
  let component: PeekHoursComponent;
  let fixture: ComponentFixture<PeekHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeekHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeekHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
