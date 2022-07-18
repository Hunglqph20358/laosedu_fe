import { Component, OnInit } from '@angular/core';
import {StudentsService} from '../../../../../../core/service/service-model/students.service';

@Component({
  selector: 'kt-avg-score',
  templateUrl: './avg-score.component.html',
  styleUrls: ['./avg-score.component.scss']
})
export class AvgScoreComponent implements OnInit {

  params;
  rowIndex;
  rowSelect;
  avgScore;
  constructor(private studentService: StudentsService) { }

  ngOnInit(): void {
    this.studentService.changeScoreGradeBook$.subscribe(val => {
      if (val !== null && this.rowIndex === val.rowIndex && val.studentCode === this.rowSelect.studentCode) {
        this.avgScore = val.avgScore;
      }
    });
  }

  agInit(params ): void {
    this.params = params;
    this.rowSelect = params.data;
    this.rowIndex = +params.rowIndex + 1;
    this.avgScore = this.rowSelect.avgScore;
  }
}
