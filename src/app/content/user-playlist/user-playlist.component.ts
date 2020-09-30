import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { SessionService } from './../../service/session.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-user-playlist',
  templateUrl: './user-playlist.component.html',
  styleUrls: ['./user-playlist.component.scss'],
})
export class UserPlaylistComponent implements OnInit {
  today = new Date().toLocaleDateString();
  constructor(
    private apollo: Apollo,
    public db: DatabaseService,
    private route: ActivatedRoute,
    public ss: SessionService,
    private router: Router
  ) {}
  idP: string;
  id: number;
  title: string;
  description: string;
  date: string;
  viewer: number;
  type: number;
  photo_thumbnail =
    'https://firebasestorage.googleapis.com/v0/b/yourjube1701.appspot.com/o/thumbnail%2Fno%20image.png?alt=media&token=e3e5fde0-6e36-41e8-b1c4-d196efa2da9b';
  cid: number;
  cname: string;
  cphoto: string;

  idVideoOne: number;

  //subscribe
  btnSubs = true;
  user = true;

  //remove saved playlist (sidebar) & tabel userplaylist
  btnUserSavedPlaylist = true;
  btnRemoveSaved = false;
  btnRemoveMyPlaylist = false;

  lastKey = 0;
  observer: any;

  //sort
  bAddO = true;
  bAddN = false;
  bPubO = false;
  bPubN = false;
  bPop = false;

  ngOnInit(): void {
    this.idP = this.route.snapshot.paramMap.get('pid');
    this.lastKey = 6;
    this.observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        let main = document.querySelector('.content');
        for (let i = 0; i < 4; i++) {
          if (this.lastKey < this.db.plyActive.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-tab-playlist');
            video.setAttribute('vid', 'this.videos[this.lastKey]');
            div.appendChild(video);
            main.appendChild(div);
            this.lastKey++;
          }
        }
      }
    });
    this.observer.observe(document.querySelector('.footer'));
    this.getData();
  }

  getData() {
    this.db.plyActive = [];
    this.apollo
      .watchQuery<any>({
        query: gql`
          query playlist {
            getPlaylistById(id: ${this.idP}) {
              id
              title
              description
              date
              viewer
              type
              creator {
                id
                name
                photo_profile
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        let playlist = result.data.getPlaylistById;
        for (let i of playlist) {
          this.id = i.id;
          this.title = i.title;
          this.description = i.description;
          this.date = new Date(i.date).toLocaleDateString();
          this.viewer = i.viewer;
          this.cid = i.creator.id;
          this.cname = i.creator.name;
          this.cphoto = i.creator.photo_profile;
          this.type = i.type;
        }
        if (this.cid == this.ss.creator_id) {
          this.user = false;
          this.btnUserSavedPlaylist = false;
        }
        for (let i of this.ss.creator_subscribers) {
          if (this.cid == i) {
            this.btnSubs = false;
          }
        }
        for (let i of this.db.playlists) {
          if (i.id == this.id && i.creator.id != this.ss.creator_id) {
            this.btnRemoveSaved = true;
            this.btnRemoveMyPlaylist = false;
          } else if (i.id == this.id && i.creator.id == this.ss.creator_id) {
            this.btnRemoveSaved = false;
            this.btnRemoveMyPlaylist = true;
          }
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query detail {
            getPlaylistdetailsById(id: ${this.idP}) {
              video {
                id
                title
                description
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
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        let videos = result.data.getPlaylistdetailsById;
        if (videos != 0) {
          this.photo_thumbnail = videos[0].video.photo_thumbnail;
          this.idVideoOne = videos[0].video.id;
        }
        for (let i of videos) {
          this.db.plyActive.push(i.video);
        }
      });
    console.log(this.db.plyActive);
  }

  showModalShare() {
    this.db.modalSharePlaylist = true;
    (document.getElementById('sharepl') as HTMLInputElement).value =
      location.href;
  }

  subscribeChannel() {
    if (this.ss.isLogged == true) {
      this.btnSubs = false;
      console.log(this.cid);
      this.apollo
        .mutate({
          mutation: gql`
            mutation($channel_id: Int!, $creator_id: Int!) {
              insertSubscribe(
                input: { channel_id: $channel_id, creator_id: $creator_id }
              ) {
                id
              }
            }
          `,
          variables: {
            channel_id: this.cid,
            creator_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getSubscriberByChannelId(channel_id: ${this.cid}) {
                  id
                }
              }`,
            },
          ],
        })
        .subscribe((result) => {});
      this.ss.creator_subscribers.push(this.cid);
      this.apollo
        .watchQuery<any>({
          query: gql`query{
              getCreatorById(id:${this.cid}){
                id
                name
                photo_profile
              }
            }`,
        })
        .valueChanges.subscribe((result) => {
          let c = result.data.getCreatorById;
          this.db.channelSubs.push(c[0]);
          this.db.channelSubs.sort((a, b) => a.name.localeCompare(b.name));
        });
    } else {
      this.db.modalWantLog = true;
    }
  }

  unsubscribeChannel() {
    if (this.ss.isLogged == true) {
      this.btnSubs = true;
      console.log(this.cid);
      this.apollo
        .mutate({
          mutation: gql`
            mutation($channel_id: Int!, $creator_id: Int!) {
              deleteSubscribe(channel_id: $channel_id, creator_id: $creator_id)
            }
          `,
          variables: {
            channel_id: this.cid,
            creator_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getSubscriberByChannelId(channel_id: ${this.cid}) {
                  id
                }
              }`,
            },
          ],
        })
        .subscribe((result) => {});
      let oldSubs = this.ss.creator_subscribers;
      let remove = this.cid;
      let newSubs = oldSubs.filter((item) => item !== remove);
      this.ss.creator_subscribers = newSubs;
      let newChannelSubs = [];
      for (let i = 0; i < this.db.channelSubs.length; i++) {
        const element = this.db.channelSubs[i];
        if (this.cid != element.id) {
          newChannelSubs.push(element);
        }
      }
      this.db.channelSubs = newChannelSubs;
      this.db.channelSubs.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.db.modalWantLog = true;
    }
  }

  goChannel() {
    this.router.navigateByUrl('channel/' + this.cid);
  }

  addToUserPlaylist() {
    if (this.ss.isLogged == true) {
      this.btnRemoveSaved = true;
      this.apollo
        .mutate({
          mutation: gql`
            mutation insertPlaylist {
              insertUserPlaylist(input: { creator_id: ${this.ss.creator_id}, playlist_id: ${this.id} }) {
                creator_id
              }
            }
          `,
        })
        .subscribe((result) => {
          this.apollo
            .watchQuery<any>({
              query: gql`
                    query {
                      getPlaylistById(id: ${this.id}) {
                        id
                        title
                        type
                        creator{
                          id
                        }
                      }
                    }
                  `,
            })
            .valueChanges.subscribe((result) => {
              for (let i of result.data.getPlaylistById) {
                this.db.playlists.push(i);
                this.db.playlists.sort((a, b) => {
                  return a.type - b.type;
                });
              }
            });
        });
    } else {
      this.db.modalWantLog = true;
    }
  }

  removeToUserPlaylist() {
    this.btnRemoveSaved = false;
    this.apollo
      .mutate({
        mutation: gql`
          mutation deletePlaylist {
            deleteUserPlaylist(creator_id: ${this.ss.creator_id}, playlist_id: ${this.id})
          }
        `,
      })
      .subscribe();
    let newUserPlaylist = [];
    for (let i = 0; i < this.db.playlists.length; i++) {
      const element = this.db.playlists[i];
      if (this.id != element.id) {
        newUserPlaylist.push(element);
      }
    }
    this.db.playlists = newUserPlaylist;
    this.db.playlists.sort((a, b) => {
      return a.type - b.type;
    });
  }

  removeMyPlaylist() {
    //hapus userplaylist
    this.apollo
      .mutate({
        mutation: gql`
          mutation deletePlaylist {
            deleteUserPlaylist(creator_id: ${this.ss.creator_id}, playlist_id: ${this.id})
          }
        `,
        refetchQueries: [
          {
            query: gql`
              query getPlaylist {
                getPlaylistByCreatorId(creator_id: ${this.ss.creator_id}) {
                  id
                  title
                }
              }
            `,
          },
        ],
      })
      .subscribe();
    //hapus service user playlist
    let newUserPlaylist = [];
    for (let i = 0; i < this.db.playlists.length; i++) {
      const element = this.db.playlists[i];
      if (this.id != element.id) {
        newUserPlaylist.push(element);
      }
    }
    this.db.playlists = newUserPlaylist;
    this.db.playlists.sort((a, b) => {
      return a.type - b.type;
    });
    //hapus dari list playlist creator made
    let newCreatorPlaylist = [];
    for (let i = 0; i < this.db.userPlaylist.length; i++) {
      const element = this.db.userPlaylist[i];
      if (this.id != element.id) {
        newCreatorPlaylist.push(element);
      }
    }
    this.db.userPlaylist = newCreatorPlaylist;
    //hapus table playlists
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation {
            deletePlaylistByPlaylistId(playlist_id: ${this.id})
          }
        `,
      })
      .subscribe();
    //hapus dari playlist detail
    this.apollo
      .mutate<any>({
        mutation: gql`
        mutation deleteAllVideo {
            deleteAllVideoPlaylist(playlist_id: ${this.id})
          }
        `,
      })
      .subscribe();
    //pindah ke home aja
    this.router.navigateByUrl('home');
  }

  removeAllVideo() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation deleteAllVideo {
            deleteAllVideoPlaylist(playlist_id: ${this.id})
          }
        `,
        refetchQueries: [
          {
            query: gql`
              query {
                getPlaylistdetailsById(id: ${this.id}) {
                  video {
                    id
                    title
                    description
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
              }
            `,
          },
        ],
      })
      .subscribe((result) => {});
    this.apollo
      .mutate({
        mutation: gql`
          mutation($date: String!) {
            updateEditPlaylist(playlist_id: ${this.id}, input: { date: $date }) {
              date
            }
          }
        `,
        variables: { date: this.today },
        refetchQueries: [
          {
            query: gql`
            query playlist {
              getPlaylistById(id: ${this.idP}) {
                id
                title
                description
                date
                viewer
                type
                creator {
                  id
                  name
                  photo_profile
                }
              }
            }
          `,
          },
        ],
      })
      .subscribe((result) => {
        this.router.navigateByUrl('wait/' + this.idP);
      });
  }

  sortAllO() {
    this.router.navigateByUrl('playlist/' + this.idP);
  }

  sortAllN() {
    this.bAddO = false;
    this.bAddN = true;
    this.bPubO = false;
    this.bPubN = false;
    this.bPop = false;
    this.db.plyActive.sort((a, b) => b.id - a.id);
    this.db.triggerSortPl = true;
  }

  sortPublishO() {
    this.bAddO = false;
    this.bAddN = false;
    this.bPubO = true;
    this.bPubN = false;
    this.bPop = false;
    this.db.plyActive.sort((a, b) =>
      b.date_upload.localeCompare(a.date_upload)
    );
    this.db.triggerSortPl = true;
  }

  sortPublishN() {
    this.bAddO = false;
    this.bAddN = false;
    this.bPubO = false;
    this.bPubN = true;
    this.bPop = false;
    this.db.plyActive.sort((a, b) =>
      a.date_upload.localeCompare(b.date_upload)
    );
    this.db.triggerSortPl = true;
  }

  sortPopular() {
    this.bAddO = false;
    this.bAddN = false;
    this.bPubO = false;
    this.bPubN = false;
    this.bPop = true;
    this.db.plyActive.sort((a, b) => {
      return b.viewer - a.viewer;
    });
    this.db.triggerSortPl = true;
  }

  playAll() {
    if (this.db.plyActive.length == 0) {
      alert('no video');
    } else {
      this.router.navigateByUrl(
        'watch/' + this.db.plyActive[0].id + '/playlist/' + this.idP
      );
    }
  }

  setType(type: number) {
    let newList = [];
    for (let i = 0; i < this.db.playlists.length; i++) {
      const element = this.db.playlists[i];
      if (this.idP != element.id) {
        newList.push(element);
      }
    }
    this.db.playlists = newList;
    this.apollo
      .mutate<any>({
        mutation: gql`
        mutation {
          updateTypePlaylist(playlist_id:${this.idP}, input:{type: ${type}}){
            type
          }
        }`,
        refetchQueries: [
          {
            query: gql`
            query {
              getPlaylistById(id: ${this.idP}) {
                id
                title
                description
                date
                viewer
                type
                creator {
                  id
                  name
                  photo_profile
                }
              }
            }`,
          },
        ],
      })
      .subscribe();
  }
  editT = false;
  editTitle() {
    this.editT = true;
  }

  changeTitle() {
    this.editT = false;
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation($title: String!){
            updateTitlePlaylist(
              playlist_id: ${this.idP}
              input: { title: $title }
            ) {
              title
            }
          }
        `,
        variables: { title: this.title },
        refetchQueries: [
          {
            query: gql`
            query {
              getPlaylistById(id: ${this.idP}) {
                id
                title
                description
                date
                viewer
                type
                creator {
                  id
                  name
                  photo_profile
                }
              }
            }`,
          },
        ],
      })
      .subscribe();
    let newList = [];
    for (let i = 0; i < this.db.playlists.length; i++) {
      const element = this.db.playlists[i];
      if (this.idP != element.id) {
        newList.push(element);
      }
    }
    this.db.playlists = newList;
  }

  editD = false;

  editDesc() {
    this.editD = true;
  }

  changeDesc() {
    this.editD = false;
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation($description: String!){
            updateDescriptionPlaylist(
              playlist_id: ${this.idP}
              input: { description: $description }
            ) {
              description
            }
          }
        `,
        variables: { description: this.description },
        refetchQueries: [
          {
            query: gql`
            query {
              getPlaylistById(id: ${this.idP}) {
                id
                title
                description
                date
                viewer
                type
                creator {
                  id
                  name
                  photo_profile
                }
              }
            }`,
          },
        ],
      })
      .subscribe();
    let newList = [];
    for (let i = 0; i < this.db.playlists.length; i++) {
      const element = this.db.playlists[i];
      if (this.idP != element.id) {
        newList.push(element);
      }
    }
    this.db.playlists = newList;
  }

  randomPlay() {
    let rIdx = Math.floor(Math.random() * this.db.plyActive.length);
    console.log(rIdx);
    if (this.db.plyActive.length == 0) {
      alert('no video');
    } else {
      this.router.navigateByUrl(
        'watch/' + this.db.plyActive[rIdx].id + '/playlist/' + this.idP
      );
    }
  }
}
