import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutinesListComponent } from './routines-list/routines-list.component';


const routes: Routes = [
  { path: '', component: RoutinesListComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutineRoutingModule { }

