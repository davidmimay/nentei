import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RoutineDialogComponent } from '../dialogs/routine-dialog.component';
import { Routine } from '../routine.model';
import { RoutineService } from '../routine.service';
import { SubscribedService } from '../../services/subscribed.service';


@Component({
  selector: 'app-routines-list',
  templateUrl: './routines-list.component.html',
  styleUrls: ['./routines-list.component.scss']
})
export class RoutinesListComponent implements OnInit, OnDestroy {

  routines: Routine[];
  sub: Subscription;
  doesNotHaveSubs$;
  currentUser$;

  constructor(public routineService: RoutineService, public dialog: MatDialog, public subscribedService: SubscribedService) {}

  ngOnInit() {
    this.sub = this.routineService
      .getUserRoutines()
      .subscribe(routines => (this.routines = routines));
    this.doesNotHaveSubs$ = this.subscribedService.doesNotHaveSubs$;
    this.currentUser$ = this.subscribedService.currentUser$;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.routines, event.previousIndex, event.currentIndex);
    this.routineService.sortRoutines(this.routines);
  }

  openRoutineDialog(): void {
    const dialogRef = this.dialog.open(RoutineDialogComponent, {
      width: '400px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.routineService.createRoutine({
          title: result,
          priority: this.routines.length
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
