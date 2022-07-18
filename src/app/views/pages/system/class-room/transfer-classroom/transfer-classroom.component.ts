import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'kt-transfer-classroom',
  templateUrl: './transfer-classroom.component.html',
  styleUrls: ['./transfer-classroom.component.scss']
})
export class TransferClassroomComponent implements OnInit {

  year;
  nextYear;

  constructor(public dialogRef: MatDialogRef<TransferClassroomComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.year = data.years;
    this.nextYear = data.nextYear;
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close({event: 'confirm'});
  }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }
}
