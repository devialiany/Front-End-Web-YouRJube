import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekPupularComponent } from './week-pupular.component';

describe('WeekPupularComponent', () => {
  let component: WeekPupularComponent;
  let fixture: ComponentFixture<WeekPupularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekPupularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekPupularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
