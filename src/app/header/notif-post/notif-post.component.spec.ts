import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifPostComponent } from './notif-post.component';

describe('NotifPostComponent', () => {
  let component: NotifPostComponent;
  let fixture: ComponentFixture<NotifPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
