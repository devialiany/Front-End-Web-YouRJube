import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifVideoComponent } from './notif-video.component';

describe('NotifVideoComponent', () => {
  let component: NotifVideoComponent;
  let fixture: ComponentFixture<NotifVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
