import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  @Input('playlist') playlist: {
    id: number;
    title: string;
    description: string;
    creator: {
      id: number;
      name: string;
    };
  };
  idVideoOne: number;
  photo_thumbnail: string =
    'https://firebasestorage.googleapis.com/v0/b/yourjube1701.appspot.com/o/thumbnail%2Fno%20image.png?alt=media&token=e3e5fde0-6e36-41e8-b1c4-d196efa2da9b';
  fmtDescription: string;
  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query detail {
            getPlaylistdetailsById(id: ${this.playlist.id}) {
              video {
                id
                photo_thumbnail
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        let videos = result.data.getPlaylistdetailsById;
        if (videos.length != 0) {
          this.photo_thumbnail = videos[0].video.photo_thumbnail;
          this.idVideoOne = videos[0].video.id;
        }
      });
    if (this.playlist.description.length > 40) {
      this.fmtDescription = this.playlist.description.substring(0, 40) + '...';
    } else {
      this.fmtDescription = this.playlist.description;
    }
  }

  goPlaylist() {
    this.router.navigateByUrl('playlist/' + this.playlist.id);
  }

  goChannel() {
    this.router.navigateByUrl('channel/' + this.playlist.creator.id);
  }

  playAll() {
    this.router.navigateByUrl(
      'watch/' + this.idVideoOne + '/playlist/' + this.playlist.id
    );
  }
}
