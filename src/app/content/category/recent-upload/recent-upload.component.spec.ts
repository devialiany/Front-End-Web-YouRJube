import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentUploadComponent } from './recent-upload.component';

describe('RecentUploadComponent', () => {
  let component: RecentUploadComponent;
  let fixture: ComponentFixture<RecentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
