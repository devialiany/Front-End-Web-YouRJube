import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  videos = [];
  creators = [];
  playlists = [];

  keyword: String;

  channelSec = true;
  videoSec = true;
  playlistSec = true;

  week = [];
  today: string;

  //config filter
  all = true;

  tc = false;
  tv = false;
  tp = false;

  tw = false;
  tm = false;
  ty = false;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private ss: SessionService
  ) {}

  ngOnInit(): void {
    this.keyword = this.route.snapshot.paramMap.get('keyword');
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingPlaylists(search: $search) {
              id
              title
              description
              creator {
                id
                name
              }
            }
          }
        `,
        variables: { search: this.keyword },
      })
      .valueChanges.subscribe((result) => {
        this.playlists = result.data.searchingPlaylists;
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingVideo(search: $search) {
              id
              title
              description
              photo_thumbnail
              date_upload
              duration
              viewer
              premium
              restricted
              creator {
                id
                name
              }
            }
          }
        `,
        variables: {
          search: this.keyword,
        },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingVideo) {
          //tidak restricted & tidak premium
          if (
            this.ss.creator_restricted == 1 &&
            this.ss.creator_membership == 1
          ) {
            if (i.premium == 1) {
              this.videos.push(i);
            }
            //restricted & tidak premium
          } else if (
            this.ss.creator_restricted == 2 &&
            this.ss.creator_membership == 1
          ) {
            if (i.restricted == 2 && i.premium == 1) {
              this.videos.push(i);
            }
            //tidak restricted & premium
          } else if (
            this.ss.creator_restricted == 1 &&
            this.ss.creator_membership == 2
          ) {
            this.videos.push(i);
            //restricted & premium
          } else if (
            this.ss.creator_restricted == 2 &&
            this.ss.creator_membership == 2
          ) {
            if (i.restricted == 2) {
              this.videos.push(i);
            }
          }
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingCreator(search: $search) {
              id
              name
              photo_profile
              description
              videos {
                id
              }
            }
          }
        `,
        variables: { search: this.keyword },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingCreator) {
          if (i.id != this.ss.creator_id) {
            this.creators.push(i);
          }
        }
      });
  }

  filterAll() {
    this.router.navigateByUrl('/search/' + this.keyword);
  }

  filterVideo() {
    this.videoSec = true;
    this.channelSec = false;
    this.playlistSec = false;

    this.all = false;
    this.tc = false;
    this.tv = true;
    this.tp = false;
  }

  filterChannel() {
    this.videoSec = false;
    this.channelSec = true;
    this.playlistSec = false;

    this.all = false;
    this.tc = true;
    this.tv = false;
    this.tp = false;
  }

  filterPlaylist() {
    this.videoSec = false;
    this.channelSec = false;
    this.playlistSec = true;

    this.all = false;
    this.tc = false;
    this.tv = false;
    this.tp = true;
  }

  filterWeek() {
    this.videos = [];
    this.creators = [];
    this.playlists = [];
    for (let i = 0; i < 7; i++) {
      this.today = new Date(
        Date.now() - 1000 * 60 * 60 * 24 * i
      ).toLocaleDateString();
      this.week.push(this.today);
    }
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingVideo(search: $search) {
              id
              title
              description
              photo_thumbnail
              date_upload
              duration
              viewer
              premium
              restricted
              creator {
                id
                name
              }
            }
          }
        `,
        variables: {
          search: this.keyword,
        },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingVideo) {
          let date = new Date(i.date_upload).toLocaleDateString();
          if (
            date == this.week[0] ||
            date == this.week[1] ||
            date == this.week[2] ||
            date == this.week[3] ||
            date == this.week[4] ||
            date == this.week[5] ||
            date == this.week[6]
          ) {
            if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 1
            ) {
              if (i.premium == 1) {
                this.videos.push(i);
              }
              //restricted & tidak premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 1
            ) {
              if (i.restricted == 2 && i.premium == 1) {
                this.videos.push(i);
              }
              //tidak restricted & premium
            } else if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 2
            ) {
              this.videos.push(i);
              //restricted & premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 2
            ) {
              if (i.restricted == 2) {
                this.videos.push(i);
              }
            }
          }
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingCreator(search: $search) {
              id
              name
              photo_profile
              subscriber
              description
              join_date
              videos {
                id
              }
            }
          }
        `,
        variables: { search: this.keyword },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingCreator) {
          let date = new Date(i.join_date).toLocaleDateString();
          if (
            (date == this.week[0] ||
              date == this.week[1] ||
              date == this.week[2] ||
              date == this.week[3] ||
              date == this.week[4] ||
              date == this.week[5] ||
              date == this.week[6]) &&
            i.id != this.ss.creator_id
          ) {
            this.creators.push(i);
          }
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingPlaylists(search: $search) {
              id
              title
              description
              date
              creator {
                id
                name
              }
            }
          }
        `,
        variables: { search: this.keyword },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingPlaylists) {
          let date = new Date(i.date).toLocaleDateString();
          if (
            date == this.week[0] ||
            date == this.week[1] ||
            date == this.week[2] ||
            date == this.week[3] ||
            date == this.week[4] ||
            date == this.week[5] ||
            date == this.week[6]
          ) {
            this.playlists.push(i);
          }
        }
      });
    this.all = false;
    this.tw = true;
    this.tm = false;
    this.ty = false;
  }

  filterMonth() {
    this.videos = [];
    this.creators = [];
    this.playlists = [];
    let monthToday = new Date().getMonth();
    let yearToday = new Date().getFullYear();
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingVideo(search: $search) {
              id
              title
              description
              photo_thumbnail
              date_upload
              duration
              viewer
              premium
              restricted
              creator {
                id
                name
              }
            }
          }
        `,
        variables: {
          search: this.keyword,
        },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingVideo) {
          let date = new Date(i.date_upload).getMonth();
          let year = new Date(i.date_upload).getFullYear();
          if (date == monthToday && year == yearToday) {
            if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 1
            ) {
              if (i.premium == 1) {
                this.videos.push(i);
              }
              //restricted & tidak premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 1
            ) {
              if (i.restricted == 2 && i.premium == 1) {
                this.videos.push(i);
              }
              //tidak restricted & premium
            } else if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 2
            ) {
              this.videos.push(i);
              //restricted & premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 2
            ) {
              if (i.restricted == 2) {
                this.videos.push(i);
              }
            }
          }
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingCreator(search: $search) {
              id
              name
              photo_profile
              subscriber
              description
              join_date
              videos {
                id
              }
            }
          }
        `,
        variables: { search: this.keyword },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingCreator) {
          let date = new Date(i.join_date).getMonth();
          let year = new Date(i.join_date).getFullYear();
          if (
            date == monthToday &&
            year == yearToday &&
            i.id != this.ss.creator_id
          ) {
            this.creators.push(i);
          }
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingPlaylists(search: $search) {
              id
              title
              description
              date
              creator {
                id
                name
              }
            }
          }
        `,
        variables: { search: this.keyword },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingPlaylists) {
          let date = new Date(i.date).getMonth();
          let year = new Date(i.date).getFullYear();
          if (date == monthToday && year == yearToday) {
            this.playlists.push(i);
          }
        }
      });
    this.all = false;
    this.tw = false;
    this.tm = true;
    this.ty = false;
  }

  filterYear() {
    this.videos = [];
    this.creators = [];
    this.playlists = [];
    let yearToday = new Date().getFullYear();
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingVideo(search: $search) {
              id
              title
              description
              photo_thumbnail
              date_upload
              duration
              viewer
              premium
              restricted
              creator {
                id
                name
              }
            }
          }
        `,
        variables: {
          search: this.keyword,
        },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingVideo) {
          let date = new Date(i.date_upload).getFullYear();
          if (date == yearToday) {
            if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 1
            ) {
              if (i.premium == 1) {
                this.videos.push(i);
              }
              //restricted & tidak premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 1
            ) {
              if (i.restricted == 2 && i.premium == 1) {
                this.videos.push(i);
              }
              //tidak restricted & premium
            } else if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 2
            ) {
              this.videos.push(i);
              //restricted & premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 2
            ) {
              if (i.restricted == 2) {
                this.videos.push(i);
              }
            }
          }
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingCreator(search: $search) {
              id
              name
              photo_profile
              subscriber
              description
              join_date
              videos {
                id
              }
            }
          }
        `,
        variables: { search: this.keyword },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingCreator) {
          let date = new Date(i.join_date).getFullYear();
          if (date == yearToday && i.id != this.ss.creator_id) {
            this.creators.push(i);
          }
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($search: String!) {
            searchingPlaylists(search: $search) {
              id
              title
              description
              date
              creator {
                id
                name
              }
            }
          }
        `,
        variables: { search: this.keyword },
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.searchingPlaylists) {
          let year = new Date(i.date).getFullYear();
          if (year == yearToday) {
            this.playlists.push(i);
          }
        }
      });
    this.all = false;
    this.tw = false;
    this.tm = false;
    this.ty = true;
  }
}
