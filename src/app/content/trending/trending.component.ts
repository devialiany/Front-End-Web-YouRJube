import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { SessionService } from '../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
})
export class TrendingComponent implements OnInit {
  videos = [];
  week = [];
  today: Date;
  // gabung=[];

  constructor(
    private apollo: Apollo,
    public db: DatabaseService,
    public ss: SessionService
  ) {
    // this.today = new Date();
  }

  ngOnInit(): void {
    for (let i = 0; i < 7; i++) {
      this.today = new Date(Date.now() - 1000 * 60 * 60 * 24 * i);
      let date = this.today.getDate();
      let month = this.today.getMonth() + 1;
      let year = this.today.getFullYear();
      let fDate = date + '-' + month + '-' + year;
      this.week.push(fDate);
    }
    this.apollo
      .watchQuery<any>({
        query: gql`
          query(
            $d1: String!
            $d2: String!
            $d3: String!
            $d4: String!
            $d5: String!
            $d6: String!
            $d7: String!
          ) {
            getTrendingVideos(
              d1: $d1
              d2: $d2
              d3: $d3
              d4: $d4
              d5: $d5
              d6: $d6
              d7: $d7
            ) {
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
          d1: this.week[0],
          d2: this.week[1],
          d3: this.week[2],
          d4: this.week[3],
          d5: this.week[4],
          d6: this.week[5],
          d7: this.week[6],
        },
      })
      .valueChanges.subscribe((result) => {
        // console.log(result.data.getTrendingVideos);
        for (let i of result.data.getTrendingVideos) {
          if (i.viewer != 0) {
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
        }
      });
  }
}
