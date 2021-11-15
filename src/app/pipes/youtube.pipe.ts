import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'videoYoutube'
})
export class VideoYoutubePipe implements PipeTransform {

  constructor( private domSanitazer: DomSanitizer ) {

  }
  transform(value: string): any {
    const url = 'https://www.youtube.com/embeded';
    return this.domSanitazer.bypassSecurityTrustResourceUrl( url + value);
  }

}