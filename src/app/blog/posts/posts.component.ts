import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { BloggerService } from '../blogger.service';

@Component({
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})

export class PostsComponent {

  posts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public http:HttpClient,
    public bloggerService: BloggerService,
  ) {
    this.bloggerService.getBloggerPosts().subscribe(posts => this.posts = posts);
  }

}