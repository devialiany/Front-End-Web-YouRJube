import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from './../../../service/database.service';
import { SessionService } from './../../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-video-channel',
  templateUrl: './video-channel.component.html',
  styleUrls: ['./video-channel.component.scss'],
})
export class VideoChannelComponent implements OnInit {
  videos = [];
  creator = [];
  temp = [];
  lastKey = 0;
  observer: any;

  ba = true;
  bm = false;
  bo = false;
  bn = false;
  constructor(
    private db: DatabaseService,
    private apollo: Apollo,
    private ss: SessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
    this.getDataVideo();
  }

  getDataVideo() {
    if (this.ss.creator_id == this.db.idChannelR) {
      this.apollo
        .watchQuery<any>({
          query: gql`
        query{
          getCreatorById(id:${this.db.idChannelR}){
            videos{
              id
              title
              photo_thumbnail
              date_upload
              duration
              viewer
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
          console.log(this.creator);
          this.creator.forEach((element: { videos: [] }) => {
            this.videos = element.videos;
            console.log(this.videos);
          });
        });
    } else {
      this.apollo
        .watchQuery<any>({
          query: gql`
        query{
          getCreatorById(id:${this.db.idChannelR}){
            videos{
              id
              title
              photo_thumbnail
              date_upload
              duration
              viewer
              privacy
              restricted
              premium
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
          this.creator.forEach((element: { videos: [] }) => {
            this.temp = element.videos;
            for (let i of this.temp) {
              if (i.privacy == 2) {
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
        });
    }
  }
  sortAll() {
    this.videos = [];
    this.ba = true;
    this.bm = false;
    this.bo = false;
    this.bn = false;
    this.getDataVideo();
  }

  sortMostPop() {
    this.ba = false;
    this.bm = true;
    this.bo = false;
    this.bn = false;
    this.videos.sort((a, b) => {
      return b.viewer - a.viewer;
    });
  }

  sortOldest() {
    this.ba = false;
    this.bm = false;
    this.bo = true;
    this.bn = false;
    this.videos.sort((a, b) => a.date_upload.localeCompare(b.date_upload));
  }

  sortNewest() {
    this.ba = false;
    this.bm = false;
    this.bo = false;
    this.bn = true;
    this.videos.sort((a, b) => b.date_upload.localeCompare(a.date_upload));
  }
}
