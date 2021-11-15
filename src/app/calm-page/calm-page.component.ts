import { Component } from '@angular/core';
import { YoutubeService } from './../services/youtube.service';

declare var $:any;

@Component({
  selector: 'app-calm-page',
  templateUrl: './calm-page.component.html',
  styleUrls: ['./calm-page.component.scss']
})
export class CalmPageComponent {

  videos: any[] = [];
  videoSel: any;

  constructor( public yts: YoutubeService ) {
    this.yts.getVideos().subscribe( videos =>  this.videos = videos );
  }
  

  ngOnInit(): void {
  }

  loadMore() {
    this.yts.getVideos().subscribe( videos =>  this.videos.push.apply( this.videos, videos) );
  }

  watchVideo( video: any ) {
    this.videoSel = video;
    $('#myModal').modal();
  }

  closeModal() {
    this.videoSel = null;
    $('#myModal').modal('hide');
  }

}
