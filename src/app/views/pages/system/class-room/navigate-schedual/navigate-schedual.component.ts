import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'kt-navigate-schedual',
  templateUrl: './navigate-schedual.component.html',
  styleUrls: ['./navigate-schedual.component.scss']
})
export class NavigateSchedualComponent implements OnInit {
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

  navigateSchedual() {
    this.router.navigateByUrl('/system/school/schedule-timetable', { state: this.rowSelect });
  }
}
