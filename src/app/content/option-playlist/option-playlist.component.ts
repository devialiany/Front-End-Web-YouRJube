import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from './../../service/database.service';

@Component({
  selector: 'app-option-playlist',
  templateUrl: './option-playlist.component.html',
  styleUrls: ['./option-playlist.component.scss'],
})
export class OptionPlaylistComponent implements OnInit {
  @Input('optPl') playlist: {
    id: number;
    title: string;
  };
  constructor(private db: DatabaseService) {}

  ngOnInit(): void {}

  goChoose() {
    this.db.idPlaylist = this.playlist.id;
    console.log(this.db.idPlaylist);
  }
}
