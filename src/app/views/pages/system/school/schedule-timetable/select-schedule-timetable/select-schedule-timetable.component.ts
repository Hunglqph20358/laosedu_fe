import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {SchoolServices} from '../../school.service';
import {includes} from 'ag-grid-community/dist/lib/utils/array';

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'kt-select-schedule-timetable',
  templateUrl: './select-schedule-timetable.component.html',
  styleUrls: ['./select-schedule-timetable.component.scss']
})
export class SelectScheduleTimetableComponent implements AgRendererComponent {

  params: any;
  listItem = [];
  isTeacher: boolean
  constructor(
    private schoolServices: SchoolServices
  ) {
  }

  agInit(params: any): void {
    this.params = params;
    if(['subjectCodePm', 'subjectCodeAm'].includes(this.params.colDef.field)){
      this.isTeacher = false;
    }else {
      this.isTeacher = true
    }
    this.listItem = this.params.data.listSubjectTeacher
  }

  // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  // }
  onClick(params) {
    this.params.onClick(this.params);
  }

  tooltip(){
    if(this.isTeacher){
      const data = this.listItem.find(it => it.teacherCode === this.params.value)
      return data ? data.teacherName : null
    }else {
      const data = this.listItem.find(it => it.subjectCode === this.params.value)
      return data ? data.nameSubject : null
    }
  }

  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }
}
