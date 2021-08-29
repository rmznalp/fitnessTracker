import { Subject } from 'rxjs';
import { Exercise } from './exercise.modal';

export class TrainingService {
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  private runningExercise: Exercise | any | null;
  exerciseChanged = new Subject<Exercise | any | null>();
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id == selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
    return this.runningExercise;
  }

  completeExercise() {
    this.runningExercise
      ? this.exercises.push({
          ...this.runningExercise,
          date: new Date(),
          state: 'completed',
        })
      : null;
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.runningExercise
      ? this.exercises.push({
          ...this.runningExercise,
          duration: this.runningExercise.duration * (progress / 100),
          calories: this.runningExercise.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled',
        })
      : null;
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
