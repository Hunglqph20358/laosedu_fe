import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import { OfficialLetterDocumentComponent } from '../official-letter-document.component';
import { DocumentaryService } from 'src/app/core/service/service-model/documentary.service';
import {environment} from '../../../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { CreateOfficalLetterComponent } from '../create-offical-letter/create-offical-letter.component';

@Component({
  selector: 'kt-action-offical-letter-document',
  templateUrl: './action-offical-letter-document.component.html',
  styleUrls: ['./action-offical-letter-document.component.scss']
})
export class ActionOfficalLetterDocumentComponent implements OnInit, ICellRendererAngularComp {

  @ViewChild('templateNewSubject') public newSubject: ModalDirective;
  modalRef: BsModalRef;
  currentRoles = [];
  isRole: boolean;
  // Role Admin, HT
  ADMIN = `${environment.ROLE.ADMIN}`;
  HT = `${environment.ROLE.HT}`;

  constructor(private modalService: BsModalService,
              private matDialog : MatDialog,
              private officalLetterDocumentComponent: OfficialLetterDocumentComponent,
              private documentaryService: DocumentaryService,
              private toastr: ToastrService,
              private changeDetectorRef: ChangeDetectorRef,
              private translate:TranslateService
  ) {  }

  rowIndex;
  cellValue: string;

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    if (this.currentRoles && this.currentRoles.length > 0) {
      // TODO: this.isRole = true không cho chỉnh sửa
      this.currentRoles.forEach(e=>{
        if(e === this.ADMIN || e === this.HT){
          this.isRole = false;
          return;
        }
      })
    }
  }

  agInit(params ): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

// gets called whenever the cell refreshes
  refresh(params) {
      // set value into cell again
      return true
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md fix-width' })
    );
  }

  deleteDocument(){
    console.log('cellValue',this.cellValue);
    this.documentaryService.deleteDocument(this.cellValue)
      .subscribe(responseAPI => {
        if (responseAPI.status === 'OK') {
          if(this.officalLetterDocumentComponent.totalRecord % 10 == 1 && this.officalLetterDocumentComponent.page == this.officalLetterDocumentComponent.totalPage){
            this.officalLetterDocumentComponent.search(1);
          }else{
            this.officalLetterDocumentComponent.search(this.officalLetterDocumentComponent.page);
          }
          this.toastr.success(responseAPI.message);
          this.modalRef.hide();
        } else {
          this.toastr.error(responseAPI.message);
        }
      });
  }

  openModalUpdate(){
    const dataEdit : any = {};
    dataEdit.isCreateNew = false;
    dataEdit.oldData = this.cellValue;
    console.log(dataEdit.oldData);
    dataEdit.listDocumentAdd = this.officalLetterDocumentComponent.listDocumentAdd;
    dataEdit.listSigner = this.officalLetterDocumentComponent.listSigner;
    this.matDialog.open(
      CreateOfficalLetterComponent,{
        data: dataEdit,
        maxHeight: window.innerHeight + 'px',
        disableClose: true,
        hasBackdrop: true,
        width: '446px',
        autoFocus: false
      }
    ).afterClosed().subscribe((res) => {
      console.log(res);
      if(res.event != 'cancel'){
        this.officalLetterDocumentComponent.search(1);
      }
    });
  }

  trans(key): string {
    return this.translate.instant(key)
  }
}
