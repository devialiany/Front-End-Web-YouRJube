import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { SessionService } from '../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  videos = [];
  temp = [];
  lastKey = 0;
  observer: any;

  constructor(
    private apollo: Apollo,
    public db: DatabaseService,
    public ss: SessionService
  ) {}

  ngOnInit(): void {
    this.lastKey = 12;
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
    this.apollo
      .watchQuery<any>({
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
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.getHomeVideo) {
          //tidak restricted & tidak premium
          if (
            this.ss.creator_restricted == 1 &&
            this.ss.creator_membership == 1
          ) {
            if (i.premium == 1) {
              this.temp.push(i);
            }
            //restricted & tidak premium
          } else if (
            this.ss.creator_restricted == 2 &&
            this.ss.creator_membership == 1
          ) {
            if (i.restricted == 2 && i.premium == 1) {
              this.temp.push(i);
            }
            //tidak restricted & premium
          } else if (
            this.ss.creator_restricted == 1 &&
            this.ss.creator_membership == 2
          ) {
            this.temp.push(i);
            //restricted & premium
          } else if (
            this.ss.creator_restricted == 2 &&
            this.ss.creator_membership == 2
          ) {
            if (i.restricted == 2) {
              this.temp.push(i);
            }
          }
        }
        let filterLoc = [];
        let amount = this.temp.length;
        for (let i = 0; i < amount; i++) {
          let randomIdx = Math.floor(Math.random() * this.temp.length);
          let randomValue = this.temp[randomIdx];
          filterLoc.push(randomValue);
          let tempVid = this.temp
            .slice(0, randomIdx)
            .concat(this.temp.slice(randomIdx + 1, this.temp.length));
          this.temp = tempVid;
        }
        for (let i of filterLoc) {
          if (i.location == this.db.currentLoc) {
            this.videos.push(i);
            console.log(i.location);
          }
        }
        for (let i of filterLoc) {
          if (i.location != this.db.currentLoc) {
            this.videos.push(i);
          }
        }
      });
  }
}
