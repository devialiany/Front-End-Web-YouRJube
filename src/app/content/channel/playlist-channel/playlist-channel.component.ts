import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DatabaseService } from './../../../service/database.service';
import { SessionService } from './../../../service/session.service';
import gql from 'graphql-tag';
@Component({
  selector: 'app-playlist-channel',
  templateUrl: './playlist-channel.component.html',
  styleUrls: ['./playlist-channel.component.scss'],
})
export class PlaylistChannelComponent implements OnInit {
  playlists = [];
  constructor(
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
          this.playlists = result.data.getPlaylistByCreatorId;
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
              this.playlists.push(i);
            }
          }
        });
    }
  }
}
