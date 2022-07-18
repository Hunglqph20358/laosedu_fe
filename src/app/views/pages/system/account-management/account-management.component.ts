import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DepartmentService} from '../../../../core/service/service-model/unit.service';
import {Department} from '../../../../core/service/model/department.model';
import {environment} from '../../../../../environments/environment';
import {finalize, takeUntil, tap} from 'rxjs/operators';
import {NotiService} from '../../../../core/service/service-model/notification.service';
import {Subject} from 'rxjs';
import {SchoolServices} from '../school/school.service';
import {ApParamService} from '../../../../core/service/service-model/ap-param.service';
import {AccountService} from '../../../../core/service/service-model/account.service';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {StorageSessionService} from "../../../../core/auth/_services/storage.session.service";

export interface DataDropdown {
  code: string | null;
  name: string;
}

export interface DataDropdownId {
  drId: string | null;
  drNameEn: string;
}

@Component({
  selector: 'kt-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {
  schoolForm: FormGroup;
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = '../../../../../assets/media/img/image_photo.png';
  editFile: boolean = true;
  removeUpload: boolean = false;
  defaultUrl: boolean = true;
  isEdit: boolean = false;
  typeUnit;
  department: Department = new Department();
  school: any;
  private unsubscribe: Subject<any>;
  listSchoolLevel = [];
  listSchoolType = [];
  listProvince = [];
  listDistrict = [];
  loading = false;
  fileLogo: File;
  dropDownDefault: DataDropdown = {
    code: '',
    name: '-- Lựa chọn --'
  };

  dropDownDefaultId: DataDropdownId = {
    drId: '',
    drNameEn: '-- Lựa chọn --'
  };
  overSize: boolean = false;
  oldDistrict: any = [];
  oldImg: any = '';
  responseData: any;
  langKey;
  // blType: boolean;

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private deparmentService: DepartmentService,
              private schoolServices: SchoolServices,
              private apParamService: ApParamService,
              private accountService: AccountService,
              private notiService: NotiService,
              private translate: TranslateService,
              private datePipe: DatePipe,
              private storageSessionService: StorageSessionService,
              private cdr: ChangeDetectorRef,) {
    this.department = new Department();
    this.unsubscribe = new Subject();
    this.langKey = (localStorage.getItem('language'));
  }

  ngOnInit(): void {
    this.oldDistrict = null;
    this.initLoginForm();
    this.school = this.storageSessionService.get(this.storageSessionService.SCHOOL_INFO);
    if (this.school === null) {
      this.fetchInfoSchool();
    }
    // this.school = JSON.parse(this.schoolServices.schoolInfo);
    this.school.foundedDate = this.datePipe.transform(this.school.foundedDate, 'yyyy-MM-dd');
    this.fetchData();
    this.school.logo = this.school.logo !== null ? this.school.logo.substring(this.school.logo.lastIndexOf('/assets'), this.school.logo.length) : null;
    this.imageUrl = this.school.logo
    if (this.imageUrl !== null && this.imageUrl !== '') {
      this.defaultUrl = false;
      this.oldImg = this.imageUrl;
    }
  }

  fetchData() {
    this.getLevelSchool();
    this.getTypeSchool();
    this.getProvince();
  }

  initLoginForm() {
    this.schoolForm = this.fb.group({
      code: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      hotLine: new FormControl('', [Validators.maxLength(20), Validators.pattern(/^-?([0-9]\d*)?$/)]),
      educationType: new FormControl('', [Validators.maxLength(50)]),
      name: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      email: new FormControl('', [Validators.maxLength(250), Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      principal: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      abbreviationName: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      provinceId: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      principalPhone: new FormControl('', [Validators.maxLength(20), Validators.pattern(/^-?([0-9]\d*)?$/)]),
      levelShool: new FormControl('', [Validators.maxLength(50)]),
      districtId: new FormControl('', [Validators.maxLength(50)]),
      website: new FormControl('', [Validators.maxLength(250)]),
      foundedDate: new FormControl('', [Validators.maxLength(50)]),
      address: new FormControl('', [Validators.maxLength(2000)]),
      file: [null]
    });
    this.schoolForm.disable();
  }

  get f() {
    return this.schoolForm;
  }

  // get level school
  getLevelSchool() {
    this.apParamService.getByType('LEVEL_SCHOOL')
      .subscribe({
        next: res => {
          this.listSchoolLevel = res
          console.log(res)
          if (this.school.levelShool === null || this.school.levelShool === '') {
            this.listSchoolLevel.unshift(this.dropDownDefault)
            this.school.levelShool = ''
          }
          this.cdr.detectChanges();
        },
        error: res => {
          this.notiService.showNoti(res.error.message, 'error');
        }
      })
  }

  // get type school
  getTypeSchool() {
    this.apParamService.getByType('TYPE_EDU')
      .subscribe({
        next: res => {
          this.listSchoolType = res
          if (this.school.typeEducation === null || this.school.typeEducation === '') {
            this.listSchoolType.unshift(this.dropDownDefault)
            this.school.typeEducation = ''
          }
          this.cdr.detectChanges();
        },
        error: res => {
          this.notiService.showNoti(res.error.message, 'error');
        }
      })
  }

  getProvince() {
    this.accountService.getAllProvince().pipe(
      tap(response => {
        this.listProvince = response
        if (this.school.provinceId === null || this.school.provinceId === '') {
          this.listProvince.unshift(this.dropDownDefault)
          this.school.provinceId = ''
        } else if (response.length > 0) {
          this.school.provinceId !== null ? this.getDistrictOfProvince(this.school.provinceId, 0) : this.getDistrictOfProvince(response[0].id, 0)
        }
      }, error => {
        this.notiService.showNoti(error.error.message, 'error');
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe();
    this.cdr.detectChanges();
  }

  getDistrictOfProvince(prId, valueCheck) {
    this.accountService.getDistrictByProvince(prId).pipe(
      tap(response => {
        this.listDistrict = response
        if (this.school.districtId === null || this.school.districtId === '') {
          this.listDistrict.unshift(this.dropDownDefaultId)
          this.school.districtId = ''
        }
        if (valueCheck === 1) {
          this.listDistrict.length > 0 ? this.school.districtId = this.listDistrict[0].drId : this.school.districtId = '';
        }
        if (this.oldDistrict == null) {
          this.oldDistrict = this.listDistrict;
        }
      }, error => {
        this.notiService.showNoti(error.error.message, 'error');
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe();
    this.cdr.detectChanges();
  }

  // currentTarget
  fetchInfoSchool() {
    const schoolCode = environment.SCHOOL_CODE;
    this.schoolServices.searchSchool(schoolCode).pipe(
      tap(response => {
        console.log('get info school success');
        // sessionStorage.setItem('schoolInfo', JSON.stringify(response));
        this.storageSessionService.set(this.storageSessionService.SCHOOL_INFO, response);
        this.school = response;
        this.school.logo = this.school.logo !== null ? this.school.logo.substring(this.school.logo.lastIndexOf('/assets'), this.school.logo.length) : null;
        this.imageUrl = this.school.logo
        if (this.imageUrl !== null && this.imageUrl !== '') {
          this.defaultUrl = false;
          this.oldImg = this.imageUrl
        }
        this.fetchData()
      }, error => {
        if (error.error.status === 404 || error.error.status === 500) {
          this.notiService.showNoti(this.translate.instant('SYSTEM.CONNECT_FAILURE_UNITEL'), 'error');
        } else {
          this.notiService.showNoti(error.error.message, 'error');
        }
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdr.markForCheck();
      })
    ).subscribe();
    this.cdr.detectChanges();
  }


  uploadFile(event) {
    const reader = new FileReader(); // HTML5 FileReader API
    const file = this.fileLogo = event.target.files[0];
    const ext = file.name.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'bmp':
      case 'tif':
      case 'tiff':
        document.getElementById('imagePreview1').classList.remove('custom-img-error');
        break
      default:
        event.target.value = '';
        document.getElementById('imagePreview1').classList.add('custom-img-error');
        this.overSize = true
        return
    }
    const sizeFileMB = file.size / 1024 / 1024
    if (sizeFileMB > 5) {
      event.target.value = '';
      document.getElementById('imagePreview1').classList.add('custom-img-error');
      this.overSize = true
      return
    } else {
      document.getElementById('imagePreview1').classList.remove('custom-img-error');
      this.overSize = false
    }
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.schoolForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;
        this.cd.markForCheck();
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
    event.target.value = '';
  }

  // Function to remove uploaded file
  removeUploadedFile() {
    const newFileList = Array.from(this.el.nativeElement.files);
    newFileList.splice(0, 1);
    this.el.nativeElement.files = '';
    // this.imageUrl = '../../../../../assets/media/img/image_photo.png';
    // this.editFile = true;
    // this.removeUpload = false;
    // this.schoolForm.patchValue({
    //   file: [null]
    // });
  }

  onUpdateOrCancel(type) {
    this.isEdit = !this.isEdit;
    !this.isEdit ? this.callBackFirstData() : this.schoolForm.enable();
    document.getElementById('hotLine').focus();
    this.overSize = false
    document.getElementById('imagePreview1').classList.remove('custom-img-error');
    if (type === 0 && !this.isEdit) {
      this.imageUrl = this.oldImg;
      // this.removeUploadedFile()
    }
  }

  callBackFirstData() {
    this.schoolForm.disable();
    this.school = this.schoolServices.schoolInfo;
    if (this.oldDistrict != null) {
      this.listDistrict = this.oldDistrict
    }
  }

  changeProvince(event) {
    if (event && event.id !== '') {
      this.getDistrictOfProvince(event.id, 1);
    }

  }

  onSubmit() {
    // this.schoolForm.controls['id'].setValue(this.school.id);
    const controls = this.schoolForm.controls;
    if (this.schoolForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.school.foundedDate = this.datePipe.transform(controls.foundedDate.value, 'yyyy-MM-dd');
    this.loading = true;
    this.schoolServices.updateSchoolInfo(this.school, this.fileLogo).pipe(
      tap(response => {
        if (response) {
          this.storageSessionService.set(this.storageSessionService.SCHOOL_INFO, response);
          this.notiService.showNoti(this.translate.instant('COMMON.UPDATE_SUCCESS'), 'success');
          this.onUpdateOrCancel(1);
          this.responseData = response;
          this.oldImg = this.responseData.logo.substring(this.responseData.logo.lastIndexOf('/assets'), this.responseData.logo.length);
          this.loading = false;
          this.fileLogo = null;
        } else {
          this.notiService.showNoti(this.translate.instant('COMMON.UPDATE_FAILURE'), 'warning');
          this.loading = false;
        }
      }, error => {
        this.notiService.showNoti(error.error.message, 'error');
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    ).subscribe();
    this.cdr.detectChanges();
  }

  onBlurEventRemoveAllSpace(event: any) {
    const name = event.currentTarget.id;
    this.schoolForm.get(name).patchValue(event.target.value.trim().replace(/\s/g, ''));
  }

  onBlurEventTrim(event: any) {
    const name = event.currentTarget.id;
    this.schoolForm.get(name).patchValue(event.target.value.trim());
  }

}
