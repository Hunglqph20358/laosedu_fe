// Angular
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
// RxJS
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
// Translate
import {TranslateService} from '@ngx-translate/core';
// Auth
import {AuthNoticeService, AuthService} from '../../../../core/auth';
import {NotiService} from '../../../../core/service/service-model/notification.service';
import {Location} from "@angular/common";

@Component({
  selector: 'kt-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  // Public params
  changePasswordForm: FormGroup;
  firstLoad: boolean = true;
  loading = false;
  errors: any = [];
  toggle1: any = false;
  toggle2: any = false;
  toggle3: any = false;
  toggle4: any = false;
  toggle5: any = false;
  toggle6: any = false;
  private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notiService: NotiService,
    private location:Location
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.firstLoad = true;
    this.initRegistrationForm();
    document.getElementById('currentPassword').focus();
  }

  initRegistrationForm() {
    this.changePasswordForm = this.fb.group({
        currentPassword: new FormControl('', [Validators.maxLength(20), Validators.minLength(6)]),
        newPassword: new FormControl('', [Validators.maxLength(20), Validators.minLength(6)]),
        rePass: new FormControl('', [Validators.maxLength(20), Validators.minLength(6)]),
      },
      {validators: [this.checkPasswords, this.checkPasswords1]}
    );
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('newPassword').value;
    const confirmPass = group.get('rePass').value
    return pass === confirmPass ? null : {notSame: true}
  }
  checkPasswords1: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('newPassword').value;
    const currentPass = group.get('currentPassword').value;
    if (pass !== '' && currentPass !== '') {
      return pass !== currentPass ? null : {hasSame: true}
    } else {
      return null
    }
  }

  replaceSpacecurrentPassword(event: any) {
    const data = event.target.value.replace(/\s/g, '')
    this.changePasswordForm.patchValue({
      currentPassword: data,
    });
    if (data === '') {
      event.target.type = 'password';
      this.toggle1=false;
      this.changePasswordForm.controls['currentPassword'].setErrors({isNull: true})
    }
    return null;
  }

  replaceSpacenewPassword(event: any) {
    const data = event.target.value.replace(/\s/g, '')
    this.changePasswordForm.patchValue({
      newPassword: data,
    });
    if (data === '') {
      event.target.type = 'password';
      this.toggle3=false;
      this.changePasswordForm.controls['newPassword'].setErrors({isNull: true})
    }
    return null;
  }

  replaceSpaceRePass(event: any) {
    const data = event.target.value.replace(/\s/g, '')
    this.changePasswordForm.patchValue({
      rePass: data,
    });
    if (data === '') {
      event.target.type = 'password';
      this.toggle5=false;
      return this.changePasswordForm.controls['rePass'].setErrors({isNull: true});
    }
    return null;
  }

  get f() {
    return this.changePasswordForm;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Form initalization
   * Default params, validators
   */
  /**
   * Form Submit
   */
  submit() {
    const controls = this.changePasswordForm.controls;
    /** check form */
    if (this.changePasswordForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;
    this.authService.changePassword(controls.currentPassword.value, controls.newPassword.value).pipe(
      tap(user => {
        // this.router.navigate([this.returnUrl])
        this.notiService.showNoti(this.translate.instant('AUTH.RESPONSE.CHANGE_SUCCESS_PW'), 'success');
        this.loading = false;
        // this.changePasswordForm.reset();
        this.location.back();
        // this.changePasswordForm.clearValidators();
      }, error => {
        if (error.error.status === 400) {
          this.notiService.showNoti(this.translate.instant('AUTH.RESPONSE.INVALID_PW'), 'error');
        } else {
          this.notiService.showNoti(this.translate.instant('AUTH.RESPONSE.CHANGE_FAILURE_PW'), 'error');
        }
        this.loading = false;
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    )
      .subscribe();
    this.cdr.detectChanges();
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.changePasswordForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) &&
      (control.dirty || control.touched);
    return result;
  }

  changeType(type, num) {
    if (type.type === 'password') {
      type.type = 'text';
    } else {
      type.type = 'password';
    }

    if (num === 1)
      this.toggle1 = !this.toggle1;
    else
      this.toggle2 = !this.toggle2;
  }

  changeType1(type, num) {
    if (type.type === 'password') {
      type.type = 'text';
    } else {
      type.type = 'password';
    }

    if (num === 1)
      this.toggle3 = !this.toggle3;
    else
      this.toggle4 = !this.toggle4;
  }

  changeType2(type, num) {
    if (type.type === 'password') {
      type.type = 'text';
    } else {
      type.type = 'password';
    }

    if (num === 1)
      this.toggle5 = !this.toggle5;
    else
      this.toggle6 = !this.toggle6;
  }

  onCancel(){
    this.location.back();
  }
}
