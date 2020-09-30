import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  videos = [];
  creator = [];
  constructor(private apollo: Apollo, public ss: SessionService) {}

  ngOnInit(): void {}
}
