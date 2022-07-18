import { Component, OnInit } from '@angular/core';
import {StudentsService} from "../../../../../../core/service/service-model/students.service";

@Component({
  selector: 'kt-header-checkbox',
  templateUrl: './header-checkbox.component.html',
  styleUrls: ['./header-checkbox.component.scss']
})
export class HeaderCheckboxComponent implements OnInit {
  params;
  checked = false;
  constructor(private studentService: StudentsService) { }

  ngOnInit(): void {
    this.studentService.isAllSelected$.subscribe(val => {
      this.checked = val
    });

  }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params) {
    return true
  }
}
