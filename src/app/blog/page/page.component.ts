import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BloggerService } from '../blogger.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  
  page: any;

  constructor(
    private route: ActivatedRoute,
    public http:HttpClient,
    public bloggerService: BloggerService,
    private seo: SeoService,
  ) {}

  //🟢 Reload page from route changes, and make it SEO.
  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      // console.log('Route:', routeParams.id)
      this.bloggerService.getBloggerPage(routeParams.id)
      .pipe(
        tap(page =>
          this.seo.generateTags({
            title: page.title,
            description: page.content,
          })
        )
      ).subscribe(page => this.page = page);
    });
  }
}