import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DatabaseService } from './../../../service/database.service';
import { SessionService } from './../../../service/session.service';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';

@Component({
  selector: 'app-community-channel',
  templateUrl: './community-channel.component.html',
  styleUrls: ['./community-channel.component.scss'],
})
export class CommunityChannelComponent implements OnInit {
  communities = [];

  icon_creator = '';
  title: string;
  description: string;
  post_image = '';

  //upload
  taskPost: AngularFireUploadTask;

  percentagePost: Observable<number>;

  snapshotPost: Observable<any>;

  downloadUrlPost: string = '';

  constructor(
    private apollo: Apollo,
    public db: DatabaseService,
    private storage: AngularFireStorage,
    public ss: SessionService
  ) {}
  ngOnInit(): void {
    this.icon_creator = this.ss.creator_icon;
    this.apollo
      .watchQuery<any>({
        query: gql`query{
          getCommunityByCreatorId(creator_id:${this.db.idChannelR}){
            id
            title
            description
            post_image
            date
          }
        }`,
      })
      .valueChanges.subscribe((result) => {
        this.communities = result.data.getCommunityByCreatorId;
      });
  }

  async startUploadImage(event: FileList) {
    const fileP = event.item(0);

    if (fileP.type.split('/')[0] !== 'image') {
      alert('Insert type image please!');
      return;
    }

    const pathP = `post/${fileP.name}`;

    const customMetadata = { app: 'YouRJube' };

    this.taskPost = this.storage.upload(pathP, fileP, { customMetadata });

    this.percentagePost = this.taskPost.percentageChanges();

    this.snapshotPost = this.taskPost.snapshotChanges();

    (await this.taskPost).ref.getDownloadURL().then((url) => {
      this.downloadUrlPost = url;
      this.post_image = this.downloadUrlPost;
      console.log(this.downloadUrlPost);
    });
  }

  post() {
    let today = new Date().toLocaleDateString();
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation(
            $title: String!
            $description: String!
            $post_image: String!
            $date: String!
            $creator_id: Int!
          ) {
            insertCommunity(
              input: {
                title: $title
                description: $description
                post_image: $post_image
                date: $date
                creator_id: $creator_id
              }
            ) {
              id
            }
          }
        `,
        variables: {
          title: this.title,
          description: this.description,
          post_image: this.post_image,
          date: today,
          creator_id: this.ss.creator_id,
        },
        refetchQueries: [
          {
            query: gql`
              query{
              getCommunityByCreatorId(creator_id:${this.db.idChannelR}){
                id
                title
                description
                post_image
                date
              }
            }
          `,
          },
        ],
      })
      .subscribe();
    alert('InsertSuccess');
    this.title = '';
    this.description = '';
    this.post_image = '';
  }
}
