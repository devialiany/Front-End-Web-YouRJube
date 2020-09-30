import { Component, OnInit, Input } from '@angular/core';
import { SessionService } from '../../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-week-pupular',
  templateUrl: './week-pupular.component.html',
  styleUrls: ['./week-pupular.component.scss'],
})
export class WeekPupularComponent implements OnInit {
  @Input('id') id: number;
  videos = [];
  week = [];
  today: string;
  constructor(private apollo: Apollo, private ss: SessionService) {}

  ngOnInit(): void {
    for (let i = 0; i < 7; i++) {
      this.today = new Date(
        Date.now() - 1000 * 60 * 60 * 24 * i
      ).toLocaleDateString();
      this.week.push(this.today);
    }
    this.apollo
      .watchQuery<any>({
        query: gql`
      query{
        getVideoByCategoryId(categoryId: ${this.id}){
          id
          title
          photo_thumbnail
          date_upload
          duration
          viewer
          premium
          restricted
          creator{
            id
            name
          }
        }
      }`,
      })
      .valueChanges.subscribe((result) => {
        // this.videos = result.data.getVideoByCategoryId;
        for (let i of result.data.getVideoByCategoryId) {
          let date = new Date(i.date_upload).toLocaleDateString();
          // console.log(date)
          // console.log(this.today)
          if (
            date == this.week[0] ||
            date == this.week[1] ||
            date == this.week[2] ||
            date == this.week[3] ||
            date == this.week[4] ||
            date == this.week[5] ||
            date == this.week[6]
          ) {
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
