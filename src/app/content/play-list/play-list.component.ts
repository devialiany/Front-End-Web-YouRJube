import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.scss'],
})
export class PlayListComponent implements OnInit {
  @Input('playlist') playlist: {
    id: number;
    title: string;
  };
  video_length = 0;
  photo_thumbnail: string =
    'https://firebasestorage.googleapis.com/v0/b/yourjube1701.appspot.com/o/thumbnail%2Fno%20image.png?alt=media&token=e3e5fde0-6e36-41e8-b1c4-d196efa2da9b';
  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query detail {
            getPlaylistdetailsById(id: ${this.playlist.id}) {
              video {
                photo_thumbnail
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        let videos = result.data.getPlaylistdetailsById;
        this.video_length = videos.length;
        if (videos.length != 0) {
          this.photo_thumbnail = videos[0].video.photo_thumbnail;
        }
      });
  }

  goPlaylist() {
    this.router.navigateByUrl('playlist/' + this.playlist.id);
  }
}
