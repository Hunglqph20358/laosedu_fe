import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TeachingAssignmentService } from 'src/app/core/service/service-model/teaching-assignment.service';
import { TranslateService } from '@ngx-translate/core';
// import * as fileSaver from 'file-saver';

@Component({
  selector: 'import-teaching-assignment',
  templateUrl: './import-teaching-assignment.component.html',
  styleUrls: ['./import-teaching-assignment.component.scss'],
})
export class ImportTeachingAssignmentComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  currentYear;
  formImportSubject: FormGroup;
  fileImport: File;
  errorUpload = false;
  errorUploadMsg: any;
  totalSuccess: number;
  totalRecord: number;
  totalError: number;
  isImported = false;
  teachingAssignmentDTOSaveInfoError: any;
  disableImport = true;
  nameFile: any;
  uploaded = false;
  sizeFile: any;
  hide = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ImportTeachingAssignmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private teachingAssignmentService: TeachingAssignmentService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {
    this.currentYear = data.currentYear;
  }

  ngOnInit(): void {
    console.log(`this.currentYear`, this.currentYear);
    this.formImportSubject = this.fb.group({
      currentYear: this.currentYear,
    });
  }

  onDismiss() {
    this.dialogRef.close({ event: 'cancel' });
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
    if (
      !(
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      )
    ) {
      console.log('dinh dang file ko cho phep');
      this.toastr.error(this.translateService.instant('TEACHER_ASSIGNMENT.FILE_VALID_TYPE'));
      this.uploaded = false;
      this.disableImport = true;
      return;
    }
    if (file.size > 5242880) {
      console.log('size to qua');
      this.toastr.error(this.translateService.instant('TEACHER_ASSIGNMENT.FILE_MAX_SIZE'));
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
    // this.disableImport = false;
    this.hide = false;
    this.teachingAssignmentService
      .importFile(this.fileImport, this.currentYear)
      .subscribe(
        (resAPI) => {
          this.hide = true;
          console.log(resAPI);
          const dataRes: any = resAPI.body;
          if (dataRes.status === 'OK') {
            this.teachingAssignmentDTOSaveInfoError = dataRes.data.pop();
            this.totalSuccess =
              this.teachingAssignmentDTOSaveInfoError.totalSuccess;
            this.totalError = this.teachingAssignmentDTOSaveInfoError.totalFail;
            this.totalRecord = this.totalError + this.totalSuccess;
            this.isImported = true;
            this.toastr.success(dataRes.message);
          } else if (dataRes.status === 'BAD_REQUEST') {
            if (dataRes.data !== null) {
              this.teachingAssignmentDTOSaveInfoError = dataRes.data.pop();
              this.totalSuccess =
                this.teachingAssignmentDTOSaveInfoError.totalSuccess;
              this.totalError =
                this.teachingAssignmentDTOSaveInfoError.totalFail;
              this.totalRecord = this.totalError + this.totalSuccess;
              this.isImported = true;
            }
            this.toastr.error(dataRes.message);
          }
        },
        (err) => {
          this.toastr.error(this.translateService.instant('TEACHER_ASSIGNMENT.IMPORT_ERROR'));
        }
      );

    this.disableImport = true;
  }

  downloadErrorFile() {
    this.teachingAssignmentService
      .downloadErrorFile(this.teachingAssignmentDTOSaveInfoError)
      .subscribe((responseMessage) => {
        const file = new Blob([responseMessage], {
          type: 'application/vnd.ms-excel',
        });
        const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
        const anchor = document.createElement('a');
        anchor.download = 'DS_Import_Loi.xls';
        anchor.href = fileURL;
        anchor.click();
      });
  }

  downloadSampleFile() {
    console.log('downloadSampleFile');
    this.teachingAssignmentService
      .downloadSampleFile(this.currentYear)
      .subscribe((responseMessage) => {
        // @ts-ignore
        const file = new Blob([responseMessage], {
          type: 'application/vnd.ms-excel',
        });
        const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
        const anchor = document.createElement('a');
        anchor.download = this.translateService.instant("TEACHER_ASSIGNMENT.EXCEL_FILE_NAME")+'.xls';
        anchor.href = fileURL;
        anchor.click();
      });
  }
}
