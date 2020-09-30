import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlistside',
  templateUrl: './playlistside.component.html',
  styleUrls: ['./playlistside.component.scss'],
})
export class PlaylistsideComponent implements OnInit {
  @Input('pl') playlist: {
    id: number;
    title: string;
    photo_thumbnail: string;
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goPlaylist() {
    this.router.navigateByUrl('playlist/' + this.playlist.id);
  }
}
