import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {AcademicAbilitiesService} from "../academic-abilities.service";

@Component({
  selector: 'app-ag-grid-selec',
  templateUrl: './ag-grid-select.component.html',
  styleUrls: ['./ag-grid-select.component.css']
})
export class AgGridSelectComponent implements AgRendererComponent {

  params: any;
  dataSelect: any[];
  isDisabled
  ability
  value
  valueClone

  constructor() { }
  
  agInit(params: any): void {
    this.params = params;
    this.dataSelect = params.api.dataAbility;
    this.value = params.data.academicAbility
    this.ability = this.dataSelect.find(value => value.code == this.value)?.name
    this.isDisabled = !(params.data.avgScoreYear !== null &&  params.api.disableStatus !== true)
  }

  refresh(): boolean {
    this.params.data.academicAbility = this.value;
    this.ability = this.dataSelect.find(value => value.code == this.value).name
    return false;
  }
}
