import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsChannelComponent } from './subs-channel.component';

describe('SubsChannelComponent', () => {
  let component: SubsChannelComponent;
  let fixture: ComponentFixture<SubsChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
