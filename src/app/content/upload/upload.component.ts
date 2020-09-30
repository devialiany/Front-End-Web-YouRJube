import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { SessionService } from '../../service/session.service';
import { DatabaseService } from './,,/../../../service/database.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  fileName: string;
  videoDuration: string;
  duration: number = 0;
  link: string = '';
  id: number;
  plyU = 0;

  taskVideo: AngularFireUploadTask;

  percentageVideo: Observable<number>;

  snapshotVideo: Observable<any>;

  downloadUrlVideo: string = '';

  isHoveringVideo: boolean;

  taskThumbnail: AngularFireUploadTask;

  percentageThumbnail: Observable<number>;

  snapshotThumbnail: Observable<any>;

  downloadUrlThumbnail: string = '';

  isHoveringThumbnail: boolean;

  //forms
  title: string;
  today: string;
  description: string;
  category: number = 0;
  age: number;
  privacy: number;
  premium: number;

  constructor(
    private storage: AngularFireStorage,
    private apollo: Apollo,
    public ss: SessionService,
    private router: Router,
    public db: DatabaseService
  ) {
    this.today = new Date().toDateString();
  }

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            getNewIdVideoUpload {
              id
            }
          }
        `,
      })
      .valueChanges.subscribe(({ data }) => {
        this.id = data.getNewIdVideoUpload[0].id + 1;
        console.log(this.id);
      });
  }

  uploadToDB(): void {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation(
            $title: String!
            $description: String!
            $duration: Int!
            $date_upload: String!
            $date_publish: String!
            $photo_thumbnail: String!
            $video_file: String!
            $restricted: Int!
            $privacy: Int!
            $premium: Int!
            $viewer: Int!
            $status: Int!
            $category_id: Int!
            $creator_id: Int!
            $location: String!
          ) {
            insertVideo(
              input: {
                title: $title
                description: $description
                duration: $duration
                date_upload: $date_upload
                date_publish: $date_publish
                photo_thumbnail: $photo_thumbnail
                video_file: $video_file
                restricted: $restricted
                privacy: $privacy
                premium: $premium
                viewer: $viewer
                status: $status
                category_id: $category_id
                creator_id: $creator_id
                location: $location
              }
            ) {
              id
            }
          }
        `,
        variables: {
          title: this.title,
          description: this.description,
          duration: this.duration,
          date_upload: this.today,
          date_publish: this.today,
          photo_thumbnail: this.downloadUrlThumbnail,
          video_file: this.downloadUrlVideo,
          restricted: this.age,
          privacy: this.privacy,
          premium: this.premium,
          viewer: 0,
          status: 1,
          category_id: this.category,
          creator_id: this.ss.creator_id,
          location: 'Indonesia',
        },
        refetchQueries: [
          {
            query: gql`
            query{
              getCreatorById(id:${this.ss.creator_id}){
                videos{
                  id
                  title
                  photo_thumbnail
                  date_upload
                  duration
                  viewer
                  creator{
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
        let id = result.data.insertVideo.id;
        this.router.navigateByUrl(
          '/channel/' + this.ss.creator_id + '/homechannel'
        );
      });
    if (this.plyU != 0) {
      this.apollo
        .mutate({
          mutation: gql`
              mutation {
                insertDetailPlaylist(input: { playlist_id: ${this.plyU}, video_id: ${this.id}}) {
                  video_id
                }
              }
            `,
        })
        .subscribe();
      let today = new Date().toLocaleDateString();
      this.apollo
        .mutate({
          mutation: gql`
            mutation($date: String!) {
              updateEditPlaylist(playlist_id: ${this.plyU}, input: { date: $date }) {
                date
              }
            }
          `,
          variables: { date: today },
        })
        .subscribe();
    }
  }
  toggleHoverVideo(event: boolean) {
    this.isHoveringVideo = event;
  }

  async startUploadThumbnail(event: FileList) {
    const fileT = event.item(0);

    if (fileT.type.split('/')[0] !== 'image') {
      alert('Insert type image please!');
      return;
    }

    const pathT = `thumbnail/${fileT.name}`;

    const customMetadata = { app: 'YouRJube' };

    this.taskThumbnail = this.storage.upload(pathT, fileT, { customMetadata });

    // const ref = this.storage.ref(pathT);

    this.percentageThumbnail = this.taskThumbnail.percentageChanges();

    this.snapshotThumbnail = this.taskThumbnail.snapshotChanges();

    (await this.taskThumbnail).ref.getDownloadURL().then((url) => {
      this.downloadUrlThumbnail = url;
      console.log(this.downloadUrlThumbnail);
    });
  }

  toggleHoverThumbnail(event: boolean) {
    this.isHoveringThumbnail = event;
  }

  async startUploadVideo(event: FileList) {
    const fileV = event.item(0);

    if (fileV.type.split('/')[0] !== 'video') {
      alert('Insert type video please!');
      return;
    }

    this.fileName = fileV.name;
    const pathV = `videos/${fileV.name}`;

    const customMetadata = { app: 'YouRJube' };

    this.taskVideo = this.storage.upload(pathV, fileV, { customMetadata });

    this.percentageVideo = this.taskVideo.percentageChanges();

    this.snapshotVideo = this.taskVideo.snapshotChanges();

    (await this.taskVideo).ref.getDownloadURL().then((url) => {
      this.downloadUrlVideo = url;
      console.log(this.downloadUrlVideo);
      setTimeout(() => {
        var video = document.getElementById('uploadvideo') as HTMLVideoElement;
        this.duration = Math.floor(video.duration);
        if (this.duration > 3600) {
          let hours = Math.floor(this.duration / 3600).toString();
          if (hours.length == 1) {
            hours = '0' + hours;
          }
          let minutes = Math.floor(
            Math.floor(this.duration / 3600) % 3600
          ).toString();
          if (minutes.length == 1) {
            minutes = '0' + minutes;
          }
          let seconds = (Math.floor(this.duration % 3600) % 60).toString();
          if (seconds.length == 1) {
            seconds = '0' + seconds;
          }
          this.videoDuration = hours + ':' + minutes + ':' + seconds;
        } else {
          let minutes = Math.floor(this.duration / 60).toString();
          if (minutes.length == 1) {
            minutes = '0' + minutes;
          }
          let seconds = (this.duration % 60).toString();
          if (seconds.length == 1) {
            seconds = '0' + seconds;
          }
          this.videoDuration = minutes + ':' + seconds;
        }
        this.link = 'localhost:4200/watch/' + this.id + '/playlist/0';
      }, 10000);
    });
  }

  addnewplaylist() {
    this.db.modalAddPlaylistUpload = true;
  }
}
