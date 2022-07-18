import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {DeleteClassRoomComponent} from '../../../class-room/delete-class-room/delete-class-room.component';
import {MatDialog} from '@angular/material/dialog';
import {ContactGroupService} from '../../../../../../core/service/service-model/contact-group.service';
import {ToastrService} from 'ngx-toastr';
import {TreeviewItem} from 'ngx-treeview';
import {CreateGroupParentsComponent} from '../create-group-parents/create-group-parents.component';
import {ContactGroupParentService} from '../../../../../../core/service/service-model/contact-parent-group.service';
import {ClassroomService} from '../../../../../../core/service/service-model/classroom.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-group-action-parents',
  templateUrl: './group-action-parents.component.html',
  styleUrls: ['./group-action-parents.component.scss']
})
export class GroupActionParentsComponent implements OnInit, ICellRendererAngularComp {

  rowSelect: any = {};
  rowIndex;
  items: any = []
  listTreeViewTeacherRaw = [];
  constructor(
    private matDialog: MatDialog,
    private contactGroupParentService: ContactGroupParentService,
    private toast: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private classRoomService: ClassroomService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
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

  // Delete classroom
  openConfirmDelete() {
    const dataConfirm = {title: this.translate.instant(`PARENT_CONTACT.TITLE_DELETE`), message: this.translate.instant(`PARENT_CONTACT.CONFIRM_DELETE`)};
    this.matDialog.open(DeleteClassRoomComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        const listGroupDelete = [];
        listGroupDelete.push(this.rowSelect);
        // Call API
        this.contactGroupParentService.deleteContactGroup({listGroupDelete}).subscribe(resAPI => {
          if (resAPI.status === 'OK') {
            this.toast.success(resAPI.message);
          } else if (resAPI.status === 'BAD_REQUEST') {
            this.toast.error(resAPI.message);
          }
          this.contactGroupParentService.changeIsDelete(true);
        });
      }
    });
  }

  updateContactGroup(action: string) {
    this.rowSelect.action = action;
    this.rowSelect.items = this.items;
    this.matDialog.open(CreateGroupParentsComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: this.rowSelect,
      height: '739px',
      panelClass:'school-year'
    }).afterClosed().subscribe(res => {
      /*if (res.event === 'confirm') {
        // Call API
        const listGroupDelete = [];
        listGroupDelete.push(this.rowSelect);
        this.contactGroupService.add({listGroupDelete}).subscribe(resAPI => {
          console.log(resAPI);
          if (resAPI.status === 'OK') {
            this.toast.success(resAPI.message);
            this.contactGroupService.changeIsDelete(true);
          }else if (resAPI.status === 'BAD_REQUEST') {
            this.toast.error(resAPI.message);
          }
        });
      }*/
    });
  }

  getListTeacherTreeView(): void {
    const currentYear = this.classRoomService.yearCurrent.getValue();
    this.contactGroupParentService.getListParentTreeView(currentYear).subscribe(res => {
      console.log(res);
      this.listTreeViewTeacherRaw = res.body.response;
      this.items = res.body.response?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item,  true)));
      this.changeDetectorRef.detectChanges();
    })
  }

  transformToTreeViewItems(data: any,  isRoot: boolean): any {
    const children = (data.children ?? data.teacherDTOList)?.map(child => this.transformToTreeViewItems(child, false));
    const text = data.title ?? data.code + ' - ' + data.fullName ?? '';
    const value = {
      code: data.type ?? data.code ?? '',
      id: data.id,
      deptId: data.deptId,
      deptCode: data.deptCode,
      deptName: data.deptName,
      isRoot,
      isTeacher: data.fullName && data.code,
      totalTeachersOfUnit: isRoot ? data.totalTeachersOfUnit : null,
      text
    };
    return {...data, text , value, checked:false, children};
  }
}
