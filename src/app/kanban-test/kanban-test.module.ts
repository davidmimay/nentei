import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KanbanTestRoutingModule } from './kanban-test-routing.module';
import { BoardsListComponent } from './boards-list/boards-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardComponent } from './board/board.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FormsModule } from '@angular/forms';
import { BoardDialogComponent } from './dialogs/board-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TaskDialogComponent } from './dialogs/task-dialog.component';

@NgModule({
  declarations: [
    BoardsListComponent,
    BoardComponent,
    HomePageComponent,
    BoardDialogComponent,
    TaskDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    KanbanTestRoutingModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonToggleModule,
  ],
  entryComponents: [BoardDialogComponent, TaskDialogComponent]
})
export class KanbanTestModule {}
