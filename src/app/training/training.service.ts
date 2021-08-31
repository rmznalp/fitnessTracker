import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise.modal';

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | any | null;
  exerciseChanged = new Subject<Exercise | any | null>();
  exercisesChanged = new Subject<Exercise[] | any | null>();
  finishedExercisesChanged = new Subject<Exercise[] | any | null>();

  private fbsubs: Subscription[] = [];
  /**
   *
   */
  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbsubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(
            (docArray: any[]) => {
              return docArray.map((doc) => {
                return {
                  id: doc.payload.doc.id,
                  name: doc.payload.doc.data().name,
                  duration: doc.payload.doc.data().duration,
                  calories: doc.payload.doc.data().calories,
                };
              });
            },
            (error: any) => {
              console.log(error);
            }
          )
        )
        .subscribe((exercises: any) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        })
    );
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/'+selectedId).update({lastSelected: new Date() });

    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id == selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
    return this.runningExercise;
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fethCompletedOrCancelledExercises() {
    this.fbsubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe(
          (exercises: any) => {
            this.finishedExercisesChanged.next(exercises);
          },
          (error: any) => {
            console.log(error);
          }
        )
    );
  }

  cancelSubscription() {
    this.fbsubs.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
