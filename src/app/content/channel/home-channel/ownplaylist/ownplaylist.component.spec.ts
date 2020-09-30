import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnplaylistComponent } from './ownplaylist.component';

describe('OwnplaylistComponent', () => {
  let component: OwnplaylistComponent;
  let fixture: ComponentFixture<OwnplaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnplaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnplaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
