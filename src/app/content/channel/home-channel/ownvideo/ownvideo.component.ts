import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from './../../../../service/session.service';
import { DatabaseService } from './../../../../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-ownvideo',
  templateUrl: './ownvideo.component.html',
  styleUrls: ['./ownvideo.component.scss'],
})
export class OwnvideoComponent implements OnInit {
  creator = [];
  temp = [];
  videos = [];
  fil = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private db: DatabaseService,
    private ss: SessionService
  ) {}

  ngOnInit(): void {
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
          this.creator.forEach((element: { videos: [] }) => {
            this.temp = element.videos;
            for (let i = 0; i < 5; i++) {
              if (this.temp.length == 0) {
                break;
              } else {
                let randomIdx = Math.floor(Math.random() * this.temp.length);
                let randomValue = this.temp[randomIdx];
                this.videos.push(randomValue);
                let tempVid = this.temp
                  .slice(0, randomIdx)
                  .concat(this.temp.slice(randomIdx + 1, this.temp.length));
                this.temp = tempVid;
              }
            }
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
            this.fil = element.videos;
            for (let i of this.fil) {
              if (i.privacy == 2) {
                this.temp.push(i);
              }
            }
            for (let i = 0; i < 5; i++) {
              if (this.temp.length == 0) {
                break;
              } else {
                let randomIdx = Math.floor(Math.random() * this.temp.length);
                let randomValue = this.temp[randomIdx];
                this.videos.push(randomValue);
                let tempVid = this.temp
                  .slice(0, randomIdx)
                  .concat(this.temp.slice(randomIdx + 1, this.temp.length));
                this.temp = tempVid;
              }
            }
          });
        });
    }
  }

  goTo() {
    this.router.navigate(['../videochannel'], { relativeTo: this.route });
  }
}
