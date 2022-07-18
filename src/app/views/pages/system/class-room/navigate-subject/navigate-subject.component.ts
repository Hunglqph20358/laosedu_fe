import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'kt-navigate-subject',
  templateUrl: './navigate-subject.component.html',
  styleUrls: ['./navigate-subject.component.scss']
})
export class NavigateSubjectComponent implements OnInit {
  rowSelect;
  rowIndex;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  // gets called once before the renderer is used
  agInit(params ): void {
    this.rowSelect = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  navigateSubject() {
    this.router.navigateByUrl('/system/school/subject-declaration', { state: this.rowSelect });
  }
}
