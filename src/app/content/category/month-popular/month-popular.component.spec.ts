import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthPopularComponent } from './month-popular.component';

describe('MonthPopularComponent', () => {
  let component: MonthPopularComponent;
  let fixture: ComponentFixture<MonthPopularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthPopularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
