import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePopularComponent } from './time-popular.component';

describe('TimePopularComponent', () => {
  let component: TimePopularComponent;
  let fixture: ComponentFixture<TimePopularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePopularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
