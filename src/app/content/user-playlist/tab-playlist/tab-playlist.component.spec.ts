import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPlaylistComponent } from './tab-playlist.component';

describe('TabPlaylistComponent', () => {
  let component: TabPlaylistComponent;
  let fixture: ComponentFixture<TabPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
