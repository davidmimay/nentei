// SOURCE: https://www.youtube.com/watch?v=Wvu6Ci71xn4
// SOURCE COURSE: video 06.obtener la lista de reproduccion uploads.

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private youtubeUrl:string = "https://www.googleapis.com/youtube/v3";
  
  private apikey:string = '';
  private playlist:string = '';
  private nextpage:string = '';
  /*
  private apikey:string = environment.youtube.apikey;
  private playlist:string = environment.youtube.playlist;
  private nextpage:string = environment.youtube.nextpage;
  */
  constructor(public http:HttpClient) {}
  
  getVideos() {

    let url = `${ this.youtubeUrl }/playlistItems`;
    let params = new HttpParams();
 
    params = params.append('part', 'snippet' );
    params = params.append('maxResults', '4' );
    params = params.append('playlistId', this.playlist );
    params = params.append('key', this.apikey );

    if ( this.nextpage ) {
      params = params.append('pageToken', this.nextpage );
    }
 
    return this.http.get( url, { params } ).pipe( map( (res: any) => {
      console.log(res);
      this.nextpage = res.nextpage;
      let videos: any[] = [];
      for ( let video of res.items ) {
        let snippet = video.snippet;
        videos.push( snippet );
      }
      return videos;
    }) );

  }

}
