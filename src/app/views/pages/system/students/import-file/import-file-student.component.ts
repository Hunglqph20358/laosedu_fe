import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../../../../../core/service/service-model/subject.service';
import { ModalDirective } from "ngx-bootstrap/modal";
import { StudentsService } from "../../../../../core/service/service-model/students.service";
import { download } from 'src/app/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { MAX_FILE_SIZE_UPLOAD } from 'src/app/helpers/constants';
// import * as fileSaver from 'file-saver';

@Component({
  selector: 'kt-import-file',
  templateUrl: './import-file-student.component.html',
  styleUrls: ['./import-file-student.component.scss']
})
export class ImportFileStudentComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  years = 2021;
  formImportSubject: FormGroup;
  fileImport: File;
  errorUpload = false;
  errorUploadMsg: any;
  totalSuccess: number;
  totalRecord: number;
  totalError: number;
  isImported = false;
  subjectDTOSaveInfoError: any;
  disableImport = true;

  nameFile: any;
  uploaded = false;
  sizeFile: any;
  hide = true;

  @ViewChild('importSubject') public importSubjects: ModalDirective;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImportFileStudentComponent>,
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private studentsService: StudentsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.years = data.years;
  }

  ngOnInit(): void {
    this.formImportSubject = this.fb.group({
      years: [{ value: '', disabled: true }, Validators.required],
      isAddNew: ['0', Validators.required]
    })
  }

  onDismiss() {
    this.dialogRef.close({ event: 'cancel' });
  }

  onFileInput(event) {
    if (event.target.files[0] === undefined) {
      return;
    }
    const file: File = event.target.files[0];
    if (!(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel')) {
      this.toastr.error(this.translate.instant('CLASSROOM.MSG.FILE_FORMAT_ERR'));
      this.uploaded = false;
      this.disableImport = true;
      return;
    }
    if (file.size > MAX_FILE_SIZE_UPLOAD) {
      this.toastr.error(this.translate.instant('CLASSROOM.MSG.FILE_SIZE'));
      this.uploaded = false;
      this.disableImport = true;
      return;
    }
    this.fileImport = file;
    this.uploaded = true;
    this.disableImport = false;
    this.nameFile = event.target.files[0].name;
    this.sizeFile = event.target.files[0].size;
    this.myInputVariable.nativeElement.value = '';
  }

  deleteFile() {
    this.uploaded = false;
    this.disableImport = true;
    this.isImported = false;
  }

  importFile() {
    this.hide = false;
    const isAddNew = this.formImportSubject.get('isAddNew').value;
    let body = {
      file: this.fileImport,
      isAddNew: isAddNew,
    }
    this.studentsService.importStudent(body).subscribe(resAPI => {
      this.hide = true;
      const dataRes: any = resAPI.body;
      if (dataRes.status === 'OK') {
        this.subjectDTOSaveInfoError = dataRes.data.pop();
        this.totalSuccess = this.subjectDTOSaveInfoError.totalSuccess;
        this.totalError = this.subjectDTOSaveInfoError.totalFail;
        this.totalRecord = this.totalError + this.totalSuccess;
        this.toastr.success(dataRes.message);
        this.deleteFile();
        this.isImported = true;
        this.uploaded = true;
      } else if (dataRes.status === 'BAD_REQUEST') {
        if (dataRes.data !== null) {
          this.subjectDTOSaveInfoError = dataRes.data.pop();
          this.totalSuccess = this.subjectDTOSaveInfoError.totalSuccess;
          this.totalError = this.subjectDTOSaveInfoError.totalFail;
          this.totalRecord = this.totalError + this.totalSuccess;
          this.isImported = true;
        }
        this.toastr.error(dataRes.message);
      }
    }, err => {
      this.toastr.error(this.translate.instant('CLASSROOM.MSG.IMPORT_FAIL'));
    });
    this.disableImport = true;
  }

  downloadErrorFile() {
    this.studentsService.exportDataErrors(this.subjectDTOSaveInfoError).subscribe((res) => {
      if (res) { download(res, 'DS_Import_Loi.xls') }
    });
  }

  downloadSampleFile() {
    this.studentsService.exportSample().subscribe((res) => {
      if (res) { download(res, 'DS_HocSinh') }
    });
  }

}
