import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './../service/session.service';
import { DatabaseService } from './../service/database.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() modalSignIn: EventEmitter<boolean> = new EventEmitter<boolean>();

  pointPlaylist = 5;
  pointChannel = 10;

  channels = [];
  constructor(
    public router: Router,
    public ss: SessionService,
    public db: DatabaseService
  ) {}

  ngOnInit(): void {}

  toSubsciptionPage() {
    this.router.navigateByUrl('/subscriptions');
  }

  toSubsciptionChannel() {
    this.router.navigateByUrl('/subschannel');
  }

  showModalSignIn() {
    this.modalSignIn.emit();
  }

  validateUserSubPage() {
    if (this.ss.isLogged == false) {
      this.showModalSignIn();
    } else {
      this.toSubsciptionPage();
    }
  }

  validateUserSubChannel() {
    if (this.ss.isLogged == false) {
      this.showModalSignIn();
    } else {
      this.toSubsciptionChannel();
    }
  }

  showHidePlaylist() {
    if (this.pointPlaylist == 5) {
      this.pointPlaylist = this.db.playlists.length;
    } else {
      this.pointPlaylist = 5;
    }
  }

  showHideChannel() {
    if (this.pointChannel == 10) {
      this.pointChannel = this.db.channelSubs.length;
    } else {
      this.pointChannel = 10;
    }
  }

  goQueue() {
    let id = this.ss.queue[0].id;
    this.router.navigateByUrl('watch/' + id + '/playlist/queue');
    this.db.plyActive = [];
  }
}
