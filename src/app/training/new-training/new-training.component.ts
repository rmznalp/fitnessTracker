import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Observable, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Exercise } from '../exercise.modal';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() startTraining = new EventEmitter<void>();
  exercises: Exercise[] = [];
  exerciseSubscription = new Subscription();

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (result) => {
        this.exercises = result;
      }
    );
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}
