import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsideComponent } from './playlistside.component';

describe('PlaylistsideComponent', () => {
  let component: PlaylistsideComponent;
  let fixture: ComponentFixture<PlaylistsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
