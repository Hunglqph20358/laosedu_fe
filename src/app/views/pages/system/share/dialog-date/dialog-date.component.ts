import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe, formatDate} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {TeachingSchedulePayload} from "../../teachers/teaching-timetable/shared/models/teaching-schedule-payload";

@Component({
  selector: 'kt-dialog-date',
  templateUrl: './dialog-date.component.html',
  styleUrls: ['./dialog-date.component.scss']
})
export class DialogDateComponent implements OnInit {
  @Input() dateValue;
  @Input() messageNull;
  @Input() messageIllegal;
  @Output() dateOutput:any = new EventEmitter<any>();
  formDate: any;
  endDate: any;
  invalid = false;
  message;

  fromDateSemester;
  semester;

  empty = true;
  delete = false;
  constructor(private datePipe: DatePipe,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.dateOutput.emit(this.dateValue);
  }

  checkValid() {

    if (this.dateValue === '' || this.dateValue === undefined) {
      if (this.empty || this.delete) {
        this.invalid = true;
        this.message = this.messageNull;
        this.dateOutput.emit('error');
        return;
      }
      this.empty = false;
      this.invalid = true;
      this.message = this.messageIllegal;
      this.dateOutput.emit('error');
      return;
    }else{
      this.empty = false;
    }

    this.dateOutput.emit(this.dateValue);
    this.invalid = false;
  }

  validateKeyUp(event) {
    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      this.empty = false;
      this.delete = false;
    }
    if (event.keyCode === 8 || event.keyCode === 46) {
      this.delete = true;
    }
  }

}
