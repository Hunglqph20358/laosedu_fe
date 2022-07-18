import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionStudentComponent } from './action-student/action-student.component';
import { StudentProfileModule } from './student-profile/student-profile.module';
import { MatRadioModule } from '@angular/material/radio';
import { ImportFileStudentComponent } from './import-file/import-file-student.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentGradebookComponent } from './student-gradebook/student-gradebook.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputScoreComponent } from './student-gradebook/input-score/input-score.component';
import { InputRankComponent } from './student-gradebook/input-rank/input-rank.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ActionEvaluateComponent } from './student-gradebook/action-evaluate/action-evaluate.component';
import { PopupEvaluateComponent } from './student-gradebook/popup-evaluate/popup-evaluate.component';
import { HeaderCheckboxComponent } from './student-gradebook/header-checkbox/header-checkbox.component';
import { CheckboxColumnComponent } from './student-gradebook/checkbox-column/checkbox-column.component';
import { ConfirmDialogComponent } from './student-gradebook/confirm-dialog/confirm-dialog.component';
import { AvgScoreComponent } from './student-gradebook/avg-score/avg-score.component';
import { EvaluateComponent } from './student-profile/student-score/evaluate/evaluate.component';
import { NumbericDirective } from './student-gradebook/input-score/numberic.directive';

@NgModule({
  declarations: [
    ImportFileStudentComponent,
    StudentGradebookComponent,
    InputScoreComponent,
    InputRankComponent,
    ActionEvaluateComponent,
    PopupEvaluateComponent,
    HeaderCheckboxComponent,
    CheckboxColumnComponent,
    ConfirmDialogComponent,
    AvgScoreComponent,
    EvaluateComponent,
    NumbericDirective
  ],
  imports: [
    CommonModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    AngularFileUploaderModule,
    AgGridModule.withComponents([]),
    ModalModule.forRoot(),
    AgGridModule.withComponents([]),
    StudentProfileModule,
    TranslateModule,
    MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule,
    MatCheckboxModule, MatPaginatorModule, MatAutocompleteModule, MatRadioModule, ReactiveFormsModule, NgbModule, MatTooltipModule
  ],
  entryComponents:
    [
      ActionStudentComponent,
      ImportFileStudentComponent,
      InputScoreComponent,
      InputRankComponent,
      ActionEvaluateComponent,
      PopupEvaluateComponent,
      HeaderCheckboxComponent,
      CheckboxColumnComponent,
      ConfirmDialogComponent,
      AvgScoreComponent,
      EvaluateComponent
    ],
  providers: [
  ]
})
export class StudentsModule { }
