import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { DatabaseService } from '../../service/database.service';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  today: string;

  id: string;
  idP: string;
  video = [];
  title: string;
  description: string;
  video_file: string;
  date_upload: string;
  viewer: string;
  channel_id: string;
  channel_name: string;
  channel_icon: string;
  channel_subscriber: number;
  subscribers_count: number;

  //comment
  comments = [];
  comSec = false;
  newComment = '';
  lastKey = 0;
  observer: any;

  //sort
  ba = true;
  bt = false;
  bn = false;

  //subs btn
  btnSubs = true;
  user = true;

  //related
  videos = [];

  //like-dislike
  likeAct = false;
  like = true;

  unlikeAct = false;
  unlike = true;

  countLike = [];
  countDislike = [];

  id_nextVideoP: number;
  id_nextVideoR: number;

  //playlist
  playlistName: string;
  playlistCreatorName: string;
  playlistCreatorId: number;
  videosPl = [];

  //scroll
  observerR: any;
  lastKeyR = 0;

  queue = false;
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public ss: SessionService,
    public db: DatabaseService
  ) {
    this.today = new Date().toLocaleDateString();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.lastKey = 5;
    this.idP = this.route.snapshot.paramMap.get('pid');
    this.observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        let main = document.querySelector('.content');
        for (let i = 0; i < 4; i++) {
          if (this.lastKey < this.comments.length) {
            let div = document.createElement('div');
            let comment = document.createElement('app-comment');
            comment.setAttribute('com', 'this.comments[this.lastKey]');
            div.appendChild(comment);
            main.appendChild(div);
            this.lastKey++;
          }
        }
      }
    });
    this.observer.observe(document.querySelector('.footer'));

    this.lastKeyR = 4;
    this.observerR = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        let main = document.querySelector('.contentR');
        for (let i = 0; i < 4; i++) {
          if (this.lastKey < this.comments.length) {
            let div = document.createElement('div');
            let comment = document.createElement('app-related-video');
            comment.setAttribute('vid', 'this.videos[this.lastKeyR]');
            div.appendChild(comment);
            main.appendChild(div);
            this.lastKeyR++;
          }
        }
      }
    });
    this.observerR.observe(document.querySelector('.footer'));

    //getVideo Watch
    this.apollo
      .watchQuery<any>({
        query: gql`
        query{
          getVideoById(id:${this.id}){
            title
            description
            date_upload
            video_file
            viewer
            category_id
            creator{
              id
              name
              photo_profile
            }
          }
        }`,
      })
      .valueChanges.subscribe((result) => {
        this.video = result.data.getVideoById;
        this.video.forEach((element) => {
          this.title = element.title;
          this.description = element.description;
          this.video_file = element.video_file;
          this.date_upload = new Date(element.date_upload).toDateString();
          this.viewer = element.viewer;
          this.channel_id = element.creator.id;
          this.channel_name = element.creator.name;
          this.channel_icon = element.creator.photo_profile;
          this.getRelatedVideo(element.category_id);
          if (this.ss.creator_id == this.channel_id) {
            this.user = false;
          } else {
            this.user = true;
          }
          for (let i of this.ss.creator_subscribers) {
            if (this.channel_id == i) {
              this.btnSubs = false;
            }
          }
          this.apollo
            .watchQuery<any>({
              query: gql`
                query {
                  getSubscriberByChannelId(channel_id: ${this.channel_id}) {
                    id
                  }
                }
              `,
            })
            .valueChanges.subscribe((result) => {
              let count = result.data.getSubscriberByChannelId;
              this.subscribers_count = count.length;
            });
        });
      });

    this.apollo
      .watchQuery<any>({
        query: gql`query{
        getCommentById(id: ${this.id}){
          id
          content
          date_upload
          video_id
          creator{
            id
            name
            photo_profile
          }
        }
      }`,
      })
      .valueChanges.subscribe((result) => {
        this.comments = result.data.getCommentById;
        if (this.comments.length != 0) {
          this.comSec = true;
        }
      });

    //like-dislike
    if (this.ss.isLogged == true) {
      this.apollo
        .watchQuery<any>({
          query: gql`
            query fbCom {
              getFeedbackVideoByVideoId(video_id: ${this.id}) {
                status
                liker_id
              }
            }
          `,
        })
        .valueChanges.subscribe((result) => {
          console.log(result.data.getFeedbackVideoByVideoId);
          for (let i of result.data.getFeedbackVideoByVideoId) {
            if (i.status == true && i.liker_id == this.ss.creator_id) {
              this.like = false;
              this.likeAct = true;
            } else if (i.status == false && i.liker_id == this.ss.creator_id) {
              this.unlike = false;
              this.unlikeAct = true;
            }
          }
        });
      this.getCount();
    } else {
      this.getCount();
    }
    //get queue tab
    if (this.idP == 'queue') {
      console.log('queue');
      this.queue = true;
    }
    //get Playlist tab
    if (parseInt(this.idP) != 0 && this.idP != 'queue') {
      this.apollo
        .watchQuery<any>({
          query: gql`
          query playlist {
              getPlaylistById(id: ${this.idP}) {
                title
                creator{
                  id
                  name
                }
              }
            }
        `,
        })
        .valueChanges.subscribe((result) => {
          for (let i of result.data.getPlaylistById) {
            this.playlistName = i.title;
            this.playlistCreatorId = i.creator.id;
            this.playlistCreatorName = i.creator.name;
          }
        });
      if (this.db.triggerSortPl == true) {
        this.db.triggerSortPl = false;
      } else {
        this.db.plyActive = [];
        this.apollo
          .watchQuery<any>({
            query: gql`
            query {
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
            for (let i of videos) {
              this.db.plyActive.push(i.video);
            }
            this.id_nextVideoP = this.db.plyActive[1].id;
          });
      }
    }
  }

  getCount() {
    this.apollo
      .watchQuery<any>({
        query: gql`
      query fbCom {
        getFeedbackVideoByVideoId(video_id: ${this.id}) {
          status
        }
      }
    `,
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.getFeedbackVideoByVideoId) {
          if (i.status == true) {
            this.countLike.push(i.status);
          } else if (i.status == false) {
            this.countDislike.push(i.status);
          }
        }
      });
  }

  goChannel() {
    this.router.navigateByUrl('channel/' + this.channel_id);
  }

  toggleComment() {
    if (this.comSec == true) {
      this.comSec = false;
    } else {
      this.comSec = true;
    }
  }

  addComment() {
    if (this.newComment == '') {
      alert('The comment is empty :)');
    } else {
      this.insertComment();
      this.newComment = '';
      alert('Insert Comment Success :)');
    }
  }

  insertComment() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation(
            $content: String!
            $date_upload: String!
            $video_id: Int!
            $creator_id: Int!
          ) {
            insertComment(
              input: {
                content: $content
                date_upload: $date_upload
                video_id: $video_id
                creator_id: $creator_id
              }
            ) {
              id
            }
          }
        `,
        variables: {
          content: this.newComment,
          date_upload: this.today,
          video_id: this.id,
          creator_id: this.ss.creator_id,
        },
        refetchQueries: [
          {
            query: gql`query{
          getCommentById(id: ${this.id}){
            id
            content
            date_upload
            video_id
            creator{
              id
              name
              photo_profile
            }
          }
        }`,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe();
  }

  subscribeChannel() {
    if (this.ss.isLogged == true) {
      this.btnSubs = false;
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
            channel_id: this.channel_id,
            creator_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
              getSubscriberByChannelId(channel_id: ${this.channel_id}) {
                id
              }
            }`,
            },
          ],
        })
        .subscribe((result) => {});
      this.ss.creator_subscribers.push(this.channel_id);
      this.apollo
        .watchQuery<any>({
          query: gql`query{
              getCreatorById(id:${this.channel_id}){
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
      this.apollo
        .mutate({
          mutation: gql`
            mutation($channel_id: Int!, $creator_id: Int!) {
              deleteSubscribe(channel_id: $channel_id, creator_id: $creator_id)
            }
          `,
          variables: {
            channel_id: this.channel_id,
            creator_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getSubscriberByChannelId(channel_id: ${this.channel_id}) {
                  id
                }
              }
            `,
            },
          ],
        })
        .subscribe((result) => {});
      let oldSubs = this.ss.creator_subscribers;
      let remove = this.channel_id;
      let newSubs = oldSubs.filter((item) => item !== remove);
      this.ss.creator_subscribers = newSubs;

      let newChannelSubs = [];
      for (let i = 0; i < this.db.channelSubs.length; i++) {
        const element = this.db.channelSubs[i];
        if (this.channel_id != element.id) {
          newChannelSubs.push(element);
        }
      }
      this.db.channelSubs = newChannelSubs;
      this.db.channelSubs.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.db.modalWantLog = true;
    }
  }

  getRelatedVideo(categoryId: number) {
    this.apollo
      .watchQuery<any>({
        query: gql`
      query{
        getVideoByCategoryId(categoryId: ${categoryId}){
          id
          title
          photo_thumbnail
          date_upload
          duration
          viewer
          premium
          restricted
          location
          creator{
            id
            name
          }
        }
      }`,
      })
      .valueChanges.subscribe((result) => {
        let temp = [];
        for (let i of result.data.getVideoByCategoryId) {
          if (i.id != this.id) {
            if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 1
            ) {
              if (i.premium == 1) {
                temp.push(i);
              }
              //restricted & tidak premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 1
            ) {
              if (i.restricted == 2 && i.premium == 1) {
                temp.push(i);
              }
              //tidak restricted & premium
            } else if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 2
            ) {
              temp.push(i);
              //restricted & premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 2
            ) {
              if (i.restricted == 2) {
                temp.push(i);
              }
            }
          }
        }
        let filterLoc = [];
        let amount = temp.length;
        for (let i = 0; i < amount; i++) {
          let randomIdx = Math.floor(Math.random() * temp.length);
          let randomValue = temp[randomIdx];
          filterLoc.push(randomValue);
          let tempVid = temp
            .slice(0, randomIdx)
            .concat(temp.slice(randomIdx + 1, temp.length));
          temp = tempVid;
        }
        for (let i of filterLoc) {
          if (i.location == this.db.currentLoc) {
            this.videos.push(i);
          }
        }
        for (let i of filterLoc) {
          if (i.location != this.db.currentLoc) {
            this.videos.push(i);
          }
        }
        this.id_nextVideoR = this.videos[0].id;
      });
  }

  sortAll() {
    this.ba = true;
    this.bt = false;
    this.bn = false;
    this.apollo
      .watchQuery<any>({
        query: gql`query{
        getCommentById(id: ${this.id}){
          id
          content
          date_upload
          video_id
          creator{
            id
            name
            photo_profile
          }
        }
      }`,
      })
      .valueChanges.subscribe((result) => {
        this.comments = result.data.getCommentById;
        if (this.comments.length != 0) {
          this.comSec = true;
        }
      });
  }

  sortTopLike() {
    this.ba = false;
    this.bt = true;
    this.bn = false;
    console.log(this.countLike);
  }

  sortNewest() {
    this.ba = false;
    this.bt = false;
    this.bn = true;
    let temp = this.comments.slice().sort((a, b) => {
      return b.id - a.id;
    });
    this.comments = temp;
  }

  vid: any;
  shortkey() {
    this.vid = document.getElementById('videotag') as HTMLVideoElement;
    var audio_element = this.vid;
    document.onkeydown = function (event) {
      switch (event.keyCode) {
        case 38:
          event.preventDefault();
          var audio_vol = audio_element.volume;
          if (audio_vol != 1) {
            try {
              var x = audio_vol + 0.02;
              audio_element.volume = x;
            } catch (err) {
              audio_element.volume = 1;
            }
          }

          break;
        case 40:
          event.preventDefault();
          var audio_vol = audio_element.volume;
          if (audio_vol != 0) {
            try {
              var y = 0;
              y = audio_vol - 0.02;
              audio_element.volume = y;
            } catch (err) {
              audio_element.volume = 0;
            }
          }
          break;
        case 74:
          event.preventDefault();
          audio_element.currentTime -= 10;
          break;
        case 75:
          event.preventDefault();
          audio_element.paused == false
            ? audio_element.pause()
            : audio_element.play();
          break;
        case 76:
          event.preventDefault();
          audio_element.currentTime += 10;
          break;

        case 70:
          event.preventDefault();
          audio_element.requestFullscreen();
          break;
      }
    };
  }

  deletekeys() {
    document.onkeydown = function (event) {};
  }

  showShareModal() {
    this.db.modalShareVideo = true;
    (document.getElementById('sharev') as HTMLInputElement).value =
      location.href;
  }

  goLike() {
    if (this.ss.isLogged == true) {
      this.countLike = [];
      this.countDislike = [];
      this.likeAct = true;
      this.like = false;
      if (this.unlikeAct == true) {
        this.apollo
          .mutate({
            mutation: gql`
              mutation($video_id: Int!, $liker_id: Int!, $status: Boolean!) {
                updateLikeVideo(
                  video_id: $video_id
                  liker_id: $liker_id
                  input: { status: $status }
                ) {
                  status
                }
              }
            `,
            variables: {
              video_id: this.id,
              liker_id: this.ss.creator_id,
              status: true,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackVideoByVideoId(video_id: ${this.id}) {
                  status
                  liker_id
                }
              }`,
                variables: { repoFullName: 'apollographql/apollo-client' },
              },
            ],
          })
          .subscribe();
        this.unlikeAct = false;
        this.unlike = true;
      } else {
        this.apollo
          .mutate({
            mutation: gql`
              mutation($video_id: Int!, $liker_id: Int!, $status: Boolean!) {
                insertLikeVideo(
                  input: {
                    video_id: $video_id
                    liker_id: $liker_id
                    status: $status
                  }
                ) {
                  status
                }
              }
            `,
            variables: {
              video_id: this.id,
              liker_id: this.ss.creator_id,
              status: true,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackVideoByVideoId(video_id: ${this.id}) {
                  status
                  liker_id
                }
              }`,
                variables: { repoFullName: 'apollographql/apollo-client' },
              },
            ],
          })
          .subscribe();
      }
    } else {
      this.db.modalWantLog = true;
    }
  }

  goUnlike() {
    if (this.ss.isLogged == true) {
      this.countLike = [];
      this.countDislike = [];
      this.like = true;
      this.likeAct = false;
      //delete
      this.apollo
        .mutate({
          mutation: gql`
            mutation($video_id: Int!, $liker_id: Int!) {
              deleteLikeVideo(video_id: $video_id, liker_id: $liker_id)
            }
          `,
          variables: {
            video_id: this.id,
            liker_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                  getFeedbackVideoByVideoId(video_id: ${this.id}) {
                    status
                  }
                }`,
              variables: { repoFullName: 'apollographql/apollo-client' },
            },
          ],
        })
        .subscribe();
    } else {
      this.db.modalWantLog = true;
    }
  }

  goDislike() {
    if (this.ss.isLogged == true) {
      this.countLike = [];
      this.countDislike = [];
      this.unlikeAct = true;
      this.unlike = false;
      if (this.likeAct == true) {
        this.apollo
          .mutate({
            mutation: gql`
              mutation($video_id: Int!, $liker_id: Int!, $status: Boolean!) {
                updateLikeVideo(
                  video_id: $video_id
                  liker_id: $liker_id
                  input: { status: $status }
                ) {
                  status
                }
              }
            `,
            variables: {
              video_id: this.id,
              liker_id: this.ss.creator_id,
              status: false,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackVideoByVideoId(video_id: ${this.id}) {
                  status
                  liker_id
                }
              }`,
                variables: { repoFullName: 'apollographql/apollo-client' },
              },
            ],
          })
          .subscribe();
        this.likeAct = false;
        this.like = true;
      } else {
        this.apollo
          .mutate({
            mutation: gql`
              mutation($video_id: Int!, $liker_id: Int!, $status: Boolean!) {
                insertLikeVideo(
                  input: {
                    video_id: $video_id
                    liker_id: $liker_id
                    status: $status
                  }
                ) {
                  status
                }
              }
            `,
            variables: {
              video_id: this.id,
              liker_id: this.ss.creator_id,
              status: false,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackVideoByVideoId(video_id: ${this.id}) {
                  status
                  liker_id
                }
              }`,
                variables: { repoFullName: 'apollographql/apollo-client' },
              },
            ],
          })
          .subscribe();
      }
    } else {
      this.db.modalWantLog = true;
    }
  }

  goUnDislike() {
    if (this.ss.isLogged == true) {
      this.countLike = [];
      this.countDislike = [];
      this.unlike = true;
      this.unlikeAct = false;
      //delete
      this.apollo
        .mutate({
          mutation: gql`
            mutation($video_id: Int!, $liker_id: Int!) {
              deleteLikeVideo(video_id: $video_id, liker_id: $liker_id)
            }
          `,
          variables: {
            video_id: this.id,
            liker_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                  getFeedbackVideoByVideoId(video_id: ${this.id}) {
                    status
                  }
                }`,
              variables: { repoFullName: 'apollographql/apollo-client' },
            },
          ],
        })
        .subscribe();
    } else {
      this.db.modalWantLog = true;
    }
  }

  goNextVideo() {
    if (parseInt(this.idP) != 0 && this.idP != 'queue') {
      let currIdx = this.db.plyActive.findIndex((x) => x.id == this.id);
      if (currIdx == this.db.plyActive.length - 1) {
        currIdx = -1;
      }
      this.router.navigateByUrl(
        'watch/' + this.db.plyActive[currIdx + 1].id + '/playlist/' + this.idP
      );
    } else if (this.idP == 'queue') {
      let currIdx = this.ss.queue.findIndex((x) => x.id == this.id);
      if (currIdx == this.ss.queue.length - 1) {
        currIdx = -1;
      }
      this.router.navigateByUrl(
        'watch/' + this.ss.queue[currIdx + 1].id + '/playlist/' + this.idP
      );
    } else {
      this.router.navigateByUrl('watch/' + this.id_nextVideoR + '/playlist/0');
    }
  }

  savePlaylist() {
    if (this.ss.isLogged == true) {
      this.db.modalAddPlaylist = true;
      this.db.idVideo = parseInt(this.id);
    } else {
      this.db.modalWantLog = true;
    }
  }

  goPlaylist() {
    this.router.navigateByUrl('playlist/' + this.idP);
  }

  goChannelPlaylist() {
    this.router.navigateByUrl('channel/' + this.playlistCreatorId);
  }
}
