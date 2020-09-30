import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notif-video',
  templateUrl: './notif-video.component.html',
  styleUrls: ['./notif-video.component.scss'],
})
export class NotifVideoComponent implements OnInit {
  @Input('nv') video: {
    id: number;
    title: string;
    photo_thumbnail: string;
    creator: {
      id: number;
      name: string;
    };
  };

  fmtTitle: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.video.title.length > 30) {
      this.fmtTitle = this.video.title.substring(0, 30) + '...';
    } else {
      this.fmtTitle = this.video.title;
    }
  }

  goWatch() {
    this.router.navigateByUrl('watch/' + this.video.id + '/playlist/' + 0);
  }

  goChannel() {
    this.router.navigateByUrl('channel/' + this.video.creator.id);
  }
}
