import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClassroomService } from 'src/app/core/service/service-model/classroom.service';
import { GradeLevelService } from 'src/app/core/service/service-model/grade-level.service';
import { StudentsService } from 'src/app/core/service/service-model/students.service';
import { DepartmentService } from 'src/app/core/service/service-model/unit.service';
import { CommonFunction } from 'src/app/core/service/utils/common-function';
import { STUDENTS, MAX_FILE_SIZE_UPLOAD, EXTENSION_IMAGE, KEYCODE_0 } from 'src/app/helpers/constants';
import { KEYCODE_9 } from '../../../../../helpers/constants';

@Component({
  selector: 'kt-create-update-student',
  templateUrl: './create-update-student.component.html',
  styleUrls: ['./create-update-student.component.scss']
})
export class CreateUpdateStudentComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  modalRef: BsModalRef;

  INTERCEPT_PHONE: string[] = ['+','-','e','.', ',']

  imageUrl;
  // dropdown-list
  status; trainingSystem; sex; electFormat; graduationType; relationship
  
  statusValue
  gradeValue
  deptValue
  trainingSystemValue
  classValue
  electFormatValue
  graduateTypeValue
  relationship1Value
  relationship2Value
  sexValue

  form = this.fb.group({
    avatar: [null],
    code: [null, [Validators.required, Validators.maxLength(50), this.comparisonValidator()]],
    fullName: [null, [Validators.required, Validators.maxLength(250)]],
    status: [0, [Validators.required]],
    gradeId: [null],
    deptId: [null],
    classRoomCode: [null, [Validators.required]],
    trainingSystem: [null, [Validators.required]],
    sex: [0],
    phone: [null, [this.validateNumber(), Validators.pattern("^\\s*(209|309|304|205|305|202|302|207|307)\\d*\\s*$"),]],
    email: [null, [Validators.pattern('^[a-z0-9_\\.]{1,32}@[a-z0-9]{2,}(\\.[a-z0-9]{2,4}){1,2}$'), Validators.maxLength(250)]],
    teacher: [null],
    birthDay: [null],
    religion: [null, [Validators.maxLength(250)]],
    nation: [null, [Validators.maxLength(250)]],
    homeTown: [null, [Validators.maxLength(250)]],
    permanentAddress: [null, [Validators.maxLength(250)]],
    temporaryAddress: [null, [Validators.maxLength(250)]],
    identityCard: [null, [Validators.maxLength(250)]],
    issuedAddress: [null, [Validators.maxLength(250)]],
    issuedDate: [null],
    startDate: [null, [Validators.required]],
    electFormat: [null],
    graduationType: [null],
    idContact1: [null],
    idContact2: [null],
    relationship1: [null, [Validators.required]],
    relationship2: [null],
    fullNameContact1: [null, [Validators.required, Validators.maxLength(250)]],
    fullNameContact2: [null, [Validators.maxLength(250)]],
    phoneContact1: [null, [Validators.required, this.validateNumber(), Validators.pattern("^\\s*(209|309|304|205|305|202|302|207|307)\\d*\\s*$"),]],
    phoneContact2: [null, [this.validateNumber(), Validators.pattern("^\\s*(209|309|304|205|305|202|302|207|307)\\d*\\s*$"),]],
  });

  get getControl() {
    return this.form.controls;
  }

  createdName: string;
  studentCode: number | string = null;
  isLoading: boolean = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private gradeLevelService: GradeLevelService,
    private classRoomService: ClassroomService,
    private departmentService: DepartmentService,
    private studentService: StudentsService,
    private toaStr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  comparisonValidator() : ValidatorFn{
    return (group: FormGroup): ValidationErrors => {
      const value = group.value

      if (value !== null && /\s/g.test(value.trim())) {
        return {hasWhitespace: true}
      }

      return null;
    };
  }

  ngOnInit(): void {
    this.translateList([
      {values: this.status = [],  data: STUDENTS.STATUS},
      {values: this.trainingSystem = [], data: STUDENTS.TRAINING_SYSTEM},
      {values: this.sex = [], data: STUDENTS.SEX},
      {values: this.electFormat = [], data: STUDENTS.ELECT_FORMAT},
      {values: this.graduationType = [], data: STUDENTS.GRADUATION_TYPE},
      {values: this.relationship = [], data: STUDENTS.RELATIONSHIP}
    ])
    this.createdName = JSON.parse(localStorage.getItem('currentUser')).login;
    this.route.params.subscribe(param => {
      this.studentCode = param.id;
    });
    this.loadCurrentYear();
    this.loadGradeLevel();
    this.loadDeptIdOfSubject();
    this.form.get('teacher').disable();
    this.form.get('graduationType').setValue(1)
    this.form.get('electFormat').setValue(1)
    this.form.get('relationship1').setValue(0)
    this.imageUrl =  '../../../../../../assets/media/img/camera.png'
    if (Boolean(this.studentCode)) {
      this.studentService.getStudentByIdOrCode(this.studentCode, this.currentYear).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: res => {
          if (res) {
            this.imageUrl = res.avatar || '../../../../../../assets/media/img/camera.png'
            this.gradeLevel = res.gradeId;
            this.classValue = `${res.classRoomCode}-${res.className}`
            this.gradeValue = res.gradeName
            this.deptValue = res.deptName
            this.trainingSystemValue = this.trainingSystem.find(v => v.id == res.trainingSystem)?.name
            this.sexValue = this.sex.find(v => v.id == res.sex)?.name
            this.electFormatValue = this.electFormat.find(v => v.id == res.electFormat)?.name
            this.graduateTypeValue = this.graduationType.find(v => v.id == res.graduationType)?.name
            this.relationship1Value = this.relationship.find(v => v.id == res.relationShip1)?.name
            this.relationship2Value = this.relationship.find(v => v.id == res.relationShip2)?.name

            this.form.patchValue({
              avatar: res.avatar,
              birthDay: res.birthDay ? this.formatDate(res.birthDay) : null,
              classRoomCode: res.classRoomCode,
              code: res.code,
              deptId: res.deptId,
              electFormat: res.electFormat,
              email: res.email,
              fullName: res.fullName,
              fullNameContact1: res.fullNameContact1,
              fullNameContact2: res.fullNameContact2,
              gradeId: res.gradeId,
              graduationType: res.graduationType,
              homeTown: res.homeTown,
              identityCard: res.identityCard,
              issuedAddress: res.issuedAddress,
              issuedDate: res.issuedDate ? this.formatDate(res.issuedDate) : null,
              nation: res.nation,
              permanentAddress: res.permanentAddress,
              phone: res.phone,
              idContact1: res.idContact1,
              idContact2: res.idContact2,
              phoneContact1: res.phoneContact1,
              phoneContact2: res.phoneContact2,
              relationship1: res.relationShip1,
              relationship2: res.relationShip2,
              religion: res.religion,
              sex: res.sex,
              startDate: res.startDate ? this.formatDate(res.startDate) : null,
              status: res.status,
              temporaryAddress: res.temporaryAddress,
              trainingSystem: res.trainingSystem,
              teacher: res.teacher
            });
            this.form.get('code').disable();
            this.form.get('status').disable()

            // if (res.avatarByte) {
            //   this.imageUrl = `data:image/png;base64,${res.avatarByte}`
            //   this.changeDetectorRef.detectChanges()
            // }
            this.loadClassRoom();
          }
        },
        error: res => {
          console.log(res);
        }
      })
    }
  }

  listGradeLevel = [];
  gradeLevel = null; //id của listGradeLevel
  loadGradeLevel(): void {
    this.gradeLevelService.getGradeLevelOfSubject().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) {
          this.listGradeLevel = res;
          const i = res[0].id
          this.form.get('gradeId').setValue(i)
          this.gradeLevel = i
          this.loadClassRoom()
        }
      },
      error: res => {
        console.log(res);
      }
    })
  }

  onChangeGradeLevel(value) {
    if (Boolean(value)) {
      this.gradeValue = value.name
      this.gradeLevel = value.id;
      this.form.get('classRoomCode').setValue(null);
      this.form.get('teacher').setValue(null);
      this.loadClassRoom()
      this.onChange('gradeValue', value)
    }
  }

  onChangeDepartment(value) {
    this.deptValue = value.name
    this.loadClassRoom()
    this.onChange('deptValue', value)
  }

  currentYear;
  loadCurrentYear(): void {
    this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.currentYear = res;
    })
  }

  loadStudent() {
    
  }

  listClass = [];
  loadClassRoom(): void {
    if (Boolean(this.gradeLevel)) {
      let query: object = {
        gradeLevel: this.gradeLevel,
        years: this.currentYear,
        deptId: parseInt(this.form.get('deptId').value)
      }
      this.classRoomService.findByGradeLevelAndYearAndDeptId(query).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: res => {
          if (res.status !== 'OK') {
            return;
          }
          this.listClass = res.data.map(value => {
            value.name = `${value.code}-${value.name}`;
            return value;
          });
          if (!Boolean(this.studentCode)) {
            this.form.get('classRoomCode').setValue(null)
          }
          this.changeDetectorRef.detectChanges()
        },
        error: res => {
          console.log(res);
        }
      });
    }
  }

  listDept = [];
  loadDeptIdOfSubject() {
    this.departmentService.getDepartmentByCondition().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) {
          this.listDept = res.map(value => {
            value.name = `${value.code}-${value.name}`
            return value
          });
          if (!Boolean(this.studentCode)) {
            this.form.get('deptId').setValue(res[0].id)
          }
          this.loadClassRoom();
        }
      },
      error: res => {
        console.log(res);
      }
    });
  }

  teacherId: number | string;
  onChangeClass(value) {
    if (Boolean(value)) {
      this.classValue = value.name
      this.teacherId = value.id;
      this.loadTeacher();
    }
  }

  onChange(name, param, outputName = 'name',) {
    this[name] = param[outputName]
  }

  loadTeacher() {
    this.studentService.getTeacherByClassId(this.teacherId).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) this.form.get('teacher').setValue(`${res.code}-${res.fullName}`)
      },
      error: res => {
        console.log(res);
      }
    });
  }

  avatarFile: File;
  previousFile: File
  previousImage
  processFile(imageInput: any) {
    if (imageInput == undefined || !imageInput.files[0]) return

    this.avatarFile = imageInput.files[0];
    const nameImage = this.avatarFile.name
    const sizeImage = this.avatarFile.size

    if (sizeImage > MAX_FILE_SIZE_UPLOAD) {
      this.toaStr.error(this.translate.instant('STUDENT.CREATE_UPDATE.NOTIFY.IMAGE.MAX'))
      this.avatarFile = this.previousFile || null
      imageInput.value = this.previousImage?.value || null
      return
    }

    if (!EXTENSION_IMAGE.some( extension => nameImage.endsWith(extension))) {
      this.toaStr.error(this.translate.instant('STUDENT.CREATE_UPDATE.NOTIFY.IMAGE.VALID'))
      this.avatarFile = this.previousFile || null
      imageInput.value = this.previousImage?.value || null
      return
    }

    this.previousFile = imageInput.files[0];
    this.previousImage = imageInput
    const reader = new FileReader();
    reader.readAsDataURL(this.avatarFile);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
      this.changeDetectorRef.detectChanges()
    }

  }

  onSubmit() {
    const recursive = (f: FormGroup | FormArray) => {
      for (const i in f.controls) {
        if (typeof f.controls[i].value === "string") {
          if (!Boolean(f.controls[i].value)) {
            f.controls[i].value = null;
          } else {
            f.controls[i].value = f.controls[i].value.trim();
          }
        }
        if (f.controls[i] instanceof FormControl) {
          f.controls[i].markAsDirty();
          f.controls[i].updateValueAndValidity();
        } else {
          recursive(f.controls[i] as any);
        }
      }
    };

    recursive(this.form);

    this.form.enable()

    let body = this.formatBody(this.form.value);

    if (this.form.invalid) {
      this.form.get('teacher').disable();
      return;
    };
    this.isLoading = true
    if (this.avatarFile == null) {
      this.updateOrCreate(body)
      return
    }

    const formData = new FormData()
    formData.append('image', this.avatarFile, this.avatarFile.name)

    this.studentService.upload(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe( {
        next: resp => {
          body.student['avatar'] = resp.data.imageUrl
          this.updateOrCreate(body)
        },
        error: resp => {
          console.log(resp)
        }
      }
    )

  }

  updateOrCreate(body): void {
    if (!Boolean(this.studentCode)) {
      this.createStudent(body)
      return
    }
    this.updateStudent(body)
  }

  createStudent(body): void {
    this.studentService.createStudent(body.student).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res.status === "INTERNAL_SERVER_ERROR") {
          this.toaStr.error(res.message);
          this.isLoading = false
          this.changeDetectorRef.detectChanges()
          return;
        }
        const studentId = res.data.id;
        if (studentId) {
          body.contacts = body.contacts.map(value => ({ ...value, studentId: studentId }));
          this.saveContactStudent(body, this.translate.instant('STUDENT.CREATE_UPDATE.NOTIFY.SUCCESS.CREATE'))
        }
      },
      error: res => {
        console.log(res);
        this.isLoading = false
        this.changeDetectorRef.detectChanges()
      }
    });
  }

  updateStudent(body): void {
    this.studentService.updateStudent(this.studentCode, body.student).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res.status === "INTERNAL_SERVER_ERROR") {
          this.isLoading = false
          this.toaStr.error(res.message);
          this.changeDetectorRef.detectChanges()
          return;
        }
        const studentId = res.data.id;
        if (studentId) {
          body.contacts = body.contacts.map(value => ({ ...value, studentId }));
          this.saveContactStudent(body, this.translate.instant('STUDENT.CREATE_UPDATE.NOTIFY.SUCCESS.UPDATE'))
        }
      },
      error: res => {
        console.log(res);
        this.isLoading = false
        this.changeDetectorRef.detectChanges()
      }
    });
  }

  saveContactStudent(body, message: string): void {
    this.studentService.createContactStudent(body.contacts).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) {
          this.toaStr.success(message);
          this.cancel();
        }
        this.isLoading = false
      },
      error: resp => {
        console.log(resp)
        this.changeDetectorRef.detectChanges()
        this.isLoading = false
      }
    });
  }

  formatBody(data) {
    if (data.birthDay) {
      data.birthDay = new Date(data.birthDay).toISOString();
    }

    if (data.startDate) {
      data.startDate = new Date(data.startDate).toISOString();
    }

    if (data.issuedDate) {
      data.issuedDate = new Date(data.issuedDate).toISOString();
    }

    let student: object = {
      avatar: data.avatar,
      birthDay: data.birthDay,
      classRoomCode: data.classRoomCode,
      code: data.code,
      deptId: data.deptId,
      electFormat: data.electFormat,
      email: data.email,
      fullName: data.fullName,
      gradeId: data.gradeId,
      graduationType: data.graduationType,
      homeTown: data.homeTown,
      identityCard: data.identityCard,
      issuedAddress: data.issuedAddress,
      issuedDate: data.issuedDate,
      nation: data.nation,
      permanentAddress: data.permanentAddress,
      phone: data.phone,
      religion: data.religion,
      sex: data.sex,
      startDate: data.startDate,
      status: data.status,
      temporaryAddress: data.temporaryAddress,
      trainingSystem: data.trainingSystem,
      phoneContact1: data.phoneContact1,
      years: this.currentYear,
      createdName: this.createdName,
      updateName: this.createdName,
    };

    let contacts = [
      {
        id: data.idContact1 ? data.idContact1 : null,
        relationship: data.relationship1,
        phone: data.phoneContact1,
        fullName: data.fullNameContact1,
        primary: 1,
        createdName: this.createdName,
        updateName: this.createdName,
      },
      {
        id: data.idContact2 ? data.idContact2 : null,
        relationship: data.relationship2,
        phone: data.phoneContact2,
        fullName: data.fullNameContact2,
        primary: 0,
        createdName: this.createdName,
        updateName: this.createdName,
      }
    ]
    return { student, contacts }
  }

  cancel() {
    this.router.navigate([`/system/student/student-management`]);
  }

  interceptKeyboard(event): void {
    const keyCode = event.keyCode
    if (keyCode >= KEYCODE_0 && keyCode <= KEYCODE_9) {
      event.preventDefault()
    }
  }

  formatDate(date: string): string {
    const a = new Date(date)
    return `${ a.getFullYear()}-${("0"+a.getMonth()).slice(-2)}-${("0"+a.getDate()).slice(-2)}`
  }

  validateNumber(): ValidatorFn {
    return (form: FormGroup): ValidationErrors => {
      const value = form.value+''
      const result = CommonFunction.validatePhoneNumber(value)
      console.log(value, result)
      if (result == 1 && value.length != 9) {
        return {length9: true}
      }

      if (result == 2 && value.length != 10) {
        return {length10: true}
      }

      return null
    }
  }

  keydownPhone(event: KeyboardEvent) {
    if (this.INTERCEPT_PHONE.includes(event.key)) {
      event.preventDefault()
    }
  }

  translateList(list) {
    list.forEach( x => {
      x.values.length = 0
      x.data.forEach( d => {
        x.values.push({
          name: this.translate.instant(d.name),
          id: d.id,
          color: d.color
        })
      })
    })
  }

  ngOnDestroy() { 
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
