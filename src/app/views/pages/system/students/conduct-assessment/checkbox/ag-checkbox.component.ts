import {Component, OnInit,ChangeDetectorRef} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {Subscription} from 'rxjs';
import {EvaluateConductService} from "../../../../../../core/service/service-model/evaluate-conduct.service";
import {ConductAssessmentComponent} from "../conduct-assessment.component";

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'kt-ag-checkbox',
  templateUrl: './ag-checkbox.component.html',
  styleUrls: ['./ag-checkbox.component.scss']
})
export class AgCheckboxComponent implements AgRendererComponent, OnInit {

  params: any;
  subscription: Subscription;
  semesterAmount;
  currentYear;
  checked;

  conductCode;
  rowIndex;

  constructor(private conductService: EvaluateConductService,
              private conductComponent: ConductAssessmentComponent) {
  }

  agInit(params: any): void {
    this.params = params;
    this.rowIndex = params.rowIndex;

    // Check conduct code
    const conductIndex = params.colDef.field.replace('conduct', '');
    const conduct = this.params.data.listConduct[conductIndex];
    if (this.params.data.conductCode !== '' &&
      this.params.data.abilityCode !== '' &&
      this.params.data[params.colDef.field] === this.params.data.conductCode
    ) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }

  refresh(params: any): boolean {

    //   params.api.checkBoxHeader1 = false
    //   params.api.checkBoxHeader2 = false
    //   params.api.checkBoxHeader3 = false
    //   params.api.checkBoxHeader4 = false
    // console.log('param checkbox',params);
    // if (params.colDef.field === 'conductExcellent') {
    //   if (params.value === true) {
    //     params.data.conductExcellent = true;
    //     params.data.conductCode = 'excellent';
    //     params.data.conductGood = false;
    //     params.data.conductMedium = false;
    //     params.data.conductWeak = false;
    //   } else {
    //     params.data.conductExcellent = false;
    //     params.data.conductCode = '';
    //   }
    // }
    //
    // if (params.colDef.field === 'conductGood') {
    //   if (params.value === true) {
    //     params.data.conductExcellent = false;
    //     params.data.conductGood = true;
    //     params.data.conductCode = 'good';
    //     params.data.conductMedium = false;
    //     params.data.conductWeak = false;
    //   } else {
    //     params.data.conductGood = false;
    //     params.data.conductCode = '';
    //   }
    // }
    //
    // if (params.colDef.field === 'conductMedium') {
    //   if (params.value === true) {
    //     params.data.conductExcellent = false;
    //     params.data.conductGood = false;
    //     params.data.conductMedium = true;
    //     params.data.conductCode = 'medium';
    //     params.data.conductWeak = false;
    //   } else {
    //     params.data.conductMedium = false;
    //     params.data.conductCode = '';
    //   }
    // }
    //
    // if (params.colDef.field === 'conductWeak') {
    //   if (params.value === true) {
    //     params.data.conductExcellent = false;
    //     params.data.conductGood = false;
    //     params.data.conductMedium = false;
    //     params.data.conductWeak = true;
    //     params.data.conductCode = 'weak';
    //   } else {
    //     params.data.conductWeak = false;
    //     params.data.conductCode = '';
    //   }
    // }
    // params.api.refreshCells(params);
    // console.log('param', params);
    return false;
  }

  ngOnInit(): void {
    // checkbox header
    this.conductService.checkedHeader$.subscribe(val => {
      // console.log('header',val);
      if (val) {
        if (this.params.column.colId === val.colId &&
          this.params.data.abilityCode !== ''
        ) {
          this.checked = val.checked;
          this.transformData();
        } else if(this.params.column.colId !== val.colId &&
          this.params.data.abilityCode !== '' &&
          val.checked
        ){
          this.checked = false;
          this.params.data.conductCode = '';
        }
      }
    });

    // checkbox column
    this.conductService.checkedColumn$.subscribe(val => {
      if (val) {
        if (this.params.column.colId !== val.colId && this.rowIndex === val.rowIndex && val.checked
        ) {
          this.checked = false;
        }
      }
    });
  }

  changeCheckbox() {
    this.transformData();
    this.conductComponent.isCheckedAll();
    this.conductService.changeCheckboxColumn(
      {
        colId: this.params.column.colId,
        checked: this.checked,
        rowIndex: this.rowIndex
      }
    );
  }

  transformData() {
    const colId = this.params.column.colId;
    if (this.checked === true) {
      this.params.data.conductCode = this.params.data[colId];
      this.params.data.conductCodeTransform = this.params.data[colId];
    } else {
      this.params.data.conductCode = '';
      this.params.data.conductCodeTransform = '';
    }
    // console.log('transform',this.params);
  }

  // check(params){
  //   let arr = [];
  //   params.api.dataAll.forEach(element => {
  //     if(element.abilityCode != "" && element.abilityCode != null){
  //       arr.push(element);
  //     }
  //   });
  //   console.log("arr",arr);
  //   if(arr.length == 0){
  //     params.api.checkBoxHeader1 = false;
  //     params.api.checkBoxHeader2 = false;
  //     params.api.checkBoxHeader3 = false;
  //     params.api.checkBoxHeader4 = false;
  //   }else{
  //     if(arr.every( v => v.conductExcellent ===true )){
  //       params.api.checkBoxHeader1 = true;
  //     }
  //     if(arr.every( v => v.conductGood ===true )){
  //       params.api.checkBoxHeader2 = true;
  //     }
  //     if(arr.every( v => v.conductMedium ===true )){
  //       params.api.checkBoxHeader3 = true;
  //     }
  //     if(arr.every( v => v.conductWeak ===true )){
  //       params.api.checkBoxHeader4 = true;
  //     }
  //   }
  // }
  //
  // onChange(params) {
  //
  //   params.api.checkBoxHeader1 = false
  //   params.api.checkBoxHeader2 = false
  //   params.api.checkBoxHeader3 = false
  //   params.api.checkBoxHeader4 = false
  //   console.log('param checkbox',params);
  //   if (params.colDef.field === 'conductExcellent') {
  //     if (params.value === true) {
  //       params.data.conductExcellent = true;
  //       params.data.conductCode = 'excellent';
  //       params.data.conductGood = false;
  //       params.data.conductMedium = false;
  //       params.data.conductWeak = false;
  //     } else {
  //       params.data.conductExcellent = false;
  //       params.data.conductCode = '';
  //     }
  //   }
  //
  //   if (params.colDef.field === 'conductGood') {
  //     if (params.value === true) {
  //       params.data.conductExcellent = false;
  //       params.data.conductGood = true;
  //       params.data.conductCode = 'good';
  //       params.data.conductMedium = false;
  //       params.data.conductWeak = false;
  //     } else {
  //       params.data.conductGood = false;
  //       params.data.conductCode = '';
  //     }
  //   }
  //
  //   if (params.colDef.field === 'conductMedium') {
  //     if (params.value === true) {
  //       params.data.conductExcellent = false;
  //       params.data.conductGood = false;
  //       params.data.conductMedium = true;
  //       params.data.conductCode = 'medium';
  //       params.data.conductWeak = false;
  //     } else {
  //       params.data.conductMedium = false;
  //       params.data.conductCode = '';
  //     }
  //   }
  //
  //   if (params.colDef.field === 'conductWeak') {
  //     if (params.value === true) {
  //       params.data.conductExcellent = false;
  //       params.data.conductGood = false;
  //       params.data.conductMedium = false;
  //       params.data.conductWeak = true;
  //       params.data.conductCode = 'weak';
  //     } else {
  //       params.data.conductWeak = false;
  //       params.data.conductCode = '';
  //     }
  //   }
  //   this.check(params);
  //   params.api.refreshCells(params);
  //   console.log('param', params);
  // }
}
