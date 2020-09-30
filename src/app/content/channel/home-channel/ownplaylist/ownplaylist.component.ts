import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { DatabaseService } from './../../../../service/database.service';
import { SessionService } from './../../../../service/session.service';
import gql from 'graphql-tag';
@Component({
  selector: 'app-ownplaylist',
  templateUrl: './ownplaylist.component.html',
  styleUrls: ['./ownplaylist.component.scss'],
})
export class OwnplaylistComponent implements OnInit {
  playlists = [];
  temp = [];
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
          query {
            getPlaylistByCreatorId(creator_id: ${this.db.idChannelR}) {
              id
              title
              type
            }
          }
        `,
        })
        .valueChanges.subscribe((result) => {
          this.temp = result.data.getPlaylistByCreatorId;
          for (let i = 0; i < 3; i++) {
            if (this.temp.length == 0) {
              break;
            } else {
              let randomIdx = Math.floor(Math.random() * this.temp.length);
              let randomValue = this.temp[randomIdx];
              this.playlists.push(randomValue);
              let tempVid = this.temp
                .slice(0, randomIdx)
                .concat(this.temp.slice(randomIdx + 1, this.temp.length));
              this.temp = tempVid;
            }
          }
          console.log(this.playlists);
        });
    } else {
      this.apollo
        .watchQuery<any>({
          query: gql`
          query {
            getPlaylistByCreatorId(creator_id: ${this.db.idChannelR}) {
              id
              title
              type
            }
          }
        `,
        })
        .valueChanges.subscribe((result) => {
          for (let i of result.data.getPlaylistByCreatorId) {
            if (i.type == 2) {
              this.temp.push(i);
            }
          }
          for (let i = 0; i < 3; i++) {
            if (this.temp.length == 0) {
              break;
            } else {
              let randomIdx = Math.floor(Math.random() * this.temp.length);
              let randomValue = this.temp[randomIdx];
              this.playlists.push(randomValue);
              let tempVid = this.temp
                .slice(0, randomIdx)
                .concat(this.temp.slice(randomIdx + 1, this.temp.length));
              this.temp = tempVid;
            }
          }
        });
    }
  }

  goTo() {
    this.router.navigate(['../playlistchannel'], { relativeTo: this.route });
  }
}
