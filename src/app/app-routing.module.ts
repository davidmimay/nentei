import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KnowPageComponent } from './know-page/know-page.component';
import { CalmPageComponent } from './calm-page/calm-page.component';
import { KoanPageComponent } from './koan-page/koan-page.component';
import { AuthGuard } from './user/auth.guard';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [

  { path: '', component: HomePageComponent},
  {
    path: 'profile',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'kanban',
    loadChildren: () => import('./kanban/kanban.module').then(m => m.KanbanModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'know',
    loadChildren: () => import('./kanban-test/kanban-test.module').then(m => m.KanbanTestModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'routine',
    loadChildren: () => import('./routine/routine.module').then(m => m.RoutineModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
  },
  { path: 'know2', component: KnowPageComponent },
  { path: 'meditate', component: CalmPageComponent },
  { path: 'koan', component: KoanPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}