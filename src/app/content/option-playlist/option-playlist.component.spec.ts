import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionPlaylistComponent } from './option-playlist.component';

describe('OptionPlaylistComponent', () => {
  let component: OptionPlaylistComponent;
  let fixture: ComponentFixture<OptionPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
