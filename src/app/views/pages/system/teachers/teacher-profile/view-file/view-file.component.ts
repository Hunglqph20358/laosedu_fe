import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'kt-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss']
})
export class ViewFileComponent implements OnInit {
  fileUrl:any;
  type: any;
  @ViewChild('pdfView', { static: true }) pdfViewer: ElementRef;
  constructor(public dialogRef: MatDialogRef<ViewFileComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fileUrl = data.fileURL;
  }

  ngOnInit(): void {
    this.pdfViewer.nativeElement.data = this.fileUrl;
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({event: 'cancel'});
  }
}
