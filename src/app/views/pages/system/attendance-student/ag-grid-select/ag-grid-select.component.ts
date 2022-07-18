import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'app-ag-grid-select-attendance',
  templateUrl: './ag-grid-select.component.html',
  styleUrls: ['./ag-grid-select.component.css']
})
export class AgGridSelectComponent implements AgRendererComponent {
  classColor = 'black';
  params: any;
  checkDate = '';
  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  changeColor(event){
  if(event === 'C'){
    return 'c';
  }
  if(event === 'K')
   return 'k';
  if(event === 'P')
    return 'p';
  if(event === '-'){
    return 'select-op';
  }
  }
  agInit(params: any): void {
    this.params = params;
    for(let i = 0; i< params.data.attendanceDetailDTOs.length; i++){
      if(params.data.attendanceDetailDTOs[i].date === params.column.colId){
        this.checkDate = params.data.attendanceDetailDTOs[i].checkDate;
      }
    }
  }

  // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  // }

  refresh(params: any): boolean {
    let check = true;
    for(let i = 0; i< params.data.attendanceDetailDTOs.length; i++){
      if(params.data.attendanceDetailDTOs[i].date === params.colDef.field){
        if(params.data.attendanceDetailDTOs[i].checkDate == 'C'){
          params.data.totalGoingSchool--;
        }
        if(params.data.attendanceDetailDTOs[i].checkDate == 'P'){
          params.data.totalRestByReason--;
        }
        if(params.data.attendanceDetailDTOs[i].checkDate == 'K'){
          params.data.totalRestNoReason--;
        }
        params.data.attendanceDetailDTOs[i].checkDate = this.checkDate;
        if(this.checkDate == 'C'){
          params.data.totalGoingSchool++;
        }
        if(this.checkDate == 'P'){
          params.data.totalRestByReason++;
        }
        if(this.checkDate == 'K'){
          params.data.totalRestNoReason++;
        }
        check = false;
        break;
      }
    }
    if(check){
      params.data.attendanceDetailDTOs.push({
        checkDate: this.checkDate,
        date: params.colDef.field
      });
      if(this.checkDate == 'C'){
        params.data.totalGoingSchool++;
      }
      if(this.checkDate == 'P'){
        params.data.totalRestByReason++;
      }
      if(this.checkDate == 'K'){
        params.data.totalRestNoReason++;
      }
    }
    params.api.redrawRows(params);
    return false;
  }
}
