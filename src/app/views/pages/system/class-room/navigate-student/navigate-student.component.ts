import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'kt-navigate-student',
  templateUrl: './navigate-student.component.html',
  styleUrls: ['./navigate-student.component.scss']
})
export class NavigateStudentComponent implements OnInit {
  rowSelect;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  // gets called once before the renderer is used
  agInit(params ): void {
    this.rowSelect = params.data;
  }

  navigateStudentList() {
    this.router.navigateByUrl('/system/student/student-management', { state: this.rowSelect });
  }
}
