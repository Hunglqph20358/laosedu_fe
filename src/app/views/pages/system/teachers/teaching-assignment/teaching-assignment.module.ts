import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { TeachingAssignmentComponent } from './teaching-assignment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routers = [
  {
    path: '',
    component: TeachingAssignmentComponent,
  },
];

@NgModule({
  declarations: [TeachingAssignmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routers),
    AgGridModule.withComponents([]),
    MatDialogModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
  ],
})
export class TeachingAssignmentModule {}
