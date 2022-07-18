import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { StudentProfileComponent } from './student-profile.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { StudentInfomationComponent } from './student-infomation/student-infomation.component';
import { StudentScoreComponent } from './student-score/student-score.component';
import { StudentRewardDisciplineComponent } from './student-reward-discipline/student-reward-discipline.component';
import { StudentExemptionComponent } from './student-exemption/student-exemption.component';
import { StudentReserveComponent } from './student-reserve/student-reserve.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EvaluateComponent } from './student-score/evaluate/evaluate.component';

const COMPONENTS = [
  StudentProfileComponent,
  StudentInfomationComponent,
  StudentScoreComponent,
  StudentRewardDisciplineComponent,
  StudentExemptionComponent,
  StudentReserveComponent,
]

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    MatDialogModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    MatTooltipModule
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class StudentProfileModule { }
