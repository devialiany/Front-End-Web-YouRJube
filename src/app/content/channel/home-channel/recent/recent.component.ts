import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from './../../../../service/session.service';
import { DatabaseService } from './../../../../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss']
})
export class RecentComponent implements OnInit {
  creator:any;
  temp=[];
  videos=[];
  constructor(private router: Router, private route: ActivatedRoute, private apollo: Apollo, private db: DatabaseService, private ss: SessionService) { }

  ngOnInit(): void {
    let today = new Date().toLocaleDateString()
    if(this.ss.creator_id == this.db.idChannelR){
      this.apollo.watchQuery<any>({
        query: gql `
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
      }).valueChanges.subscribe(result => {
        this.creator = result.data.getCreatorById
        console.log(this.creator)
        this.creator.forEach((element: { videos: []; }) => {
          this.temp = element.videos
          console.log(this.temp)
          for (let i of this.temp){
            let date = new Date(i.date_upload).toLocaleDateString()
            if(date == today){
              this.videos.push(i);
            }
          }
        });
      });
    }else{
      this.apollo.watchQuery<any>({
        query: gql `
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
      }).valueChanges.subscribe(result => {
        this.creator = result.data.getCreatorById
        this.creator.forEach((element: { videos: []; }) => {
          this.temp = element.videos
          for (let i of this.temp){
            let date = new Date(i.date_upload).toLocaleDateString()
            if(date == today && i.privacy == 2){
              this.videos.push(i);
            }
          }
        });
      });
    }
  }

  goTo(){
    this.router.navigate(['../videochannel'], {relativeTo: this.route});
  }
}
