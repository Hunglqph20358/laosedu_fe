import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ClassRoomComponent} from './class-room.component';
import {DeleteClassRoomComponent} from './delete-class-room/delete-class-room.component';
import {UpdateClassComponent} from './update-class/update-class.component';
import {NgbActiveModal, NgbCollapseModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {DropDownListModule} from '@progress/kendo-angular-dropdowns';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {ButtonModule} from '@progress/kendo-angular-buttons';
import {ModalModule} from 'ngx-bootstrap/modal';
import {NgSelectModule} from '@ng-select/ng-select';
import { SelectActionComponent } from './select-action/select-action.component';
import { ImportFileComponent } from './import-file/import-file.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import { TransferClassroomComponent } from './transfer-classroom/transfer-classroom.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from "@angular/material/tooltip";
import { TooltipComponent } from './tooltip/tooltip.component';
import { NavigateSubjectComponent } from './navigate-subject/navigate-subject.component';
import { NavigateStudentComponent } from './navigate-student/navigate-student.component';
import { NavigateSchedualComponent } from './navigate-schedual/navigate-schedual.component';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: ClassRoomComponent,
  }
]

@NgModule({
  declarations: [
    UpdateClassComponent,
    DeleteClassRoomComponent,
    SelectActionComponent,
    ImportFileComponent,
    TransferClassroomComponent,
    TooltipComponent,
    NavigateSubjectComponent,
    NavigateStudentComponent,
    NavigateSchedualComponent
  ],
    imports: [
        CommonModule,
        NgbModalModule,
        RouterModule.forChild(routes),
        DropDownListModule,
        MatExpansionModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        NgbCollapseModule,
        ButtonModule,
        ModalModule,
        NgSelectModule,
        AngularFileUploaderModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatTooltipModule,
        TranslateModule
    ],

  exports: [
    UpdateClassComponent,
    MatFormFieldModule,
    MatInputModule
  ],
  entryComponents: [
    UpdateClassComponent,
    DeleteClassRoomComponent,
    SelectActionComponent,
    ImportFileComponent,
    TransferClassroomComponent,
    TooltipComponent,
    NavigateSubjectComponent,
    NavigateStudentComponent,
    NavigateSchedualComponent,
  ],
  providers:[NgbActiveModal,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ClassRoomModule {
}
