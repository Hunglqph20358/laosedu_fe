import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {Subscription} from 'rxjs';
import {ConductAssessmentComponent} from '../conduct-assessment.component';
import {EvaluateConductService} from '../../../../../../core/service/service-model/evaluate-conduct.service';

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'kt-checkbox-header',
  templateUrl: './checkbox-header.component.html',
  styleUrls: ['./checkbox-header.component.scss']
})
export class CheckboxHeaderComponent implements AgRendererComponent, OnInit {

  params: any;
  subscription: Subscription;
  semesterAmount;
  currentYear;
  dataGrid;

  checked = false;
  disableCheckbox;

  constructor(private conductAssessmentComponent:ConductAssessmentComponent,
              private conductService : EvaluateConductService) {

  }

  agInit(params: any): void {
    this.params = params;
    console.log('header',params);
    this.checked = params.api[params.column.colId];
  }

  ngOnInit(): void {
    this.conductService.checkedHeader$.subscribe(val => {
      // console.log('header change',val);
      if (val) {
        if (val.checked === true && val.colId !== this.params.column.colId) {
          this.checked = false;
        }
      }
    });
    this.conductService.checkedColumn$.subscribe(val => {
      // console.log('column change',val);
      if (val) {
        this.conductAssessmentComponent.isCheckedAll();
        this.checked = this.params.api[this.params.column.colId];
      }
    });
  }

  changeChecked() {
    this.checked = this.checked ? true : false;
    this.conductService.changeCheckboxHeader(
      {
        colId: this.params.column.colId,
        checked: this.checked
      }
    )
  }

  transformData() {


  }

  refresh(params: any): boolean {
    return false;
  }
}
