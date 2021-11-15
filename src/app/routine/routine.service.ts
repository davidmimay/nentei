import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Routine, Task } from './routine.model';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  /**
   * Creates a new routine for the current user
   */
  async createRoutine(data: Routine) {
    const user = await this.afAuth.auth.currentUser;
    return this.db.collection('routines').add({
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Hello!', label: 'yellow' }]
    });
  }

  /**
   * Get all routines owned by current user
   */
  getUserRoutines() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Routine>('routines', ref =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      }),
      // map(routines => routines.sort((a, b) => a.priority - b.priority))
    );
  }

  /**
   * Run a batch write to change the priority of each routine for sorting
   */
  sortRoutines(routines: Routine[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = routines.map(b => db.collection('routines').doc(b.id));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }

  /**
   * Delete routine
   */
  deleteRoutine(routineId: string) {
    return this.db
      .collection('routines')
      .doc(routineId)
      .delete();
  }

  /**
   * Updates the tasks on routine
   */
  updateTasks(routineId: string, tasks: Task[]) {
    return this.db
      .collection('routines')
      .doc(routineId)
      .update({ tasks });
  }

  /**
   * Remove a specifc task from the routine
   */
  removeTask(routineId: string, task: Task) {
    return this.db
      .collection('routines')
      .doc(routineId)
      .update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
      });
  }
}
