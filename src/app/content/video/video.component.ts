import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './../../service/session.service';
import { DatabaseService } from './../../service/database.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
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
      photo_profile: string;
    };
  };

  fmtTitle: string;
  fmtView: string;
  fmtDuration: string;
  fmtDateUpload: String;

  channel_name: String;
  channels: any;

  dpS = false;

  constructor(
    private router: Router,
    public ss: SessionService,
    private db: DatabaseService
  ) {}

  ngOnInit(): void {
    let dateUpload = new Date(this.videos.date_upload);
    let today = new Date();
    let date = dateUpload.getDate();
    let month = dateUpload.getMonth();
    let year = dateUpload.getFullYear();

    if (this.videos.title.length > 50) {
      this.fmtTitle = this.videos.title.substring(0, 50) + '...';
    } else {
      this.fmtTitle = this.videos.title;
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

  goChannel() {
    this.router.navigateByUrl('channel/' + this.videos.creator.id);
  }

  showHideSetting() {
    if (this.dpS == false) {
      this.dpS = true;
    } else {
      this.dpS = false;
    }
  }

  goWatch() {
    this.router.navigateByUrl('watch/' + this.videos.id + '/playlist/' + 0);
    this.db.plyActive = [];
  }

  savePlaylist() {
    if (this.ss.isLogged == true) {
      this.db.modalAddPlaylist = true;
      this.db.idVideo = this.videos.id;
      this.dpS = false;
    } else {
      this.db.modalWantLog = true;
    }
  }

  addQueue() {
    this.ss.queue.push(this.videos);
    console.log(this.ss.queue);
    this.dpS = false;
  }

  editVideo() {
    this.router.navigateByUrl('edit/' + this.videos.id);
  }
}
