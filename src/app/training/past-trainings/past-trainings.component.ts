import { Exercise } from './../exercise.modal';
import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingService } from '../training.service';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss'],
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'date',
    'name',
    'duration',
    'calories',
    'state',
  ];
  exerciseSubscription = new Subscription();
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exerciseSubscription =
      this.trainingService.finishedExercisesChanged.subscribe(
        (exercises: Exercise[]) => {
          this.dataSource.data = exercises;
        }
      );
    this.trainingService.fethCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterEvent: any) {
    const filterString = filterEvent.target.value;
    this.dataSource.filter = filterString.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}
