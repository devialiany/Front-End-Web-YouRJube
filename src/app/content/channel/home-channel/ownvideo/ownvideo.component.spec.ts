import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnvideoComponent } from './ownvideo.component';

describe('OwnvideoComponent', () => {
  let component: OwnvideoComponent;
  let fixture: ComponentFixture<OwnvideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnvideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
