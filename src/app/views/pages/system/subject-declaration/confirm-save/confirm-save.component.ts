import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'confirm-save-subject-class',
  templateUrl: './confirm-save.component.html',
  styleUrls: ['./confirm-save.component.scss']
})
export class ConfirmSaveComponent implements OnInit {

  title: string;
  message: string;

  constructor(public dialogRef: MatDialogRef<ConfirmSaveComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close({event: 'confirm'});
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({event: 'cancel'});
  }

}
