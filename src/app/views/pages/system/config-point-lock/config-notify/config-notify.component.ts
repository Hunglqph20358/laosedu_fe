import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfigPointLockService} from "../../../../../core/service/service-model/config-point-lock.service";

@Component({
  selector: 'kt-config-notify',
  templateUrl: './config-notify.component.html',
  styleUrls: ['./config-notify.component.scss']
})
export class ConfigNotifyComponent implements OnInit {
  showErr = false;
  message;
  formConfig: FormGroup;
  constructor(public dialogRef: MatDialogRef<ConfigNotifyComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private fb:FormBuilder,
              private configLockDate: ConfigPointLockService) { }

  ngOnInit(): void {
    this.formConfig = this.fb.group({
      numberDay: ['', [Validators.required]]
    });
    this.configLockDate.getDayBefore().subscribe(res => {
      this.formConfig.get('numberDay').setValue(res.data);
      this.listeningNumberDay();
    });
  }

  listeningNumberDay() {
    this.formConfig.get('numberDay').valueChanges.subscribe(val => {
      console.log(val);
      if (val === null) {
        this.formConfig.get('numberDay').setErrors({incorrect: true});
        this.showErr = true;
        this.message = 'Vui lòng nhập số ngày báo trước';
        return;
      }
      if (val < 1 || val > 10) {
        this.formConfig.get('numberDay').setErrors({incorrect: true});
        this.showErr = true;
        this.message = 'Số ngày trước hạn phải là số nguyên dương từ 1 đến 10';
        return;
      }
      const vall = val + '';
      if (vall.indexOf('.') !== -1) {
        this.formConfig.get('numberDay').setErrors({incorrect: true});
        this.showErr = true;
        this.message = 'Số ngày trước hạn không thể là số thập phân';
        return;
      }
      this.configLockDate.checkNumberDayNotify(val).subscribe(resAPI => {
        if (resAPI.status === 'NOT_FOUND') {
          this.formConfig.get('numberDay').setErrors({incorrect: true});
          this.showErr = true;
          this.message = resAPI.message;
        }
        if (resAPI.status === 'OK') {
          this.showErr = false;
        }
        if(resAPI.status === 'BAD_REQUEST'){
          this.formConfig.get('numberDay').setErrors({incorrect: true});
          this.showErr = true;
          this.message = resAPI.message;
        }
        return;
      });
    });
  }

  save(): void {
    const days = this.formConfig.get('numberDay').value;
    this.dialogRef.close({event: 'confirm', data: days});
  }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }
  isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }
}
