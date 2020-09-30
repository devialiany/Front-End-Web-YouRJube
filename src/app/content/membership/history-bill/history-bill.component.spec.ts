import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryBillComponent } from './history-bill.component';

describe('HistoryBillComponent', () => {
  let component: HistoryBillComponent;
  let fixture: ComponentFixture<HistoryBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
