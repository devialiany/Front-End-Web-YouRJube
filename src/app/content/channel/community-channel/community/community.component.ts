import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DatabaseService } from './../../../../service/database.service';
import { SessionService } from './../../../../service/session.service';
import gql from 'graphql-tag';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit {
  @Input('community') community: {
    id: number;
    title: string;
    description: string;
    post_image: string;
    date: string;
  };

  likeAct = false;
  like = true;

  unlikeAct = false;
  unlike = true;

  countLike = [];
  countDislike = [];

  fmtDate: string;
  constructor(
    private apollo: Apollo,
    private db: DatabaseService,
    private ss: SessionService
  ) {}

  ngOnInit(): void {
    this.fmtDate = new Date(this.community.date).toDateString();
    if (this.ss.isLogged == true) {
      this.apollo
        .watchQuery<any>({
          query: gql`
          query fbCom {
            getFeedbackCommunityByCommunityId(community_id: ${this.community.id}) {
              status
              liker_id
            }
          }
        `,
        })
        .valueChanges.subscribe((result) => {
          for (let i of result.data.getFeedbackCommunityByCommunityId) {
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
  }

  getCount() {
    this.apollo
      .watchQuery<any>({
        query: gql`
      query fbCom {
        getFeedbackCommunityByCommunityId(community_id: ${this.community.id}) {
          status
        }
      }
    `,
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.getFeedbackCommunityByCommunityId) {
          if (i.status == true) {
            this.countLike.push(i.status);
          } else if (i.status == false) {
            this.countDislike.push(i.status);
          }
        }
      });
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
              mutation(
                $community_id: Int!
                $liker_id: Int!
                $status: Boolean!
              ) {
                updateLikeCommunity(
                  community_id: $community_id
                  liker_id: $liker_id
                  input: { status: $status }
                ) {
                  status
                }
              }
            `,
            variables: {
              community_id: this.community.id,
              liker_id: this.ss.creator_id,
              status: true,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackCommunityByCommunityId(community_id: ${this.community.id}) {
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
              mutation(
                $community_id: Int!
                $liker_id: Int!
                $status: Boolean!
              ) {
                insertLikeCommunity(
                  input: {
                    community_id: $community_id
                    liker_id: $liker_id
                    status: $status
                  }
                ) {
                  status
                }
              }
            `,
            variables: {
              community_id: this.community.id,
              liker_id: this.ss.creator_id,
              status: true,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackCommunityByCommunityId(community_id: ${this.community.id}) {
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
            mutation($community_id: Int!, $liker_id: Int!) {
              deleteLikeCommunity(
                community_id: $community_id
                liker_id: $liker_id
              )
            }
          `,
          variables: {
            community_id: this.community.id,
            liker_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getFeedbackCommunityByCommunityId(community_id: ${this.community.id}) {
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
              mutation(
                $community_id: Int!
                $liker_id: Int!
                $status: Boolean!
              ) {
                updateLikeCommunity(
                  community_id: $community_id
                  liker_id: $liker_id
                  input: { status: $status }
                ) {
                  status
                }
              }
            `,
            variables: {
              community_id: this.community.id,
              liker_id: this.ss.creator_id,
              status: false,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackCommunityByCommunityId(community_id: ${this.community.id}) {
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
              mutation(
                $community_id: Int!
                $liker_id: Int!
                $status: Boolean!
              ) {
                insertLikeCommunity(
                  input: {
                    community_id: $community_id
                    liker_id: $liker_id
                    status: $status
                  }
                ) {
                  status
                }
              }
            `,
            variables: {
              community_id: this.community.id,
              liker_id: this.ss.creator_id,
              status: false,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackCommunityByCommunityId(community_id: ${this.community.id}) {
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
            mutation($community_id: Int!, $liker_id: Int!) {
              deleteLikeCommunity(
                community_id: $community_id
                liker_id: $liker_id
              )
            }
          `,
          variables: {
            community_id: this.community.id,
            liker_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getFeedbackCommunityByCommunityId(community_id: ${this.community.id}) {
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
}
