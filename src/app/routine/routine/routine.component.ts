import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskDialogComponent } from '../dialogs/task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RoutineService } from '../routine.service';
import { Task } from '../routine.model';


@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss']
})
export class RoutineComponent {
  @Input() routine;

  taskDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.routine.tasks, event.previousIndex, event.currentIndex);
    this.routineService.updateTasks(this.routine.id, this.routine.tasks);
  }

  openDialog(task?: Task, idx?: number): void {
    const newTask = { label: 'purple' };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task
        ? { task: { ...task }, isNew: false, routineId: this.routine.id, idx }
        : { task: newTask, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isNew) {
          this.routineService.updateTasks(this.routine.id, [
            ...this.routine.tasks,
            result.task
          ]);
        } else {
          const update = this.routine.tasks;
          update.splice(result.idx, 1, result.task);
          this.routineService.updateTasks(this.routine.id, this.routine.tasks);
        }
      }
    });
  }

  handleDelete() {
    this.routineService.deleteRoutine(this.routine.id);
  }

  constructor(private routineService: RoutineService, private dialog: MatDialog) {}
}
