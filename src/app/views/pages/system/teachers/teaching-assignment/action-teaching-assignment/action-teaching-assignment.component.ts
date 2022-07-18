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
import { TeachingAssignmentComponent } from '../teaching-assignment.component';
import { TeachingAssignmentService } from 'src/app/core/service/service-model/teaching-assignment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-action-teaching-assignment',
  templateUrl: './action-teaching-assignment.component.html',
  styleUrls: ['./action-teaching-assignment.component.scss'],
})
export class ActionTeachingAssignmentComponent
  implements OnInit, ICellRendererAngularComp
{
  @ViewChild('modalUpdateTeachingAssignment') public selectedTeachingAssignment: ModalDirective;
  modalRef: BsModalRef;
  rowIndex;
  isDisable = false;
  constructor(
    private modalService: BsModalService,
    private teachingAssignmentComponent: TeachingAssignmentComponent,
    private teachingAssignmentService: TeachingAssignmentService,
    private toastr: ToastrService
  ) {}

  TeachingAssignmentComponent;

  cellValue;

  ngOnInit() {}

  // gets called once before the renderer is used
  agInit(params): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex+1;
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

  openModalUpdate() {
    // @ts-ignore
    this.isDisable = true;
    this.teachingAssignmentComponent.openModalUpdateTeachingAssignment(this.cellValue);
  }

  deteleTeachingAssignment() {
    console.log('cellValue', this.cellValue);
    this.teachingAssignmentService
      .deteleTeachingAssignment(this.cellValue.id)
      .subscribe((responseAPI) => {
        console.log('aaa', responseAPI);
        if (responseAPI.status === 'OK') {
          this.teachingAssignmentComponent.findTeachingAssignment(1);
          this.toastr.success(responseAPI.message);
          this.modalRef.hide();
        } else {
          this.toastr.error(responseAPI.message);
        }
      });
  }
}
