import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page/page.component';
import { PostsComponent } from './posts/posts.component';


const routes: Routes = [
  { path: 'page', component: PostsComponent },
  { path: 'page/:id', component: PageComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
