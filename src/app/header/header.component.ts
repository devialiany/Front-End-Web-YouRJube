import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { SessionService } from './../service/session.service';
import { DatabaseService } from './../service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() sideBar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalLogin: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalKeyboard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalConfirmSwitch: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  loggedIn: boolean;

  // keyword: String;

  dpU: boolean = false;
  dpS: boolean = false;
  dpN: boolean = false;

  rMode: string = 'Off';
  today: string;
  user: SocialUser;
  creator = [];
  channels = [];

  idP = [];

  //notif
  notifV = [];
  notifP = [];

  //autocomplete
  dataSearch = [];
  allData = [];

  constructor(
    private router: Router,
    private authService: SocialAuthService,
    public ss: SessionService,
    public db: DatabaseService,
    private apollo: Apollo
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.today = new Date().toLocaleDateString();
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      this.ss.isLogged = this.loggedIn;
      if (this.loggedIn == true) {
        console.log(this.user);
        this.checkCreatorAccount(this.user.email);
        this.router.navigateByUrl('/home');
      }
    });
    console.log('PASSED');
  }

  showHideSideBar() {
    this.sideBar.emit();
  }

  searching() {
    if (this.db.keyword != null) {
      this.router.navigateByUrl('/search/' + this.db.keyword);
      this.db.autoComplete = false;
    }
  }

  showModalLogin() {
    this.modalLogin.emit();
    this.dpU = false;
  }

  showDropdownUser() {
    if (this.dpU == false) {
      this.dpU = true;
      this.dpN = false;
    } else {
      this.dpU = false;
    }
  }

  showDropdownSetting() {
    if (this.dpS == false) {
      this.dpS = true;
    } else {
      this.dpS = false;
    }
  }

  showDropdownNotification() {
    if (this.dpN == false) {
      this.dpN = true;
      this.dpU = false;
    } else {
      this.dpN = false;
    }
  }

  doChangeRMode() {
    if (this.rMode == 'Off') {
      this.rMode = 'On';
      this.ss.creator_restricted = 2;
      this.router.navigateByUrl('/home');
    } else {
      this.rMode = 'Off';
      this.ss.creator_restricted = 1;
      this.router.navigateByUrl('/home');
    }
  }

  showModalLocation() {
    this.db.modalLocation = true;
    this.dpS = false;
    this.dpU = false;
  }

  showModalKeyboard() {
    this.modalKeyboard.emit();
    this.dpS = false;
    this.dpU = false;
  }

  goMembershipPage() {
    this.router.navigateByUrl('/membership');
    this.dpU = false;
  }

  showModalConfirm() {
    this.modalConfirmSwitch.emit();
    this.dpU = false;
  }

  signOut() {
    this.authService.signOut();
    this.ss.disconnectSS();
    this.db.disconnectDB();
    this.router.navigateByUrl('/home');
  }

  goToMyChannel() {
    this.router.navigateByUrl('channel/' + this.ss.creator_id);
    this.dpU = false;
  }

  checkCreatorAccount(email: string) {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($email: String!) {
            getCreator(email: $email) {
              id
              name
              photo_profile
              photo_background
              membership_status
              subscriber
              restricted
            }
          }
        `,
        variables: { email: email },
      })
      .valueChanges.subscribe((result) => {
        this.creator = result.data.getCreator;
        this.creator.forEach((element) => {
          this.ss.creator_id = element.id;
          this.ss.creator_name = element.name;
          this.ss.creator_icon = element.photo_profile;
          this.ss.creator_banner = element.photo_background;
          this.ss.creator_membership = element.membership_status;
          this.ss.creator_subscriber = element.subscriber;
          // this.ss.creator_restricted = element.restricted;
          this.getUserSubscriber();
          this.getUserPlaylist();
          this.getPlaylistCreatorMade();
          this.getUserNotification();
        });
      });
  }

  getUserSubscriber() {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query($creator_id: Int!) {
            getSubscriberByCreatorId(creator_id: $creator_id) {
              creator {
                id
              }
            }
          }
        `,
        variables: { creator_id: this.ss.creator_id },
      })
      .valueChanges.subscribe((result) => {
        this.channels = result.data.getSubscriberByCreatorId;
        for (let i of this.channels) {
          this.ss.creator_subscribers.push(i.creator.id);
        }
        for (let a = 0; a < this.ss.creator_subscribers.length; a++) {
          this.apollo
            .watchQuery<any>({
              query: gql`query{
            getCreatorById(id:${this.ss.creator_subscribers[a]}){
              id
              name
              photo_profile
            }
          }`,
            })
            .valueChanges.subscribe((result) => {
              let c = result.data.getCreatorById;
              for (let b of c) {
                this.db.channelSubs.push(b);
                this.db.channelSubs.sort((a, b) =>
                  a.name.localeCompare(b.name)
                );
              }
            });
        }
      });
  }

  getUserPlaylist() {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            getUserPlaylistByCreatorId(creator_id: ${this.ss.creator_id}) {
              playlist_id
            }
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        // console.log(result.data.getUserPlaylistByCreatorId);
        let plId = [];
        for (let i of result.data.getUserPlaylistByCreatorId) {
          plId.push(i.playlist_id);
        }
        for (let a = 0; a < plId.length; a++) {
          this.apollo
            .watchQuery<any>({
              query: gql`
                query {
                  getPlaylistById(id: ${plId[a]}) {
                    id
                    title
                    type
                    creator{
                      id
                    }
                  }
                }
              `,
            })
            .valueChanges.subscribe((result) => {
              for (let i of result.data.getPlaylistById) {
                this.db.playlists.push(i);
                this.db.playlists.sort((a, b) => {
                  return a.type - b.type;
                });
              }
            });
        }
      });
  }

  getPlaylistCreatorMade() {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query getPlaylist {
            getPlaylistByCreatorId(creator_id: ${this.ss.creator_id}) {
              id
              title
            }
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        this.db.userPlaylist = result.data.getPlaylistByCreatorId;
      });
  }

  getUserNotification() {
    this.notifV = [];
    this.notifP = [];
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            getNotifVideoByCreatorId(creator_id: ${this.ss.creator_id}) {
              video {
                id
                title
                photo_thumbnail
                creator {
                  id
                  name
                }
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.getNotifVideoByCreatorId) {
          this.notifV.push(i.video);
        }
      });
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            getNotifPostByCreatorId(creator_id: ${this.ss.creator_id}) {
              community {
                title
                creator {
                  id
                  name
                }
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        for (let i of result.data.getNotifPostByCreatorId) {
          this.notifP.push(i.community);
        }
      });
  }

  deletekeys() {
    document.onkeydown = function (event) {};
  }
  // checkCreatorAccount2(email:string){
  //   this.apollo.watchQuery<any>({
  //     query: gql `query($email: String!){
  //       getCreator(email: $email){
  //         id
  //         name
  //         photo_profile
  //         photo_background
  //         membership_status
  //         subscriber
  //       }
  //     }`,
  //     variables:{email: email},
  //   }).valueChanges.subscribe((result) => {
  //     this.creator = result.data.getCreator;
  //     console.log()
  //       this.creator.forEach((element) => {
  //         this.ss.creator_id = element.id
  //         this.ss.creator_name = element.name
  //         this.ss.creator_icon = element.photo_profile
  //         this.ss.creator_banner = element.photo_background
  //         this.ss.creator_membership = element.membership_status
  //         this.ss.creator_subscriber = element.subscriber
  //       });

  //   });
  // }

  // insertCreator() : void{
  //   this.apollo.mutate({
  //     mutation:gql`
  //     mutation ($name: String!, $email: String!, $join_date: String!, $description: String!, $photo_profile: String!, $photo_background: String!, $membership_status: Int!, $subscriber: Int) {
  //       insertCreator(input: { name: $name, email: $email, join_date: $join_date, description: $description, photo_profile: $photo_profile, photo_background:$photo_background, membership_status: $membership_status, subscriber: $subscriber } ) {
  //         id
  //         name
  //         photo_profile
  //         membership_status
  //       }
  //     }
  //     `,
  //     variables:{
  //       name: this.user.name,
  //       email: this.user.email,
  //       join_date: this.today,
  //       description: "Welcome to My Channel",
  //       photo_profile: this.user.photoUrl,
  //       photo_background: "default",
  //       membership_status: 1,
  //       subscriber: 0
  //     },
  //   }).subscribe()
  // }

  //auto compelete
  auto() {
    this.db.autoComplete = true;
    if (this.db.keyword == '') {
      this.dataSearch = [];
    } else {
      this.dataSearch = [];
      this.apollo
        .watchQuery<any>({
          query: gql`
            query($search: String!) {
              searchingVideo(search: $search) {
                title
                premium
                restricted
              }
            }
          `,
          variables: {
            search: this.db.keyword,
          },
        })
        .valueChanges.subscribe((result) => {
          for (let i of result.data.searchingVideo) {
            //tidak restricted & tidak premium
            if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 1
            ) {
              if (i.premium == 1) {
                this.dataSearch.push(i.title);
              }
              //restricted & tidak premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 1
            ) {
              if (i.restricted == 2 && i.premium == 1) {
                this.dataSearch.push(i.title);
              }
              //tidak restricted & premium
            } else if (
              this.ss.creator_restricted == 1 &&
              this.ss.creator_membership == 2
            ) {
              this.dataSearch.push(i.title);
              //restricted & premium
            } else if (
              this.ss.creator_restricted == 2 &&
              this.ss.creator_membership == 2
            ) {
              if (i.restricted == 2) {
                this.dataSearch.push(i.title);
              }
            }
          }
        });
      this.apollo
        .watchQuery<any>({
          query: gql`
            query($search: String!) {
              searchingPlaylists(search: $search) {
                title
              }
            }
          `,
          variables: {
            search: this.db.keyword,
          },
        })
        .valueChanges.subscribe((result) => {
          for (let i of result.data.searchingPlaylists) {
            this.dataSearch.push(i.title);
          }
        });
      this.apollo
        .watchQuery<any>({
          query: gql`
            query($search: String!) {
              searchingCreator(search: $search) {
                name
              }
            }
          `,
          variables: {
            search: this.db.keyword,
          },
        })
        .valueChanges.subscribe((result) => {
          for (let i of result.data.searchingCreator) {
            this.dataSearch.push(i.name);
          }
        });
    }
  }
}
