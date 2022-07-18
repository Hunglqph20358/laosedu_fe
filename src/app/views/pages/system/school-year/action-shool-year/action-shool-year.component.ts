import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { CreateSchoolYearComponent } from '../create-school-year/create-school-year.component';
@Component({
  selector: 'kt-action-shool-year',
  templateUrl: './action-shool-year.component.html',
  styleUrls: ['./action-shool-year.component.scss']
})
export class ActionShoolYearComponent implements OnInit, ICellRendererAngularComp {

  editable: boolean = true;
  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
  }


  cellValue: any;

  // gets called once before the renderer is used
  agInit(params ): void {
      this.cellValue = params

      const dateNow = new Date();

      // create Date with the FromDate of first semester
      const fromDate = new Date( params.data.semesters[0].from_date )

      // check FromDate and Date Now
      if (fromDate.getTime() < dateNow.getTime()) {
        this.editable = false
      }
  }

  // gets called whenever the cell refreshes
  refresh(params) {
      // set value into cell again
      return true
  }

  open(): void {

    if (!this.editable) {
      return
    }

    this.dialog.open(CreateSchoolYearComponent, {
      panelClass: 'school-year',
      width: '466px',
      height: '586px',
      data: {
        schoolYear: this.cellValue.data
      }
    }).afterClosed().subscribe(() => {
      this.cellValue.context.componentParent.ngOnInit()
    })
  }

}
