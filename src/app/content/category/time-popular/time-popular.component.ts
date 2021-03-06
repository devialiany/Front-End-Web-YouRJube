import { Component, OnInit, Input } from '@angular/core';
import { SessionService } from '../../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-time-popular',
  templateUrl: './time-popular.component.html',
  styleUrls: ['./time-popular.component.scss'],
})
export class TimePopularComponent implements OnInit {
  @Input('id') id: number;
  videos = [];
  constructor(private apollo: Apollo, private ss: SessionService) {}

  ngOnInit(): void {
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
        for (let i of result.data.getVideoByCategoryId) {
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
      });
  }
}
