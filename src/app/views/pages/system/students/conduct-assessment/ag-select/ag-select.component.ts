import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {EvaluateConductService} from '../../../../../../core/service/service-model/evaluate-conduct.service';
import {ConductAssessmentComponent} from "../conduct-assessment.component";
import {TranslateService} from "@ngx-translate/core";

// import {IAfterGuiAttachedParams} from 'ag-grid';

// @ts-ignore
@Component({
  selector: 'kt-ag-select',
  templateUrl: './ag-select.component.html',
  styleUrls: ['./ag-select.component.css']
})
export class AgSelectComponent implements AgRendererComponent, OnInit {

  params: any;
  listCompetition = [];
  conductName;
  isUpdate;
  select = this.translate.instant(`CONDUCT_ASSESSMENT.SELECTION`);
  rowIndex;
  constructor( private evaluateConductService : EvaluateConductService,
               private conductComponent: ConductAssessmentComponent,
               private changeDetectorRef: ChangeDetectorRef,
               private translate: TranslateService,
  ) {

  }

  agInit(params: any): void {
    this.params = params;
    this.rowIndex = params.rowIndex;
    this.isUpdate = params.api.disableSelect;
    if(params.value === ''){
      params.value = null;
    }
    // console.log('selectparam',params);
    this.conductName = params.data.competitionName;
    this.listCompetition = params.api.listCompetition;
  }

  ngOnInit(): void {
    // checkbox column
    this.evaluateConductService.checkedColumn$.subscribe(val => {
      if (val) {
        if (this.rowIndex === val.rowIndex) {
          this.conductComponent.checkDisableSelect();
          console.log(this.params);
        }
      }
    });

    this.evaluateConductService.checkedHeader$.subscribe(val => {
      if (val) {
        this.conductComponent.checkDisableSelect();
      }
    });
  }

  refresh(params: any): boolean {
    console.log('listCompe',this.listCompetition);
    // console.log('selectparam',params);
    // const x = params.value;
    // const y : number = +x;

    // params.data.competitionCode = params.value;
    // this.listCompetition.forEach((item) =>{
    //   if(params.value === item.value){
    //     this.conductName = item.name;
    //   }
    // })
    // params.api.refreshCells(params);
    return false;
  }
}
