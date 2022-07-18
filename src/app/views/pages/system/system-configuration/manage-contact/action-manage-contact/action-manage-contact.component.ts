import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { ManageContactComponent } from '../manage-contact.component';
import { ManageContactService } from 'src/app/core/service/service-model/manage-contact.service';
import { ToastrService } from 'ngx-toastr';
import {environment} from "../../../../../../../environments/environment";

@Component({
  selector: 'kt-action-manage-contact',
  templateUrl: './action-manage-contact.component.html',
  styleUrls: ['./action-manage-contact.component.scss'],
})
export class ActionManageContactComponent
  implements OnInit, ICellRendererAngularComp
{
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private manageContactComponent: ManageContactComponent,
    private manageContactService: ManageContactService,
    private toastr: ToastrService
  ) {}

  ManageContactComponent;

  private SCHOOL_CODE = `${environment.SCHOOL_CODE}`;

  cellValue;
  showRegister = true;
  showCancel = true;
  rowIndex;

  ngOnInit() {}

  // gets called once before the renderer is used
  agInit(params): void {
    this.cellValue = params.data;
    if (this.cellValue.status === 2 && this.cellValue.semester === 5) {
      this.showRegister = false;
    }

    if (
      this.cellValue.status === 3 ||
      this.cellValue.status === null ||
      this.cellValue.status === 0
    ) {
      this.showCancel = false;
    }
    this.rowIndex = +params.rowIndex + 1;
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true;
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }

  // openModalUpdate() {
  //   // @ts-ignore
  //   console.log(`this.cellValue`, this.cellValue);
  //   this.manageContactComponent.openModalRegisterPackage(
  //     [this.cellValue.id],
  //     this.cellValue.status || 0
  //   );
  // }

  openModalUpdate() {
    // @ts-ignore
    console.log(`this.cellValue`, this.cellValue);
    this.manageContactComponent.openModalRegisterPackage(
      this.cellValue
    );
  }

  deteleContactPackage() {
    console.log('cellValue', this.cellValue);
    const dataDelete = {
      studentId: this.cellValue.id,
      status: this.cellValue.status,
      shoolYear: this.cellValue.currentYear,
      schoolCode : this.SCHOOL_CODE,
    };
    console.log('dataDelete', dataDelete);
    this.manageContactService
      .deteleContactPackage(dataDelete)
      .subscribe((responseAPI) => {
        console.log('aaa', responseAPI);
        if (responseAPI.status === 'OK') {
          this.manageContactComponent.findListContacts(1);
          this.toastr.success(responseAPI.message);
          this.modalRef.hide();
        } else {
          this.toastr.error(responseAPI.message);
          this.modalRef.hide();
        }
      });
  }
}
