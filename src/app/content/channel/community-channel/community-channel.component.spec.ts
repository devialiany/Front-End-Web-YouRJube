import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityChannelComponent } from './community-channel.component';

describe('CommunityChannelComponent', () => {
  let component: CommunityChannelComponent;
  let fixture: ComponentFixture<CommunityChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
