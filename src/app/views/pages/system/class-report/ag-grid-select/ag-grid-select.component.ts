import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {ClassReportService} from "../class-report.service";

@Component({
  selector: 'app-ag-grid-selec',
  templateUrl: './ag-grid-select.component.html',
  styleUrls: ['./ag-grid-select.component.css']
})
export class AgGridSelectComponent implements AgRendererComponent {

  params: any;
  dataSelect: any[];
  ability
  value
  constructor() { }
  
  agInit(params: any): void {
    this.params = params;
    this.dataSelect = params.api.dataAbility;
    this.ability = params.data.abilityName
    this.value = params.data.academicAbility
  }

  refresh(): boolean {
    this.params.data.academicAbility = this.value;
    this.ability = this.dataSelect.find(value => value.code == this.value).name
    return false;
  }
}
