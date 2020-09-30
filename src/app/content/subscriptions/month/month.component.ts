import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
})
export class MonthComponent implements OnInit {
  videos = [];
  creator = [];
  lastKey = 0;
  observer: any;
  constructor(private apollo: Apollo, public ss: SessionService) {}

  ngOnInit(): void {
    this.lastKey = 4;
    this.observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        let main = document.querySelector('.content');
        for (let i = 0; i < 4; i++) {
          if (this.lastKey < this.videos.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-video');
            video.setAttribute('vid', 'this.videos[this.lastKey]');
            div.appendChild(video);
            main.appendChild(div);
            this.lastKey++;
          }
        }
      }
    });
    this.observer.observe(document.querySelector('.footer'));
    for (let a = 0; a < this.ss.creator_subscribers.length; a++) {
      this.apollo
        .watchQuery<any>({
          query: gql`
        query{
          getCreatorById(id:${this.ss.creator_subscribers[a]}){
            videos{
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
          }
        }`,
        })
        .valueChanges.subscribe((result) => {
          this.creator = result.data.getCreatorById;
          for (let i of this.creator) {
            for (let k = 0; k < i.videos.length; k++) {
              let todayM = new Date().getMonth();
              let todayY = new Date().getFullYear();
              let dateM = new Date(i.videos[k].date_upload).getMonth();
              let dateY = new Date(i.videos[k].date_upload).getFullYear();
              if (dateM == todayM && dateY == todayY) {
                if (
                  this.ss.creator_restricted == 1 &&
                  this.ss.creator_membership == 1
                ) {
                  if (i.premium == 1) {
                    this.videos.push(i.videos[k]);
                  }
                  //restricted & tidak premium
                } else if (
                  this.ss.creator_restricted == 2 &&
                  this.ss.creator_membership == 1
                ) {
                  if (i.restricted == 2 && i.premium == 1) {
                    this.videos.push(i.videos[k]);
                  }
                  //tidak restricted & premium
                } else if (
                  this.ss.creator_restricted == 1 &&
                  this.ss.creator_membership == 2
                ) {
                  this.videos.push(i.videos[k]);
                  //restricted & premium
                } else if (
                  this.ss.creator_restricted == 2 &&
                  this.ss.creator_membership == 2
                ) {
                  if (i.restricted == 2) {
                    this.videos.push(i.videos[k]);
                  }
                }
              }
            }
          }
        });
    }
  }
}
