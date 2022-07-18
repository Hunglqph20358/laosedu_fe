import {Component, ElementRef, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {ToastrService} from 'ngx-toastr';
// import * as fileSaver from 'file-saver';
import { ViewChild } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  years;
  yearList = [];
  isAddNew;

  formImport: FormGroup;
  fileImport: File;
  totalSuccess: number;
  totalRecord: number;
  totalError: number;
  isImported = false;
  classroomDTOSaveInfoError: any;
  disableImport = true;

  nameFile: any;
  sizeFile: any;
  uploaded = false;

  hide = true;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<ImportFileComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private classroomService: ClassroomService,
              private toastr: ToastrService,
              private translate: TranslateService) {
    this.years = data.years;
    this.yearList.push({years: this.years});
  }

  ngOnInit(): void {
    this.isAddNew = 0;
  }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }

  onFileInput(event) {
    console.log(event);
    if (event.target.files[0] === undefined) {
      return;
    }
    console.log(event);
    const file: File = event.target.files[0];
    console.log('size', file.size);
    console.log('type', file.type);
    if (!(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel')) {
      this.toastr.error(this.translate.instant('CLASSROOM.MSG.FILE_FORMAT_ERR'));
      this.uploaded = false;
      this.disableImport = true;
      return;
    }
    if (file.size > 5242880) {
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
    console.log(this.isAddNew);
    this.classroomService.importFile(this.fileImport, this.isAddNew, this.years).subscribe(resAPI => {
      this.hide = true;
      console.log(resAPI);
      const dataRes:any = resAPI.body;
      if (dataRes.status === 'OK') {
        this.classroomDTOSaveInfoError = dataRes.data.pop();
        this.totalSuccess = this.classroomDTOSaveInfoError.totalSuccess;
        this.totalError = this.classroomDTOSaveInfoError.totalFail;
        this.totalRecord = this.totalError + this.totalSuccess;
        this.isImported = true;
        this.toastr.success(dataRes.message);
      }else if (dataRes.status === 'BAD_REQUEST') {
        if (dataRes.data !== null) {
          this.classroomDTOSaveInfoError = dataRes.data.pop();
          this.totalSuccess = this.classroomDTOSaveInfoError.totalSuccess;
          this.totalError = this.classroomDTOSaveInfoError.totalFail;
          this.totalRecord = this.totalError + this.totalSuccess;
          this.isImported = true;
        }
        this.toastr.error(dataRes.message);
      }
    }, err =>{
      this.toastr.error(this.translate.instant('CLASSROOM.MSG.IMPORT_FAIL'));
    });
    this.disableImport = true;
  }

  downloadErrorFile() {
    this.classroomService.downloadErrorFile(this.classroomDTOSaveInfoError).subscribe((responseMessage) => {
      const file = new Blob([responseMessage], {type: 'application/vnd.ms-excel'});
      const fileURL = URL.createObjectURL(file);
      const anchor = document.createElement('a');
      anchor.download = this.translate.instant('CLASSROOM.FILE_ERR_NAME');
      anchor.href = fileURL;
      anchor.click();
    });
  }


  downloadSampleFile() {
    this.classroomService.downloadSampleFile().subscribe((responseMessage) => {
      // @ts-ignore
      const file = new Blob([responseMessage], {type: 'application/vnd.ms-excel'});
      const fileURL = URL.createObjectURL(file);
      // window.open(fileURL, '_blank');
      const anchor = document.createElement('a');
      anchor.download = `${this.translate.instant('CLASSROOM.EXPORT_FILE_NAME')}`;
      anchor.href = fileURL;
      anchor.click();
    });
  }

}
