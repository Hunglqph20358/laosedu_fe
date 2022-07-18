import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'kt-transfer-student-notify',
  templateUrl: './transfer-student-notify.component.html',
  styleUrls: ['./transfer-student-notify.component.scss']
})
export class TransferStudentNotifyComponent implements OnInit {

  title: string;
  message1: string;
  message2: string;

  constructor(public dialogRef: MatDialogRef<TransferStudentNotifyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message1 = data.message1;
    this.message2 = data.message2;
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close({event: 'confirm'});
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({event: 'cancel'});
  }

  cannel(){
    this.dialogRef.close({data: 'cancel'});
  }

}
