import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './../../service/database.service';
@Component({
  selector: 'app-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.scss'],
})
export class KeywordComponent implements OnInit {
  @Input('key') key: string;
  constructor(private router: Router, private db: DatabaseService) {}

  ngOnInit(): void {}

  goSearch() {
    this.router.navigateByUrl('search/' + this.key);
    this.db.autoComplete = false;
    this.db.keyword = this.key;
  }
}
