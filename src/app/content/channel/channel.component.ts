import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../service/session.service';
import { DatabaseService } from '../../service/database.service';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  id: string;
  creator: any;
  creator_name: string;
  creator_icon: string;
  creator_banner: string;
  subs_count: number;

  user: boolean;
  btnSubs = true;

  //upload

  taskBanner: AngularFireUploadTask;

  percentageBanner: Observable<number>;

  snapshotBanner: Observable<any>;

  downloadUrlBanner: string = '';

  taskIcon: AngularFireUploadTask;

  percentageIcon: Observable<number>;

  snapshotIcon: Observable<any>;

  downloadUrlIcon: string = '';

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    public ss: SessionService,
    public db: DatabaseService,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.db.idChannelR = this.id;
    if (this.ss.creator_id == this.id) {
      this.user = false;
    } else {
      this.user = true;
    }
    this.apollo
      .watchQuery<any>({
        query: gql`
      query {
        getSubscriberByChannelId(channel_id: ${this.id}) {
          id
        }
      }
    `,
      })
      .valueChanges.subscribe((result) => {
        let count = result.data.getSubscriberByChannelId;
        this.subs_count = count.length;
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
      query{
        getCreatorById(id: ${this.id}){
          name
          photo_profile
          photo_background
          subscriber
        }
      }`,
      })
      .valueChanges.subscribe((result) => {
        this.creator = result.data.getCreatorById;
        this.creator.forEach(
          (element: {
            name: string;
            photo_profile: string;
            photo_background: string;
            subscriber: number;
          }) => {
            this.creator_name = element.name;
            this.creator_icon = element.photo_profile;
            this.creator_banner = element.photo_background;
          }
        );
      });
    for (let i of this.ss.creator_subscribers) {
      if (this.id == i) {
        this.btnSubs = false;
      }
    }
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
                creator {
                  name
                  photo_profile
                }
              }
            }
          `,
          variables: {
            channel_id: this.id,
            creator_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
              getSubscriberByChannelId(channel_id: ${this.id}) {
                id
              }
            }`,
            },
          ],
        })
        .subscribe((result) => {});
      this.ss.creator_subscribers.push(this.id);
      this.apollo
        .watchQuery<any>({
          query: gql`query{
              getCreatorById(id:${this.id}){
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
            channel_id: this.id,
            creator_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`
            query {
                  getSubscriberByChannelId(channel_id: ${this.id}) {
                    id
                  }
                }`,
              variables: { repoFullName: 'apollographql/apollo-client' },
            },
          ],
        })
        .subscribe((result) => {});
      let oldSubs = this.ss.creator_subscribers;
      let remove = this.id;
      let newSubs = oldSubs.filter((item) => item !== remove);
      this.ss.creator_subscribers = newSubs;

      let newChannelSubs = [];
      for (let i = 0; i < this.db.channelSubs.length; i++) {
        const element = this.db.channelSubs[i];
        if (this.id != element.id) {
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
    this.router.navigateByUrl('channel/' + this.id);
  }

  async startUploadIcon(event: FileList) {
    const fileI = event.item(0);

    if (fileI.type.split('/')[0] !== 'image') {
      alert('Insert type image please!');
      return;
    }

    const pathI = `icon_channel/${fileI.name}`;

    const customMetadata = { app: 'YouRJube' };

    this.taskIcon = this.storage.upload(pathI, fileI, { customMetadata });

    this.percentageIcon = this.taskIcon.percentageChanges();

    this.snapshotIcon = this.taskIcon.snapshotChanges();

    (await this.taskIcon).ref.getDownloadURL().then((url) => {
      this.downloadUrlIcon = url;
      this.creator_icon = this.downloadUrlIcon;
      console.log(this.downloadUrlIcon);
      this.apollo
        .mutate<any>({
          mutation: gql`
            mutation ($photo_profile: String!){
              updateIcon(
                creator_id: ${this.ss.creator_id}
                input: {
                  photo_profile: $photo_profile
                }
              ) {
                photo_profile
              }
            }
          `,
          variables: { photo_profile: this.downloadUrlIcon },
        })
        .subscribe((result) => {
          this.ss.creator_icon = this.downloadUrlIcon;
        });
    });
  }

  async startUploadBanner(event: FileList) {
    const fileB = event.item(0);

    if (fileB.type.split('/')[0] !== 'image') {
      alert('Insert type image please!');
      return;
    }

    const pathB = `banner_channel/${fileB.name}`;

    const customMetadata = { app: 'YouRJube' };

    this.taskBanner = this.storage.upload(pathB, fileB, { customMetadata });

    this.percentageBanner = this.taskBanner.percentageChanges();

    this.snapshotBanner = this.taskBanner.snapshotChanges();

    (await this.taskBanner).ref.getDownloadURL().then((url) => {
      this.downloadUrlBanner = url;
      this.creator_banner = this.downloadUrlBanner;
      console.log(this.downloadUrlBanner);
      this.apollo
        .mutate<any>({
          mutation: gql`
            mutation ($photo_background: String!) {
              updateBanner(
                creator_id: ${this.ss.creator_id}
                input: {
                  photo_background: $photo_background
                }
              ) {
                photo_background
              }
            }
          `,
          variables: { photo_background: this.downloadUrlBanner },
        })
        .subscribe((result) => {
          this.ss.creator_banner = this.downloadUrlBanner;
        });
    });
  }
}
