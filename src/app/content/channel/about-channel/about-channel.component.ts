import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-about-channel',
  templateUrl: './about-channel.component.html',
  styleUrls: ['./about-channel.component.scss'],
})
export class AboutChannelComponent implements OnInit {
  id: string;
  creator = [];
  description: string;
  join_date: string;
  views: string;
  link: string;
  constructor(private apollo: Apollo, public db: DatabaseService) {}

  ngOnInit(): void {
    this.id = this.db.idChannelR;
    this.apollo
      .watchQuery<any>({
        query: gql`
      query{
        getCreatorById(id: ${this.id}){
          description
          join_date
          link
          videos{
            viewer
          }
        }
      }`,
      })
      .valueChanges.subscribe((result) => {
        this.creator = result.data.getCreatorById;
        let video: any;
        for (let i of result.data.getCreatorById) {
          video = i.videos;
          console.log(video);
        }
        let view = [];
        for (let i of video) {
          view.push(i.viewer);
        }
        let sum: number = 0;
        for (let a = 0; a < view.length; a++) {
          sum = sum + view[a];
        }
        if (sum > 1000000000) {
          this.views = Math.floor(sum / 1000000000).toString() + 'B';
        } else if (sum > 1000000) {
          this.views = Math.floor(sum / 1000000).toString() + 'M';
        } else if (sum > 1000) {
          this.views = Math.floor(sum / 1000).toString() + 'K';
        } else {
          this.views = sum.toString();
        }
        console.log(this.creator);
        this.creator.forEach((element) => {
          this.description = element.description;
          this.join_date = element.join_date;
          this.link = element.link;
        });
      });
  }

  goShare() {
    let post =
      'https://twitter.com/intent/tweet?text=' +
      'http://localhost:4200/channel/' +
      this.db.idChannelR +
      '/homechannel';
    window.open(post, '_blank');
    console.log();
  }

  goTwitter() {
    window.open(this.link, '_blank');
  }
}
