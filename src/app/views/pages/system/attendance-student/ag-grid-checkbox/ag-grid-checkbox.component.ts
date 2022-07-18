import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {Subscription} from "rxjs";
import {ClassroomService} from "../../../../../core/service/service-model/classroom.service";
import {SchoolYearService} from "../../school-year/school-year.service";

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'app-ag-grid-checkbox',
  templateUrl: './ag-grid-checkbox.component.html',
  styleUrls: ['./ag-grid-checkbox.component.css']
})
export class AgGridCheckboxComponent implements AgRendererComponent {

  params: any;
  data;
  subscription: Subscription;
  semesterAmount;
  currentYear;

  constructor() {
  }
  agInit(params: any): void {
    this.params = params;
  }

  // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  // }

  refresh(params: any): boolean {
    debugger;
    // params.api.refreshCells(params);
    if(params.column.colId == 'totalGoingSchool'){
      this.data = params.data.totalGoingSchool;
    }
    return false;
  }
}
