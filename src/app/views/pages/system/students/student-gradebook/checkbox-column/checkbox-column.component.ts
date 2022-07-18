import {Component, OnDestroy, OnInit} from '@angular/core';
import {StudentsService} from '../../../../../../core/service/service-model/students.service';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'kt-checkbox-column',
  templateUrl: './checkbox-column.component.html',
  styleUrls: ['./checkbox-column.component.scss']
})
export class CheckboxColumnComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  checked = false;
  rowSelect;
  params;
  rowIndex;
  constructor(private studentService: StudentsService) { }

  ngOnInit(): void {
    this.studentService.changeScoreGradeBook$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      // console.log('score change',val);
      if (val !== null &&
        val.rowIndex === this.rowIndex &&
        val.studentCode === this.rowSelect.studentCode
      ) {
        this.checked = val.checked;
      }
    });
    this.studentService.changeValueRank$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      // console.log('rank change',val)
      if (val !== null &&
        val.rowIndex === this.rowIndex &&
        val.studentCode === this.rowSelect.studentCode
      ) {
        this.checked = val.checked;
      }
    });
  }

  agInit(params ): void {
    this.params = params;
    this.rowSelect = params.data;
    this.rowIndex = +params.rowIndex + 1;
    this.checked = this.rowSelect.checked;
  }

  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
