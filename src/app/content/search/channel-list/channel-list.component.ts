import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../service/session.service';
import { DatabaseService } from '../../../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
})
export class ChannelListComponent implements OnInit {
  @Input('cre') creator: {
    id: number;
    name: string;
    photo_profile: string;
    description: string;
    videos: any;
  };

  subscribers_count: number;
  fmtDescription: string;
  fmtSubs: string;

  btnSubs = true;
  constructor(
    private router: Router,
    public ss: SessionService,
    private apollo: Apollo,
    public db: DatabaseService
  ) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            getSubscriberByChannelId(channel_id: ${this.creator.id}) {
              id
            }
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        let count = result.data.getSubscriberByChannelId;
        this.subscribers_count = count.length;
      });
    // if (this.creator.subscriber > 1000000000) {
    //   this.fmtSubs =
    //     Math.floor(this.creator.subscriber / 1000000000).toString() + 'B';
    // } else if (this.creator.subscriber > 1000000) {
    //   this.fmtSubs =
    //     Math.floor(this.creator.subscriber / 1000000).toString() + 'M';
    // } else if (this.creator.subscriber > 1000) {
    //   this.fmtSubs =
    //     Math.floor(this.creator.subscriber / 1000).toString() + 'K';
    // } else {
    //   this.fmtSubs = this.creator.subscriber.toString();
    // }

    if (this.creator.description.length > 200) {
      this.fmtDescription = this.creator.description.substring(0, 200) + '...';
    } else {
      this.fmtDescription = this.creator.description;
    }
    for (let i of this.ss.creator_subscribers) {
      if (this.creator.id == i) {
        this.btnSubs = false;
      }
    }
  }

  goChannel() {
    this.router.navigateByUrl('channel/' + this.creator.id);
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
            channel_id: this.creator.id,
            creator_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getSubscriberByChannelId(channel_id: ${this.creator.id}) {
                  id
                }
              }`,
            },
          ],
        })
        .subscribe((result) => {});
      this.ss.creator_subscribers.push(this.creator.id);
      this.apollo
        .watchQuery<any>({
          query: gql`query{
              getCreatorById(id:${this.creator.id}){
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
            channel_id: this.creator.id,
            creator_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getSubscriberByChannelId(channel_id: ${this.creator.id}) {
                  id
                }
              }`,
            },
          ],
        })
        .subscribe((result) => {});
      let oldSubs = this.ss.creator_subscribers;
      let remove = this.creator.id;
      let newSubs = oldSubs.filter((item) => item !== remove);
      this.ss.creator_subscribers = newSubs;

      let newChannelSubs = [];
      for (let i = 0; i < this.db.channelSubs.length; i++) {
        const element = this.db.channelSubs[i];
        if (this.creator.id != element.id) {
          newChannelSubs.push(element);
        }
      }
      this.db.channelSubs = newChannelSubs;
      this.db.channelSubs.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.db.modalWantLog = true;
    }
  }
}
