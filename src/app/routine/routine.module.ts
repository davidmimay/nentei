import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutineRoutingModule } from './routine-routing.module';
import { RoutinesListComponent } from './routines-list/routines-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RoutineComponent } from './routine/routine.component';
import { FormsModule } from '@angular/forms';
import { RoutineDialogComponent } from './dialogs/routine-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TaskDialogComponent } from './dialogs/task-dialog.component';

@NgModule({
  declarations: [
    RoutinesListComponent,
    RoutineComponent,
    RoutineDialogComponent,
    TaskDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    RoutineRoutingModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonToggleModule,
  ],
  entryComponents: [RoutineDialogComponent, TaskDialogComponent]
})
export class RoutineModule {}
