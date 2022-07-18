import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PopupEvaluateComponent} from "../popup-evaluate/popup-evaluate.component";
import {StudentsService} from "../../../../../../core/service/service-model/students.service";
import {TranslateService} from "@ngx-translate/core";
import {StudentGradebookComponent} from "../student-gradebook.component";

@Component({
  selector: 'kt-action-evaluate',
  templateUrl: './action-evaluate.component.html',
  styleUrls: ['./action-evaluate.component.scss']
})
export class ActionEvaluateComponent implements OnInit {

  rowSelect;
  studentName;
  showButton;
  rowIndex;
  isUpdate;

  fullYearSemester;
  constructor(private matDialog: MatDialog,
              private studentService: StudentsService,
              private translate: TranslateService,
              private gradebookComponent: StudentGradebookComponent) {
    this.fullYearSemester = this.translate.instant('GRADEBOOK.FULL_YEAR');
  }

  ngOnInit(): void {
    this.showButton = false;
    this.studentService.changeIsShowUpdate$.subscribe(value => {
      // console.log(this.isUpdate);
      this.isUpdate = value;
    })
  }

  agInit(params ): void {
    this.rowSelect = params.data;
    this.studentName = this.rowSelect.studentName;
    this.rowIndex = +params.rowIndex + 1;
  }

  showPopup() {
    this.matDialog.open(PopupEvaluateComponent, {
      data: this.rowSelect,
      disableClose: true,
      hasBackdrop: true,
      width: '466px'
    }).afterClosed().subscribe(obj => {
      if (obj.event === 'confirm') {
        if (!obj.isSave) {
          console.log('chỉ lưu đánh giá')
          this.gradebookComponent.doSearch(1);
        } else {
          console.log('Lưu điểm r đánh giá')
          this.gradebookComponent.saveBeforeEvaluate();
        }
      }
    });
  }
}
