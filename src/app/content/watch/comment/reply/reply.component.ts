import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {
  @Input('rep') replies: {
    id: number,
    content: string,
    date_upload: string,
    creator: {
      id: number
      name: string
      photo_profile: string
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
