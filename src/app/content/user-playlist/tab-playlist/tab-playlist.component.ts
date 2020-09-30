import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from './../../../service/session.service';
import { DatabaseService } from './../../../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-tab-playlist',
  templateUrl: './tab-playlist.component.html',
  styleUrls: ['./tab-playlist.component.scss'],
})
export class TabPlaylistComponent implements OnInit {
  @Input('vid') videos: {
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

  idCreatorPlaylist: number;
  fmtTitle: string;
  fmtView: string;
  fmtDateUpload: string;
  fmtDuration: string;
  fmtDescription: string;
  dpS = false;

  idPlaylist: string;
  constructor(
    public ss: SessionService,
    private router: Router,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private db: DatabaseService
  ) {}

  ngOnInit(): void {
    this.idPlaylist = this.route.snapshot.paramMap.get('pid');
    this.apollo
      .watchQuery<any>({
        query: gql`
          query playlist {
              getPlaylistById(id: ${this.idPlaylist}) {
                creator{
                  id
                }
              }
            }
        `,
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.getPlaylistById) {
          this.idCreatorPlaylist = i.creator.id;
        }
      });

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

    if (this.videos.description.length > 100) {
      this.fmtDescription = this.videos.description.substring(0, 100) + '...';
    } else {
      this.fmtDescription = this.videos.description;
    }
  }

  showHideSetting() {
    if (this.dpS == false) {
      this.dpS = true;
    } else {
      this.dpS = false;
    }
  }

  goWatch() {
    this.router.navigateByUrl(
      'watch/' + this.videos.id + '/playlist/' + this.idPlaylist
    );
  }

  goChannel() {
    this.router.navigateByUrl('channel/' + this.videos.creator.id);
  }

  removeVideo() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation deleteVideo {
            deleteVideoPlaylist(playlist_id: ${this.idPlaylist}, video_id: ${this.videos.id})
          }
        `,
        refetchQueries: [
          {
            query: gql`
          query detail {
            getPlaylistdetailsById(id: ${this.idPlaylist}) {
              video {
                id
                title
                date_upload
                duration
                restricted
                premium
                viewer
                photo_thumbnail
                creator {
                  id
                  name
                }
              }
            }
          }`,
          },
        ],
      })
      .subscribe((result) => {
        this.router.navigateByUrl('wait/' + this.idPlaylist);
      });
    console.log('removed');
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

  setTopList() {
    let newList = [];
    for (let i = 0; i < this.db.plyActive.length; i++) {
      const element = this.db.plyActive[i];
      if (this.videos.id != element.id) {
        newList.push(element);
      }
    }
    this.db.plyActive = newList;
    this.db.plyActive.unshift(this.videos);
    this.dpS = false;
  }

  setBottomList() {
    let newList = [];
    console.log(this.db.plyActive);
    for (let i = 0; i < this.db.plyActive.length; i++) {
      const element = this.db.plyActive[i];
      if (this.videos.id != element.id) {
        newList.push(element);
      }
    }
    this.db.plyActive = newList;
    this.db.plyActive.push(this.videos);
    this.dpS = false;
  }

  setUp() {
    let currIdx = this.db.plyActive.indexOf(this.videos);
    if (currIdx != 0) {
      let dataUp = this.db.plyActive[currIdx - 1];
      this.db.plyActive[currIdx] = dataUp;
      this.db.plyActive[currIdx - 1] = this.videos;
    }
    this.dpS = false;
  }

  setDown() {
    let currIdx = this.db.plyActive.indexOf(this.videos);
    if (currIdx != this.db.plyActive.length - 1) {
      let dataUp = this.db.plyActive[currIdx + 1];
      this.db.plyActive[currIdx] = dataUp;
      this.db.plyActive[currIdx + 1] = this.videos;
    }
    this.dpS = false;
  }
}
