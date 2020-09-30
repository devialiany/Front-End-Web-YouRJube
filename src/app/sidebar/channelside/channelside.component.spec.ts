import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsideComponent } from './channelside.component';

describe('ChannelsideComponent', () => {
  let component: ChannelsideComponent;
  let fixture: ComponentFixture<ChannelsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
