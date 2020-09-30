import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from './../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-subs-channel',
  templateUrl: './subs-channel.component.html',
  styleUrls: ['./subs-channel.component.scss'],
})
export class SubsChannelComponent implements OnInit {
  // channels = [];
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    setTimeout(() => {
      this.router.navigateByUrl('playlist/' + id);
    }, 1500);
    // this.channels = [];
    // for (let a = 0; a < this.ss.creator_subscribers.length; a++) {
    //   this.apollo
    //     .watchQuery<any>({
    //       query: gql`query{
    //       getCreatorById(id:${this.ss.creator_subscribers[a]}){
    //         id
    //         name
    //         photo_profile
    //         subscriber
    //         description
    //         videos {
    //           id
    //         }
    //       }
    //     }`,
    //     })
    //     .valueChanges.subscribe((result) => {
    //       for (let b of result.data.getCreatorById) {
    //         this.channels.push(b);
    //         this.channels.sort((a, b) => a.name.localeCompare(b.name));
    //       }
    //     });
    // }
  }
}
