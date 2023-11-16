import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithDrawRequestComponent } from './with-draw-request.component';

describe('WithDrawRequestComponent', () => {
  let component: WithDrawRequestComponent;
  let fixture: ComponentFixture<WithDrawRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithDrawRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithDrawRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
