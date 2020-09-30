import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  isLogged = false;
  creator_id = null;
  creator_name = null;
  creator_icon = null;
  creator_banner = null;
  creator_membership = 1;
  creator_subscriber = null;
  creator_restricted = 1;
  creator_subscribers = [];
  queue = [];
  constructor() {}

  disconnectSS() {
    this.isLogged = false;
    this.creator_id = null;
    this.creator_name = null;
    this.creator_icon = null;
    this.creator_banner = null;
    this.creator_membership = 1;
    this.creator_subscriber = null;
    this.creator_restricted = 1;
    this.creator_subscribers = [];
    this.queue = [];
  }
}
