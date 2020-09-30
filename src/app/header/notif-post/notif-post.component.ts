import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notif-post',
  templateUrl: './notif-post.component.html',
  styleUrls: ['./notif-post.component.scss'],
})
export class NotifPostComponent implements OnInit {
  @Input('np') post: {
    title: string;
    creator: {
      id: number;
      name: string;
    };
  };
  fmtTitle: string;
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.post.title.length > 30) {
      this.fmtTitle = this.post.title.substring(0, 30) + '...';
    } else {
      this.fmtTitle = this.post.title;
    }
  }

  goChannel() {
    this.router.navigateByUrl('channel/' + this.post.creator.id);
  }

  goView() {
    this.router.navigateByUrl(
      'channel/' + this.post.creator.id + '/communitychannel'
    );
  }
}
