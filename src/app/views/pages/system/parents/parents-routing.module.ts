import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ParentsComponent} from "./parents.component";
import { ParentsStudentProfileComponent } from './student-profile/parents-student-profile.component';
import { StudentProfileComponent } from '../students/student-profile/student-profile.component';

const routes: Routes = [
  {
    path: 'home',
    component: ParentsComponent,
  },
  {
    path: 'student-profile/:id/:year',
    component: StudentProfileComponent,
  },
  {
    path: 'student-profile',
    component: ParentsStudentProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ParentsRoutingModule { }
