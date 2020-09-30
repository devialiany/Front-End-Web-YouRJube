import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistChannelComponent } from './playlist-channel.component';

describe('PlaylistChannelComponent', () => {
  let component: PlaylistChannelComponent;
  let fixture: ComponentFixture<PlaylistChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
