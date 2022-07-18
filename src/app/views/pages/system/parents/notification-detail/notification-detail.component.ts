import {ChangeDetectorRef, Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {CommonServiceService} from "../../../../../core/service/utils/common-service.service";
import {SchoolServices} from "../../school/school.service";
import {URL_AVATAR_STUDENT} from "../../../../../helpers/constants";

@Component({
  selector: 'kt-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent implements OnInit {
  dataDetail: any = {};
  imageUrl = URL_AVATAR_STUDENT;

  constructor(public ref: MatDialogRef<NotificationDetailComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any = {},
              private toast: ToastrService,
              private matDialog: MatDialog,
              private schoolServices: SchoolServices,
              private cdr: ChangeDetectorRef,
              private commonService: CommonServiceService) {
    this.dataDetail = data;
  }

  ngOnInit(): void {}

  getFileName(path) {
    const file: string[] = path.split('/');
    return file.length > 0 ? file[file.length - 1] : null;
  }

  downloadFile(path) {
    const body = {
      pathFileDownload: path
    };
    const fileName = this.getFileName(path);
    this.schoolServices.exportInbox(body, fileName);
  }
}
