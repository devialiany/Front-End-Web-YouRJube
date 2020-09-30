import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  idChannelR = '';
  modalWantLog = false;
  modalSharePlaylist = false;
  modalShareVideo = false;
  modalLocation = false;
  videos = [];
  membership = false;
  channelSubs = [];
  playlists = [];
  pointPlaylist = 5;
  currentLoc = 'Indonesia';
  autoComplete = false;
  keyword = '';
  //modal playlist
  modalAddPlaylist = false;
  modalAddNewPlaylist = false;
  modalAddPlaylistUpload = false;
  idVideo = 0;
  userPlaylist = [];
  idPlaylist = 0;
  type = 2;
  triggerSortPl = false;

  //playlist move
  plyActive = [];
  constructor() {}

  disconnectDB() {
    this.idChannelR = '';
    this.modalWantLog = false;
    this.videos = [];
    this.membership = false;
    this.modalSharePlaylist = false;
    this.modalShareVideo = false;
    this.modalAddPlaylistUpload = false;
    this.modalLocation = false;
    this.channelSubs = [];
    this.playlists = [];
    this.pointPlaylist = 5;
    this.currentLoc = 'Indonesia';
    this.autoComplete = false;
    this.keyword = '';
    //modal playlist
    this.modalAddPlaylist = false;
    this.modalAddNewPlaylist = false;
    this.idVideo = 0;
    this.userPlaylist = [];
    this.idPlaylist = 0;
    this.type = 2;
    this.plyActive = [];
    this.triggerSortPl = false;
  }
}
