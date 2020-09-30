import { Component, OnInit, Input } from '@angular/core';
import { SessionService } from '../../../service/session.service';
import { DatabaseService } from './../../../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input('com') comments: {
    id: number;
    content: string;
    video_id: number;
    date_upload: string;
    creator: {
      name: string;
      photo_profile: string;
    };
  };
  today: string;
  replyInput = false;
  replyToggle = false;
  replySec = false;
  newReply = '';

  replies = [];

  //like-dislike
  likeAct = false;
  like = true;

  unlikeAct = false;
  unlike = true;

  countLike = [];
  countDislike = [];

  constructor(
    private apollo: Apollo,
    public ss: SessionService,
    private db: DatabaseService
  ) {
    this.today = new Date().toLocaleDateString();
  }

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: gql`query{
        getReplyById(id: ${this.comments.id}){
          id
          content
          date_upload
          creator{
            id
            name
            photo_profile
          }
        }
      }`,
      })
      .valueChanges.subscribe((result) => {
        this.replies = result.data.getReplyById;
        if (this.replies.length != 0) {
          this.replyToggle = true;
          this.replySec = true;
        }
      });

    //like-dislike
    if (this.ss.isLogged == true) {
      this.apollo
        .watchQuery<any>({
          query: gql`
            query fbCom {
              getFeedbackCommentByCommentId(comment_id: ${this.comments.id}) {
                status
                liker_id
              }
            }
          `,
        })
        .valueChanges.subscribe((result) => {
          for (let i of result.data.getFeedbackCommentByCommentId) {
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
        getFeedbackCommentByCommentId(comment_id: ${this.comments.id}) {
          status
        }
      }
    `,
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.getFeedbackCommentByCommentId) {
          if (i.status == true) {
            this.countLike.push(i.status);
          } else if (i.status == false) {
            this.countDislike.push(i.status);
          }
        }
      });
  }

  showHideReplyInput() {
    if (this.replyInput == false) {
      this.replyInput = true;
    } else {
      this.replyInput = false;
    }
  }

  addReply() {
    if (this.newReply == '') {
      alert('The reply is empty :)');
    } else {
      this.insertReply();
      this.newReply = '';
      alert('Insert reply success :)');
    }
  }

  insertReply() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation(
            $content: String!
            $date_upload: String!
            $comment_id: Int!
            $creator_id: Int!
          ) {
            insertReply(
              input: {
                content: $content
                date_upload: $date_upload
                comment_id: $comment_id
                creator_id: $creator_id
              }
            ) {
              id
            }
          }
        `,
        variables: {
          content: this.newReply,
          date_upload: this.today,
          comment_id: this.comments.id,
          creator_id: this.ss.creator_id,
        },
        refetchQueries: [
          {
            query: gql`query{
          getReplyById(id: ${this.comments.id}){
            id
            content
            date_upload
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

  showHideListReply() {
    if (this.replySec == false) {
      this.replySec = true;
    } else {
      this.replySec = false;
    }
  }

  deletekeys() {
    document.onkeydown = function (event) {};
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
              mutation($comment_id: Int!, $liker_id: Int!, $status: Boolean!) {
                updateLikeComment(
                  comment_id: $comment_id
                  liker_id: $liker_id
                  input: { status: $status }
                ) {
                  status
                }
              }
            `,
            variables: {
              comment_id: this.comments.id,
              liker_id: this.ss.creator_id,
              status: true,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackCommentByCommentId(comment_id: ${this.comments.id}) {
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
              mutation($comment_id: Int!, $liker_id: Int!, $status: Boolean!) {
                insertLikeComment(
                  input: {
                    comment_id: $comment_id
                    liker_id: $liker_id
                    status: $status
                  }
                ) {
                  status
                }
              }
            `,
            variables: {
              comment_id: this.comments.id,
              liker_id: this.ss.creator_id,
              status: true,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackCommentByCommentId(comment_id: ${this.comments.id}) {
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
            mutation($comment_id: Int!, $liker_id: Int!) {
              deleteLikeComment(comment_id: $comment_id, liker_id: $liker_id)
            }
          `,
          variables: {
            comment_id: this.comments.id,
            liker_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getFeedbackCommentByCommentId(comment_id: ${this.comments.id}) {
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
              mutation($comment_id: Int!, $liker_id: Int!, $status: Boolean!) {
                updateLikeComment(
                  comment_id: $comment_id
                  liker_id: $liker_id
                  input: { status: $status }
                ) {
                  status
                }
              }
            `,
            variables: {
              comment_id: this.comments.id,
              liker_id: this.ss.creator_id,
              status: false,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackCommentByCommentId(comment_id: ${this.comments.id}) {
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
              mutation($comment_id: Int!, $liker_id: Int!, $status: Boolean!) {
                insertLikeComment(
                  input: {
                    comment_id: $comment_id
                    liker_id: $liker_id
                    status: $status
                  }
                ) {
                  status
                }
              }
            `,
            variables: {
              comment_id: this.comments.id,
              liker_id: this.ss.creator_id,
              status: false,
            },
            refetchQueries: [
              {
                query: gql`query {
                getFeedbackCommentByCommentId(comment_id: ${this.comments.id}) {
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
            mutation($comment_id: Int!, $liker_id: Int!) {
              deleteLikeComment(comment_id: $comment_id, liker_id: $liker_id)
            }
          `,
          variables: {
            comment_id: this.comments.id,
            liker_id: this.ss.creator_id,
          },
          refetchQueries: [
            {
              query: gql`query {
                getFeedbackCommentByCommentId(comment_id: ${this.comments.id}) {
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
