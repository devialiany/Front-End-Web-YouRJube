import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { DatabaseService } from '../../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public ss: SessionService,
    public db: DatabaseService,
    private storage: AngularFireStorage
  ) {}

  videoId: string;
  photo_thumbnail: string;
  title: string;
  description: string;
  privacy: number;

  //upload
  taskThumbnail: AngularFireUploadTask;

  percentageThumbnail: Observable<number>;

  snapshotThumbnail: Observable<any>;

  downloadUrlThumbnail: string = '';

  ngOnInit(): void {
    this.videoId = this.route.snapshot.paramMap.get('id');
    this.apollo
      .watchQuery<any>({
        query: gql`
          query getVideo {
            getVideoById(id: ${this.videoId}) {
              title
              description
              photo_thumbnail
              privacy
            }
          }
        `,
      })
      .valueChanges.subscribe(({ data }) => {
        for (let i of data.getVideoById) {
          this.photo_thumbnail = i.photo_thumbnail;
          this.title = i.title;
          this.description = i.description;
          this.privacy = i.privacy;
        }
      });
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

    this.percentageThumbnail = this.taskThumbnail.percentageChanges();

    this.snapshotThumbnail = this.taskThumbnail.snapshotChanges();

    (await this.taskThumbnail).ref.getDownloadURL().then((url) => {
      this.downloadUrlThumbnail = url;
      this.photo_thumbnail = this.downloadUrlThumbnail;
      console.log(this.downloadUrlThumbnail);
    });
  }

  deleteVideo() {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation {
            deleteVideo(video_id: ${this.videoId})
          }
        `,
        refetchQueries: [
          {
            query: gql`
              query {
                getHomeVideo {
                  id
                  title
                  photo_thumbnail
                  date_upload
                  duration
                  restricted
                  premium
                  location
                  viewer
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
      .subscribe();
    this.router.navigateByUrl('home');
  }

  uploadVideo() {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation(
            $title: String!
            $description: String!
            $photo_thumbnail: String!
            $privacy: Int!
          ) {
            updateVideo(
              id: ${this.videoId}
              input: {
                title: $title
                description: $description
                photo_thumbnail: $photo_thumbnail
                privacy: $privacy
              }
            ) {
              id
            }
          }
        `,
        variables: {
          title: this.title,
          description: this.description,
          photo_thumbnail: this.photo_thumbnail,
          privacy: this.privacy,
        },
        refetchQueries: [
          {
            query: gql`
              query {
                getHomeVideo {
                  id
                  title
                  photo_thumbnail
                  date_upload
                  duration
                  restricted
                  premium
                  location
                  viewer
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
      .subscribe();
    this.router.navigateByUrl('home');
  }
}
