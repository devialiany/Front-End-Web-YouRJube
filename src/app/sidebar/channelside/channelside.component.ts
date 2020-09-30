import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channelside',
  templateUrl: './channelside.component.html',
  styleUrls: ['./channelside.component.scss']
})
export class ChannelsideComponent implements OnInit {
  @Input('cha') creators: {
      id: number
      name: string
      photo_profile: string
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goChannel(){
    this.router.navigateByUrl("channel/"+this.creators.id)
  }

}
