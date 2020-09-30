import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './../../service/session.service';
import { DatabaseService } from './../../service/database.service';

@Component({
  selector: 'app-videolist',
  templateUrl: './videolist.component.html',
  styleUrls: ['./videolist.component.scss'],
})
export class VideolistComponent implements OnInit {
  @Input('vidl') videos: {
    id: number;
    title: string;
    description: string;
    photo_thumbnail: string;
    date_upload: string;
    duration: number;
    viewer: number;
    creator: {
      id: number;
      name: string;
    };
  };

  date_now: Date;
  year: string;
  month: string;
  date: string;

  fmtTitle: string;
  fmtView: string;
  fmtDuration: string;
  fmtDateUpload: string;
  fmtDescription: string;

  channel_name: string;
  channels: any;

  dpS = false;
  constructor(
    private router: Router,
    public ss: SessionService,
    private db: DatabaseService
  ) {}

  ngOnInit(): void {
    this.date_now = new Date();
    this.year = this.videos.date_upload.substr(0, 4);
    this.month = this.videos.date_upload.substr(5, 2);
    this.date = this.videos.date_upload.substr(8, 2);

    if (this.videos.title.length > 65) {
      this.fmtTitle = this.videos.title.substring(0, 65) + '...';
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

    if (parseInt(this.year) < this.date_now.getFullYear()) {
      this.fmtDateUpload =
        (this.date_now.getFullYear() - parseInt(this.year)).toString() +
        ' year(s) ago';
    } else if (parseInt(this.month) < this.date_now.getMonth() + 1) {
      this.fmtDateUpload =
        (this.date_now.getMonth() + 1 - parseInt(this.month)).toString() +
        ' month(s) ago';
    } else if (parseInt(this.date) < this.date_now.getDate()) {
      this.fmtDateUpload =
        (this.date_now.getDate() - parseInt(this.date)).toString() +
        ' day(s) ago';
    } else if (parseInt(this.date) == this.date_now.getDate()) {
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

    if (this.videos.description.length > 300) {
      this.fmtDescription = this.videos.description.substring(0, 300) + '...';
    } else {
      this.fmtDescription = this.videos.description;
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
    this.router.navigateByUrl('watch/' + this.videos.id + '/playlist/0');
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
}
