import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { SessionService } from './service/session.service';
import { DatabaseService } from './service/database.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  titlePlaylist: string = '';
  sideBar: boolean = true;
  modalLogin: boolean = false;
  modalKeyboard: boolean = false;
  modalConfirmSwitch: boolean = false;
  modalSignIn: boolean = false;

  creator = [];

  insertNewPlaylist: {
    playlist: {
      id: number;
    };
  };

  constructor(
    private authService: SocialAuthService,
    public ss: SessionService,
    public db: DatabaseService,
    private router: Router,
    private apollo: Apollo
  ) {}

  doChange() {
    this.sideBar = !this.sideBar;
  }

  showModalLogin() {
    this.modalLogin = true;
  }

  closeModalLogin() {
    this.modalLogin = false;
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.modalLogin = false;
  }

  signOut() {
    this.authService.signOut();
    this.ss.disconnectSS();
    this.db.disconnectDB();
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.modalConfirmSwitch = false;
  }

  showModalKeyboard() {
    this.modalKeyboard = true;
  }

  closeModalKeyboard() {
    this.modalKeyboard = false;
  }

  showModalConfirmSwitch() {
    this.modalConfirmSwitch = true;
  }
  closeModalConfirmSwicth() {
    this.modalConfirmSwitch = false;
  }

  closeModalWantLog() {
    this.db.modalWantLog = false;
  }

  closeModalSharePlaylist() {
    this.db.modalSharePlaylist = false;
  }

  goCopy() {
    var copy = document.getElementById('sharepl') as HTMLInputElement;
    copy.select();
    copy.setSelectionRange(0, 99999);
    document.execCommand('copy');
  }

  goTwitter() {
    var copy = (document.getElementById('sharepl') as HTMLInputElement).value;
    var post = 'https://twitter.com/intent/tweet?text=' + copy;
    window.open(post, '_blank');
  }

  closeModalShareVideo() {
    this.db.modalShareVideo = false;
  }

  goCopyV() {
    var copy = document.getElementById('sharev') as HTMLInputElement;
    copy.select();
    copy.setSelectionRange(0, 99999);
    document.execCommand('copy');
  }

  goTwitterV() {
    var copy = (document.getElementById('sharev') as HTMLInputElement).value;
    var post = 'https://twitter.com/intent/tweet?text=' + copy;
    window.open(post, '_blank');
  }

  getTime() {
    let vid = document.getElementById('videotag') as HTMLVideoElement;
    let copy = (document.getElementById('sharev') as HTMLInputElement).value;
    let time = '/atTime/' + Math.floor(vid.currentTime);
    let pTime = copy + time;
    (document.getElementById('sharev') as HTMLInputElement).value = pTime;
  }

  closeModalLocation() {
    this.db.modalLocation = false;
  }

  setLocation(loc: string) {
    this.db.currentLoc = loc;
    this.db.modalLocation = false;
    this.router.navigateByUrl('/home');
  }

  closeModalAddPlaylist() {
    this.db.modalAddPlaylist = false;
  }

  closeModalAddNewPlaylist() {
    this.db.modalAddNewPlaylist = false;
  }

  showNewPlaylist() {
    this.db.modalAddNewPlaylist = true;
    this.db.modalAddPlaylist = false;
  }

  cancelAddPlaylist() {
    this.db.modalAddNewPlaylist = false;
    this.db.modalAddPlaylist = true;
  }

  addtoExistingPlaylist() {
    if (this.db.idPlaylist == 0) {
      alert('You not choose the playlist');
    } else {
      this.apollo
        .mutate({
          mutation: gql`
            mutation {
              insertDetailPlaylist(input: { playlist_id: ${this.db.idPlaylist}, video_id: ${this.db.idVideo}}) {
                video_id
              }
            }
          `,
          refetchQueries: [
            {
              query: gql`
              query {
                getPlaylistdetailsById(id: ${this.db.idPlaylist}) {
                video {
                  id
                  title
                  date_upload
                  duration
                  restricted
                  premium
                  viewer
                  photo_thumbnail
                  creator {
                    id
                    name
                  }
                }
              }
            }
            `,
            },
          ],
        })
        .subscribe();
      let today = new Date().toLocaleDateString();
      this.apollo
        .mutate({
          mutation: gql`
          mutation($date: String!) {
            updateEditPlaylist(playlist_id: ${this.db.idPlaylist}, input: { date: $date }) {
              date
            }
          }
        `,
          variables: { date: today },
          refetchQueries: [
            {
              query: gql`
          query playlist {
            getPlaylistById(id: ${this.db.idPlaylist}) {
              id
              title
              description
              date
              viewer
              type
              creator {
                id
                name
                photo_profile
              }
            }
          }
          `,
            },
          ],
        })
        .subscribe();
      this.db.modalAddPlaylist = false;
      this.db.idPlaylist = 0;
      this.db.idVideo = 0;
    }
  }

  addNewPlaylist() {
    if (this.titlePlaylist == '') {
      alert('You not input name of playlist');
    } else {
      let today = new Date().toLocaleDateString();
      this.apollo
        .mutate<any>({
          mutation: gql`
            mutation(
              $title: String!
              $date: String!
              $description: String!
              $viewer: Int!
              $creator_id: Int!
              $type: Int!
            ) {
              insertNewPlaylist(
                input: {
                  title: $title
                  date: $date
                  description: $description
                  viewer: $viewer
                  creator_id: $creator_id
                  type: $type
                }
              ) {
                id
              }
            }
          `,
          variables: {
            title: this.titlePlaylist,
            date: today,
            description: 'Welcome to my playlist!',
            viewer: 0,
            creator_id: this.ss.creator_id,
            type: this.db.type,
          },
          refetchQueries: [
            {
              query: gql`
                query getPlaylist {
                  getPlaylistByCreatorId(creator_id: ${this.ss.creator_id}) {
                    id
                    title
                  }
                }
              `,
            },
          ],
        })
        .subscribe(({ data }) => {
          let id = data.insertNewPlaylist.id;
          this.apollo
            .mutate<any>({
              mutation: gql`mutation {
                    insertUserPlaylist(input: { creator_id: ${this.ss.creator_id}, playlist_id: ${id} }) {
                      creator_id
                    }
                  }`,
            })
            .subscribe((result) => {
              this.apollo
                .watchQuery<any>({
                  query: gql`
                      query {
                        getPlaylistById(id: ${id}) {
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
                  this.db.modalAddNewPlaylist = false;
                  this.db.modalAddPlaylist = true;
                });
            });
        });
    }
  }

  closePlaylistUpload() {
    this.db.modalAddPlaylistUpload = false;
  }

  addNewPlaylistUpload() {
    if (this.titlePlaylist == '') {
      alert('You not input name of playlist');
    } else {
      let today = new Date().toLocaleDateString();
      this.apollo
        .mutate<any>({
          mutation: gql`
            mutation(
              $title: String!
              $date: String!
              $description: String!
              $viewer: Int!
              $creator_id: Int!
              $type: Int!
            ) {
              insertNewPlaylist(
                input: {
                  title: $title
                  date: $date
                  description: $description
                  viewer: $viewer
                  creator_id: $creator_id
                  type: $type
                }
              ) {
                id
              }
            }
          `,
          variables: {
            title: this.titlePlaylist,
            date: today,
            description: 'Welcome to my playlist!',
            viewer: 0,
            creator_id: this.ss.creator_id,
            type: this.db.type,
          },
          refetchQueries: [
            {
              query: gql`
                query getPlaylist {
                  getPlaylistByCreatorId(creator_id: ${this.ss.creator_id}) {
                    id
                    title
                  }
                }
              `,
            },
          ],
        })
        .subscribe(({ data }) => {
          let id = data.insertNewPlaylist.id;
          this.apollo
            .mutate<any>({
              mutation: gql`mutation {
                    insertUserPlaylist(input: { creator_id: ${this.ss.creator_id}, playlist_id: ${id} }) {
                      creator_id
                    }
                  }`,
            })
            .subscribe((result) => {
              this.apollo
                .watchQuery<any>({
                  query: gql`
                      query {
                        getPlaylistById(id: ${id}) {
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
                  this.db.modalAddPlaylistUpload = false;
                });
            });
        });
    }
  }
}
