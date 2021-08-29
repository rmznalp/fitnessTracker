import { Exercise } from './../exercise.modal';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingService } from '../training.service';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss'],
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'date',
    'name',
    'duration',
    'calories',
    'state',
  ];

  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.dataSource.data =
      this.trainingService.getCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
