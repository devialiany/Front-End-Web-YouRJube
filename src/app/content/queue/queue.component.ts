import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from './../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {
  @Input('vid') videos: {
    id: number;
    title: string;
    photo_thumbnail: string;
    date_upload: string;
    duration: number;
    viewer: number;
    creator: {
      id: number;
      name: string;
    };
  };

  fmtTitle: string;
  fmtView: string;
  fmtDateUpload: string;
  fmtDuration: string;
  constructor(
    public ss: SessionService,
    private router: Router,
    private apollo: Apollo,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.videos.title.length > 50) {
      this.fmtTitle = this.videos.title.substring(0, 50) + '...';
    } else {
      this.fmtTitle = this.videos.title;
    }

    let dateUpload = new Date(this.videos.date_upload);
    let today = new Date();
    let date = dateUpload.getDate();
    let month = dateUpload.getMonth();
    let year = dateUpload.getFullYear();

    if (year < today.getFullYear()) {
      this.fmtDateUpload =
        (today.getFullYear() - year).toString() + ' year(s) ago';
    } else if (month < today.getMonth()) {
      this.fmtDateUpload =
        (today.getMonth() - month).toString() + ' month(s) ago';
    } else if (date < today.getDate()) {
      this.fmtDateUpload = (today.getDate() - date).toString() + ' day(s) ago';
    } else if (date == today.getDate()) {
      this.fmtDateUpload = 'Uploaded Today';
    } else {
      this.fmtDateUpload = this.videos.date_upload;
    }

    if (this.videos.viewer > 1000000000) {
      this.fmtView =
        Math.floor(this.videos.viewer / 1000000000).toString() + 'B';
    } else if (this.videos.viewer > 1000000) {
      this.fmtView = Math.floor(this.videos.viewer / 1000000).toString() + 'M';
    } else if (this.videos.viewer > 1000) {
      this.fmtView = Math.floor(this.videos.viewer / 1000).toString() + 'K';
    } else {
      this.fmtView = this.videos.viewer.toString();
    }

    if (this.videos.duration > 3600) {
      let hours = Math.floor(this.videos.duration / 3600).toString();
      if (hours.length == 1) {
        hours = '0' + hours;
      }
      let minutes = Math.floor(
        Math.floor(this.videos.duration / 3600) % 3600
      ).toString();
      if (minutes.length == 1) {
        minutes = '0' + minutes;
      }
      let seconds = (Math.floor(this.videos.duration % 3600) % 60).toString();
      if (seconds.length == 1) {
        seconds = '0' + seconds;
      }
      this.fmtDuration = hours + ':' + minutes + ':' + seconds;
    } else {
      let minutes = Math.floor(this.videos.duration / 60).toString();
      if (minutes.length == 1) {
        minutes = '0' + minutes;
      }
      let seconds = (this.videos.duration % 60).toString();
      if (seconds.length == 1) {
        seconds = '0' + seconds;
      }
      this.fmtDuration = minutes + ':' + seconds;
    }
  }

  goWatch() {
    this.router.navigateByUrl('watch/' + this.videos.id + '/playlist/queue');
  }

  goChannel() {
    this.router.navigateByUrl('channel/' + this.videos.creator.id);
  }

  removeQueue() {
    let newQueue = [];
    for (let i = 0; i < this.ss.queue.length; i++) {
      const element = this.ss.queue[i];
      if (this.videos.id != element.id) {
        newQueue.push(element);
      }
    }
    this.ss.queue = newQueue;
  }
}
