import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutChannelComponent } from './about-channel.component';

describe('AboutChannelComponent', () => {
  let component: AboutChannelComponent;
  let fixture: ComponentFixture<AboutChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
