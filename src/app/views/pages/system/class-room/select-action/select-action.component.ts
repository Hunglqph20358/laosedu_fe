import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ClassroomService} from "../../../../../core/service/service-model/classroom.service";
import {MatDialog} from "@angular/material/dialog";
import {UpdateClassComponent} from "../update-class/update-class.component";
import {DeleteClassRoomComponent} from "../delete-class-room/delete-class-room.component";
import {Subscription} from "rxjs";
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from "@ngx-translate/core";
import {ClassRoomComponent} from "../class-room.component";

@Component({
  selector: 'kt-select-action',
  templateUrl: './select-action.component.html',
  styleUrls: ['./select-action.component.scss']
})
export class SelectActionComponent implements OnInit, ICellRendererAngularComp {

  rowSelect: any = {};

  gradeList: any = [];
  dataSearch = {
    years: 2021,
    name: ''
  }
  isUpdate = false;
  displaySL = false;

  rowIndex;
  constructor(private classroomService: ClassroomService,
              private matDialog: MatDialog,
              private toast: ToastrService,
              private translate: TranslateService,
              private classroomComponent: ClassRoomComponent) { }

  ngOnInit() {
    this.classroomService.onSearch(this.dataSearch, 0, 5).subscribe(res => {
      this.gradeList = res.gradeLevelList;
    });
  }

  // gets called once before the renderer is used
  agInit(params ): void {
    this.rowSelect = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true
  }

  // Update classroom
  updateClassroom(action: string) {
    this.rowSelect.action = action;
    this.rowSelect.gradeList = this.gradeList;
    console.log(this.rowSelect);
    this.matDialog.open(UpdateClassComponent, {
      data: this.rowSelect,
      disableClose: true,
      hasBackdrop: true,
      width: '446px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'edit') {
        console.log(res.data, 'update xong');
        this.classroomService.changeIsUpdate(true);
        this.toast.success(res.data.message);
      }
    });
  }
  // Delete classroom
  openConfirmDelete() {
    const dataConfirm = {title: this.translate.instant('CLASSROOM.MSG.DELETE_CLASS'), message: this.translate.instant('CLASSROOM.MSG.CONFIRM_DELETE')};
    this.matDialog.open(DeleteClassRoomComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        // Call API
        this.classroomService.deleteClassroom(this.rowSelect.id).subscribe(resAPI => {
          console.log(resAPI);
          if (resAPI.status === 'OK') {
            this.toast.success(resAPI.message);
            this.classroomComponent.listeningIsDelete();
          }else if (resAPI.status === 'BAD_REQUEST') {
            this.toast.error(resAPI.message);
          }
        });
      }
    });
  }
}
