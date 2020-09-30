import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-history-bill',
  templateUrl: './history-bill.component.html',
  styleUrls: ['./history-bill.component.scss']
})
export class HistoryBillComponent implements OnInit {
  @Input('membership') membership:{
    type: number
    date: string
    expired_date: string
    status: string
  }

  fmtType: string
  constructor() { }

  ngOnInit(): void {
    if(this.membership.type == 1){
      this.fmtType = "Monthly"
    }else{
      this.fmtType = "Annualy"
    }
  }

}
