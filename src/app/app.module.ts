import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Forms
import { FormsModule } from '@angular/forms';

//SVG
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

//OAUTH2 Google Login
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

//Routing
import { AppRoutingModule } from './app-routing.module';

//Directive Upload
import { UploadDirective } from './content/upload/upload.directive';

//Component
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';
import { CategoryComponent } from './content/category/category.component';
import { ChannelComponent } from './content/channel/channel.component';
import { HomeComponent } from './content/home/home.component';
import { MembershipComponent } from './content/membership/membership.component';
import { SearchComponent } from './content/search/search.component';
import { SubscriptionsComponent } from './content/subscriptions/subscriptions.component';
import { TrendingComponent } from './content/trending/trending.component';
import { UploadComponent } from './content/upload/upload.component';
import { VideoComponent } from './content/video/video.component';
import { VideolistComponent } from './content/videolist/videolist.component';
import { WatchComponent } from './content/watch/watch.component';
import { MonthPopularComponent } from './content/category/month-popular/month-popular.component';
import { RecentUploadComponent } from './content/category/recent-upload/recent-upload.component';
import { TimePopularComponent } from './content/category/time-popular/time-popular.component';
import { WeekPupularComponent } from './content/category/week-pupular/week-pupular.component';
import { AboutChannelComponent } from './content/channel/about-channel/about-channel.component';
import { CommunityChannelComponent } from './content/channel/community-channel/community-channel.component';
import { HomeChannelComponent } from './content/channel/home-channel/home-channel.component';
import { PlaylistChannelComponent } from './content/channel/playlist-channel/playlist-channel.component';
import { VideoChannelComponent } from './content/channel/video-channel/video-channel.component';
import { MonthComponent } from './content/subscriptions/month/month.component';
import { TodayComponent } from './content/subscriptions/today/today.component';
import { WeekComponent } from './content/subscriptions/week/week.component';
import { CommentComponent } from './content/watch/comment/comment.component';
import { RelatedVideoComponent } from './content/watch/related-video/related-video.component';
import { ChannelListComponent } from './content/search/channel-list/channel-list.component';
import { PlaylistComponent } from './content/playlist/playlist.component';
import { ReplyComponent } from './content/watch/comment/reply/reply.component';
import { RecentComponent } from './content/channel/home-channel/recent/recent.component';
import { OwnvideoComponent } from './content/channel/home-channel/ownvideo/ownvideo.component';
import { OwnplaylistComponent } from './content/channel/home-channel/ownplaylist/ownplaylist.component';
import { ChannelsideComponent } from './sidebar/channelside/channelside.component';
import { PlaylistsideComponent } from './sidebar/playlistside/playlistside.component';
import { SubsChannelComponent } from './content/subs-channel/subs-channel.component';
import { HistoryBillComponent } from './content/membership/history-bill/history-bill.component';
import { UserPlaylistComponent } from './content/user-playlist/user-playlist.component';
import { PlayListComponent } from './content/play-list/play-list.component';
import { CommunityComponent } from './content/channel/community-channel/community/community.component';
import { NotifPostComponent } from './header/notif-post/notif-post.component';
import { NotifVideoComponent } from './header/notif-video/notif-video.component';
import { KeywordComponent } from './header/keyword/keyword.component';
import { TabPlaylistComponent } from './content/user-playlist/tab-playlist/tab-playlist.component';
import { OptionPlaylistComponent } from './content/option-playlist/option-playlist.component';
import { QueueComponent } from './content/queue/queue.component';
import { EditComponent } from './content/edit/edit.component';
import { GraphQLModule } from './graphql.module';

const config = {
  apiKey: 'AIzaSyBWNtK9w_BmpHN7t_iMQtKwPusf42rdY9w',
  authDomain: 'yourjube1701.firebaseapp.com',
  databaseURL: 'https://yourjube1701.firebaseio.com',
  projectId: 'yourjube1701',
  storageBucket: 'yourjube1701.appspot.com',
  messagingSenderId: '764238171490',
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    CategoryComponent,
    ChannelComponent,
    HomeComponent,
    MembershipComponent,
    SearchComponent,
    SubscriptionsComponent,
    TrendingComponent,
    UploadComponent,
    VideoComponent,
    VideolistComponent,
    WatchComponent,
    MonthPopularComponent,
    RecentUploadComponent,
    TimePopularComponent,
    WeekPupularComponent,
    AboutChannelComponent,
    CommunityChannelComponent,
    HomeChannelComponent,
    PlaylistChannelComponent,
    VideoChannelComponent,
    MonthComponent,
    TodayComponent,
    WeekComponent,
    UploadDirective,
    CommentComponent,
    RelatedVideoComponent,
    ChannelListComponent,
    PlaylistComponent,
    ReplyComponent,
    RecentComponent,
    OwnplaylistComponent,
    OwnvideoComponent,
    ChannelsideComponent,
    PlaylistsideComponent,
    SubsChannelComponent,
    HistoryBillComponent,
    UserPlaylistComponent,
    PlayListComponent,
    CommunityComponent,
    NotifPostComponent,
    NotifVideoComponent,
    KeywordComponent,
    TabPlaylistComponent,
    OptionPlaylistComponent,
    EditComponent,
    QueueComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InlineSVGModule.forRoot(),
    FormsModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireStorageModule,
    GraphQLModule, // storage
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '764238171490-1pdi7hd1or51ujh3nkuf9e1bt5jbto8t.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
