import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './content/home/home.component';
import { TrendingComponent } from './content/trending/trending.component';
import { SubscriptionsComponent } from './content/subscriptions/subscriptions.component';
import { MembershipComponent } from './content/membership/membership.component';
import { UploadComponent } from './content/upload/upload.component';
import { WatchComponent } from './content/watch/watch.component';
import { ChannelComponent } from './content/channel/channel.component';
import { HomeChannelComponent } from './content/channel/home-channel/home-channel.component';
import { VideoChannelComponent } from './content/channel/video-channel/video-channel.component';
import { PlaylistChannelComponent } from './content/channel/playlist-channel/playlist-channel.component';
import { AboutChannelComponent } from './content/channel/about-channel/about-channel.component';
import { CommunityChannelComponent } from './content/channel/community-channel/community-channel.component';
import { CategoryComponent } from './content/category/category.component';
import { SearchComponent } from './content/search/search.component';
import { SubsChannelComponent } from './content/subs-channel/subs-channel.component';
import { UserPlaylistComponent } from './content/user-playlist/user-playlist.component';
import { EditComponent } from './content/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'subscriptions', component: SubscriptionsComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'category/:category', component: CategoryComponent },
  { path: 'watch/:id/playlist/:pid', component: WatchComponent },
  { path: 'search/:keyword', component: SearchComponent },
  { path: 'wait/:id', component: SubsChannelComponent },
  { path: 'playlist/:pid', component: UserPlaylistComponent },
  { path: 'edit/:id', component: EditComponent },
  {
    path: 'channel/:id',
    component: ChannelComponent,
    children: [
      { path: '', redirectTo: 'homechannel', pathMatch: 'full' },
      { path: 'homechannel', component: HomeChannelComponent },
      { path: 'videochannel', component: VideoChannelComponent },
      { path: 'playlistchannel', component: PlaylistChannelComponent },
      { path: 'communitychannel', component: CommunityChannelComponent },
      { path: 'aboutchannel', component: AboutChannelComponent },
      { path: '**', redirectTo: 'homechannel', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
