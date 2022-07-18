import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {SystemComponent} from './system.component';
import {CommonModule} from '@angular/common';
import {ClassRoomComponent} from './class-room/class-room.component';
import {PanelBarModule, TabStripModule} from '@progress/kendo-angular-layout';
import {ButtonsModule} from '@progress/kendo-angular-buttons';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbCollapseModule, NgbDateParserFormatter, NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DialogModule} from '@progress/kendo-angular-dialog';
import {DropDownListModule, DropDownsModule,} from '@progress/kendo-angular-dropdowns';
import {FormFieldModule, InputsModule, TextBoxModule,} from '@progress/kendo-angular-inputs';
// import {SchoolInfoModule} from './school-information/school-info.module';
import {LayoutModule} from '@angular/cdk/layout';
import {LabelModule} from '@progress/kendo-angular-label';
import {HttpClientModule} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';
import {DateInputsModule} from '@progress/kendo-angular-dateinputs';
import {environment} from '../../../../environments/environment';
import {
  BodyModule,
  ColumnResizingService,
  FilterMenuModule,
  GridModule,
  PagerModule,
  SharedModule,
} from '@progress/kendo-angular-grid';
import {SubjectDeclarationComponent} from './subject-declaration/subject-declaration.component';
import {ScoreboardComponent} from './system-configuration/scoreboard/scoreboard.component';
import {MatSelectModule} from '@angular/material/select';
import {ActionShoolComponent} from './school/action-shool/action-shool.component';
import {SchoolComponent} from './school/school.component';
import {SystemConfigurationComponent} from './system-configuration/system-configuration.component';
import {TeachersComponent} from './teachers/teachers.component';
import {StudentsComponent} from './students/students.component';
import {ContactComponent} from './contact/contact.component';
import {OfficialLetterDocumentComponent} from './official-letter-document/official-letter-document.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {AgGridModule} from 'ag-grid-angular';
import {ModalModule} from 'ngx-bootstrap/modal';
import {MatFormFieldModule} from '@angular/material/form-field';

import {ScoreboardModule} from './system-configuration/scoreboard/scoreboard.module';
import {ActionTeacherComponent} from './teachers/action-teacher/action-teacher.component';
import {TeacherProfileComponent} from './teachers/teacher-profile/teacher-profile.component';
import {TeachingAssignmentComponent} from './teachers/teaching-assignment/teaching-assignment.component';
import {ManageContactComponent} from './system-configuration/manage-contact/manage-contact.component';
import {ActionManageContactComponent} from './system-configuration/manage-contact/action-manage-contact/action-manage-contact.component';
import {HistoryContactPackageComponent} from './system-configuration/manage-contact/history-contact-package/history-contact-package.component';
import {ActionTeachingAssignmentComponent} from './teachers/teaching-assignment/action-teaching-assignment/action-teaching-assignment.component';
import {ImportTeachingAssignmentComponent} from './teachers/teaching-assignment/import-teaching-assignment/import-teaching-assignment.component';
import {SchoolYearComponent} from './school-year/school-year.component';
import {ConfigPointLockComponent} from './config-point-lock/config-point-lock.component';
import {SchoolYearModule} from './school-year/school-year.module';
import {MatOptionModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {StudentsModule} from './students/students.module';
import {ActionStudentComponent} from './students/action-student/action-student.component';
import 'ag-grid-enterprise';
import {SubjectDeclarationModule} from './subject-declaration/subject-declaration.module';
import {StudentProfileComponent} from './students/student-profile/student-profile.component';
import {TooltipComponent} from './class-room/tooltip/tooltip.component';
import {CreateUpdateTeachersComponent} from './teachers/create-update-teachers/create-update-teachers.component';
import {CreateUpdateStudentComponent} from './students/create-update-students/create-update-student.component';
import {NzTreeSelectModule} from 'ng-zorro-antd/tree-select';
import {TranslateModule} from '@ngx-translate/core';
import {TeacherRatingsComponent} from './teachers/teacher-ratings/teacher-ratings.component';
import {ButtonRendererComponent} from './teachers/teacher-ratings/button-renderer/button-renderer.component';
import {ScheduleTimetableComponent} from './school/schedule-timetable/schedule-timetable.component';
import {ModalImportComponent} from './school/schedule-timetable/modal-import/modal-import.component';
import {SelectScheduleTimetableComponent} from './school/schedule-timetable/select-schedule-timetable/select-schedule-timetable.component';
import {SystemsDirective} from './systems.directive';
import {StudentGradebookComponent} from './students/student-gradebook/student-gradebook.component';
import {AttendanceStudentComponent} from './attendance-student/attendance-student.component';
import {AttendanceStudentModule} from './attendance-student/attendance-student.module';
import {CoreModule} from '../../../core/core.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SendMailComponent} from "./contact/send-mail/send-mail.component";
import {DefaultTreeviewI18n, TreeviewModule} from "ngx-treeview";
import {EditorModule} from "@progress/kendo-angular-editor";
import {TreeViewComponent} from './contact/tree-view/tree-view.component';
import {ContactGroupComponent} from './contact/contact-group/contact-group.component';
import {GroupActionComponent} from './contact/contact-group/group-action/group-action.component';
import {ViewDetailGroupComponent} from './contact/contact-group/view-detail-group/view-detail-group.component';
import {CreateGroupComponent} from "./contact/contact-group/create-group/create-group.component";
import {BtnCellRendererComponent} from "./contact/contact-group/create-group/btn-cell-renderer.component";
import {ViewFileComponent} from './teachers/teacher-profile/view-file/view-file.component';
import {AccountManagementComponent} from './account-management/account-management.component';
import {ConductAssessmentComponent} from './students/conduct-assessment/conduct-assessment.component';
import {ConductAssessmentModule} from './students/conduct-assessment/conduct-assessment.module';
import {DownloadButtonRenderComponent} from './official-letter-document/download-button-render/download-button-render.component';
import {ActionOfficalLetterDocumentComponent} from './official-letter-document/action-offical-letter-document/action-offical-letter-document.component';
import {AccountManagementModule} from './account-management/account-management.module';
import {ChangePasswordComponent} from "../auth/change-password/change-password.component";
import {AcademicAbilitiesComponent} from "./academic-abilities/academic-abilities.component";
import {AcademicAbilitiesModule} from "./academic-abilities/academic-abilities.module";
import {CreateOfficalLetterComponent} from './official-letter-document/create-offical-letter/create-offical-letter.component';
import {ListTeacherSendMailComponent} from "./contact/send-mail/list-teacher-send-mail/list-teacher-send-mail.component";
import {ReportsComponent} from './reports/reports.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ViewTimetableComponent} from './school/view-timetable/view-timetable.component';
import {ClassReportComponent} from "./class-report/class-report.component";
import {ClassReportModule} from "./class-report/class-report.module";
import {SendMailParentsComponent} from "./contact-parents/send-mail/send-mail-parents.component";
import {ListTeacherSendMailParentsComponent} from "./contact-parents/send-mail/list-teacher-send-mail-parents/list-teacher-send-mail-parents.component";
import {DiligenceComponent} from './diligence/diligence.component';
import {DiligenceModule} from './diligence/diligence.module';
import {ReasonRendererComponent} from './teachers/teacher-ratings/reason-renderer/reason-renderer.component';
import {InboxStudentComponent} from './school/inbox-student/inbox-student.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import {AuthGuard} from "../../../core/auth";
import {InboxAdminComponent} from './school/inbox-admin/inbox-admin.component';
import {ModalSeeMoreTeacherComponent} from './school/inbox-admin/modal-see-more-teacher/modal-see-more-teacher.component';
import {ContactGroupParentsComponent} from "./contact-parents/contact-group-parents/contact-group-parents.component";
import {CreateGroupParentsComponent} from "./contact-parents/contact-group-parents/create-group-parents/create-group-parents.component";
import {GroupActionParentsComponent} from "./contact-parents/contact-group-parents/group-action-parents/group-action-parents.component";
import {ViewDetailGroupParentsComponent} from "./contact-parents/contact-group-parents/view-detail-group-parents/view-detail-group-parents.component";
import {ModalSeeMoreComponent} from './school/inbox-teacher/modal-see-more-teacher/modal-see-more.component';
import {InboxTeacherComponent} from './school/inbox-teacher/inbox-teacher.component';
import {PartialsModule} from "../../partials/partials.module";
import { BtnDeleteComponent } from './contact-parents/send-mail/list-teacher-send-mail-parents/btn-delete/btn-delete.component';
import {TooltipTeacherComponent} from './teachers/teacher-profile/tooltip-teacher/tooltip-teacher.component';
import { ButtonRendererComponent2 } from './teachers/teacher-ratings/button-renderer-2/button-renderer.component2';
import {TeachingTimetableComponent} from "./teachers/teaching-timetable/container/teaching-timetable.component";
import {TeachingTimetableModule} from "./teachers/teaching-timetable/teaching-timetable.module";
import {InboxOtherComponent} from './school/inbox-other/inbox-other.component';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TransferStudentNotifyComponent} from './students/transfer-students/components/transfer-student-notify/transfer-student-notify.component';
import { DialogDateComponent } from './share/dialog-date/dialog-date.component';
import { Date2Component } from './share/date2/date2.component';
import {NgbDateMomentParserFormatter} from "./share/date2/datePickerFormat";


const roleParam = environment.ROLE;
const ADMIN = roleParam.ADMIN;
const GV_CN = roleParam.GV_CN;
const GV_BM = roleParam.GV_BM;
const HP = roleParam.HP;
const HT = roleParam.HT;
const PH = roleParam.PH;
const TK = roleParam.TK;
const routes: Routes = [
  // {
  //   path: '',
  //   component: SystemComponent,
  // },
  // {
  //   path: 'subject',
  //   component: SubjectComponent,
  // },
  {
    path: 'school/subject-declaration',
    component: SubjectDeclarationComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'school/class-room',
    component: ClassRoomComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'school/configuration',
    component: SchoolComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN]},
  },
  {
    path: 'system-configuration',
    component: SystemConfigurationComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN]},
  },
  {
    path: 'teacher/teacher-management',
    component: TeachersComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT, HP, TK]},
  },
  {
    path: 'diligence',
    component: DiligenceComponent,
    canActivate: [AuthGuard],
    data: {roles: [PH]},
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT, HP, GV_BM, GV_CN, TK]},
    children: [
      {
        path: 'school-report',
        loadChildren: () => import('./reports/reports.module')
          .then(m => m.ReportsModule),
      },
      {
        path: 'class-report',
        loadChildren: () => import('./class-report/class-report.module')
          .then(m => m.ClassReportModule),
      },
      {
        path: 'class-report/:id',
        loadChildren: () => import('./class-report/class-report.module')
          .then(m => m.ClassReportModule),
      }
    ]
  },
  {
    path: 'student/student-management',
    component: StudentsComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT, HP, GV_BM, GV_CN, TK]},
  },
  {
    path: 'student/student-profile/:id/:year',
    component: StudentProfileComponent,
  },
  {
    path: 'student/create-update-student',
    component: CreateUpdateStudentComponent,
  },
  {
    path: 'student/create-update-student/:id',
    component: CreateUpdateStudentComponent,
  },
  {
    path: 'student/students-gradebook',
    component: StudentGradebookComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, GV_CN, HT, GV_BM]},
  },
  {
    path: 'student/attendance-student',
    component: AttendanceStudentComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, GV_CN, HT]},
  },
  {
    path: 'official-letter-document',
    component: OfficialLetterDocumentComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT, HP, GV_BM, GV_CN, TK]},
  },
  // {
  //   path: 'contact',
  //   component: ContactComponent,
  // },
  {
    path: 'school/school-year',
    component: SchoolYearComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'system-configuration/scoreboard',
    component: ScoreboardComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'system-configuration/manage-contact',
    component: ManageContactComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'teacher/teacher-profile/:id',
    component: TeacherProfileComponent,
  },
  {
    path: 'teacher/teaching-assignment',
    component: TeachingAssignmentComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'teacher/create-update-teacher',
    component: CreateUpdateTeachersComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'system-configuration/config-point-lock',
    component: ConfigPointLockComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'teacher/teacher-ratings',
    component: TeacherRatingsComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT, HP, TK, GV_BM, GV_CN]},
  },
  {
    path: 'school/schedule-timetable',
    component: ScheduleTimetableComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'school/view-timetable',
    component: ViewTimetableComponent,
    canActivate: [AuthGuard],
    data: {roles: [PH]},
  },
  {
    path: 'school/inbox-student',
    component: InboxStudentComponent,
    canActivate: [AuthGuard],
    data: {roles: [PH]},
  },
  {
    path: 'school/inbox-other',
    component: InboxOtherComponent,
    canActivate: [AuthGuard],
    data: {roles: [HP, TK, GV_BM]},
  },
  {
    path: 'school/inbox-admin',
    component: InboxAdminComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN]},
  },
  {
    path: 'school/inbox-teacher',
    component: InboxTeacherComponent,
    canActivate: [AuthGuard],
    data: {roles: [HT, GV_CN]},
  },
  {
    path: 'contact/send-mail',
    component: SendMailComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN,HT]},
  },
  {
    path: 'contact/contact-group',
    component: ContactGroupComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT]},
  },
  {
    path: 'contact-parents/send-mail',
    component: SendMailParentsComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, GV_CN, HT]},
  },
  {
    path: 'contact-parents/contact-group',
    component: ContactGroupParentsComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, GV_CN, HT]},
  },
  {
    path: 'account/account-management',
    component: AccountManagementComponent,
  },
  {
    path: 'student/conduct-assessment',
    component: ConductAssessmentComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, GV_CN, HT]},
  },
  {
    path: 'account/change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'student/academic-abilities',
    component: AcademicAbilitiesComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, GV_CN, HT]},
  },
  {
    path: 'teacher/teaching-timetable',
    component: TeachingTimetableComponent,
    canActivate: [AuthGuard],
    data: {roles: [ADMIN, HT, HP, TK, GV_BM, GV_CN]}
  },
  {
    path: 'student',
    children: [
      {
        path: 'transfer-students',
        canActivate: [AuthGuard],
        data: {roles: [ADMIN, HT]},
        loadChildren: () => import('./students/transfer-students/transfer-students.module')
          .then(m => m.TransferStudentsModule),
      }
    ]
  },
  {
    path: 'parents',
    loadChildren: () => import('./parents/parents.module').then(m => m.ParentsModule),
  },
  // Them moi 1 path thi can phan quyen nhu ben menu.config.ts
  {path: '', redirectTo: 'system', pathMatch: 'full'},
  {path: '**', redirectTo: 'system', pathMatch: 'full'},
];

@NgModule({
  providers: [ColumnResizingService, TreeViewComponent, DefaultTreeviewI18n,
    {
      provide: NgbDateParserFormatter,
      useFactory: () => { return new NgbDateMomentParserFormatter("DD/MM/YYYY") }
    }

  ],
  declarations: [
    InboxOtherComponent,
    TeachingTimetableComponent,
    InboxTeacherComponent,
    ModalSeeMoreComponent,
    ModalSeeMoreTeacherComponent,
    InboxStudentComponent,
    InboxAdminComponent,
    SelectScheduleTimetableComponent,
    ScheduleTimetableComponent,
    ViewTimetableComponent,
    SystemComponent,
    SubjectDeclarationComponent,
    SchoolComponent,
    SystemConfigurationComponent,
    SchoolComponent,
    SystemConfigurationComponent,
    TeacherRatingsComponent,
    ButtonRendererComponent,
    ButtonRendererComponent2,
    TeachersComponent,
    StudentsComponent,
    OfficialLetterDocumentComponent,
    ContactComponent,
    ReportsComponent,
    DiligenceComponent,
    ActionShoolComponent,
    ScoreboardComponent,
    ActionTeacherComponent,
    ActionStudentComponent,
    TeacherProfileComponent,
    TeachingAssignmentComponent,
    ManageContactComponent,
    ActionTeachingAssignmentComponent,
    ImportTeachingAssignmentComponent,
    ActionManageContactComponent,
    HistoryContactPackageComponent,
    ConfigPointLockComponent,
    SystemConfigurationComponent,
    SubjectDeclarationComponent,
    SchoolComponent,
    CreateUpdateTeachersComponent,
    CreateUpdateStudentComponent,
    SystemsDirective,
    ModalImportComponent,
    AttendanceStudentComponent,
    SendMailComponent,
    SendMailParentsComponent,
    TreeViewComponent,
    ContactGroupComponent,
    GroupActionComponent,
    ViewDetailGroupComponent,
    CreateGroupComponent,
    BtnCellRendererComponent,
    AttendanceStudentComponent,
    ViewFileComponent,
    AccountManagementComponent,
    ConductAssessmentComponent,
    DownloadButtonRenderComponent,
    ActionOfficalLetterDocumentComponent,
    ChangePasswordComponent,
    AcademicAbilitiesComponent,
    CreateOfficalLetterComponent,
    ListTeacherSendMailComponent,
    ListTeacherSendMailParentsComponent,
    ClassReportComponent,
    ReasonRendererComponent,	ContactGroupParentsComponent,
    CreateGroupParentsComponent,
    GroupActionParentsComponent,
    ViewDetailGroupParentsComponent,
    BtnDeleteComponent,
	TooltipTeacherComponent,
	DialogDateComponent,
	Date2Component  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ScoreboardModule,
        SchoolYearModule,
        InputsModule,
        LabelModule,
        FilterMenuModule,
        NgbModule,
        InputsModule,
        LabelModule,
        FilterMenuModule,
        HttpClientModule,
        NgSelectModule,
        NzTreeSelectModule,
        AngularFileUploaderModule,
        AgGridModule.withComponents([TooltipComponent, BtnCellRendererComponent]),
        ModalModule.forRoot(),
        NgxsModule.forRoot([], {
            developmentMode: !environment.production,
        }),
        FormsModule,
        NgbModalModule,
        NgbCollapseModule,
        TabStripModule,
        PanelBarModule,
        LayoutModule,
        GridModule,
        ButtonsModule,
        DropDownsModule,
        DateInputsModule,
        SharedModule,
        DialogModule,
        DropDownListModule,
        FormFieldModule,
        ReactiveFormsModule,
        TextBoxModule,
        BodyModule,
        PagerModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatRadioModule,
        SubjectDeclarationModule,
        StudentsModule,
        TranslateModule,
        AttendanceStudentModule,
        CoreModule,
        MatTooltipModule,
        EditorModule,
        AngularFileUploaderModule,
        TreeviewModule.forRoot(),
        MatTooltipModule,
        ConductAssessmentModule,
        AccountManagementModule,
        AcademicAbilitiesModule,
        MatProgressSpinnerModule,
        ClassReportModule,
        DiligenceModule,
        AngularEditorModule,
        PartialsModule,
        TeachingTimetableModule,
        TooltipModule
    ],
  entryComponents: [
    ModalSeeMoreComponent,
    ModalSeeMoreTeacherComponent,
    SelectScheduleTimetableComponent,
    ModalImportComponent,
    ButtonRendererComponent,
    ActionShoolComponent,
    ActionTeachingAssignmentComponent,
    ActionManageContactComponent,
    HistoryContactPackageComponent,
    ActionTeacherComponent,
    ActionStudentComponent,
    ImportTeachingAssignmentComponent,
    GroupActionComponent,
    ViewDetailGroupComponent,
    CreateGroupComponent,
    ViewFileComponent,
    DownloadButtonRenderComponent,
    ActionOfficalLetterDocumentComponent,
    AccountManagementComponent,
    ChangePasswordComponent,
    CreateOfficalLetterComponent,
    ListTeacherSendMailComponent,
    ListTeacherSendMailParentsComponent,
	ReasonRendererComponent,
    CreateGroupParentsComponent,
    GroupActionParentsComponent,
    ViewDetailGroupParentsComponent,
    ButtonRendererComponent2,
	TooltipTeacherComponent,
    TransferStudentNotifyComponent
  ],
})
export class SystemModule {
}
