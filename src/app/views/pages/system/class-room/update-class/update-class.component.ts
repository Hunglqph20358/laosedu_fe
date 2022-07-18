import {ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {ToastrService} from 'ngx-toastr';
import {NotiService} from '../../../../../core/service/service-model/notification.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kt-update-class',
  templateUrl: './update-class.component.html',
  styleUrls: ['./update-class.component.scss']
})
export class UpdateClassComponent implements OnInit {
  public action: string ;

  listYears;

  deptId:any = null;
  subjectId:any;
  teacherId:any;

  gradeList: any = [];
  departmentList: any = [];
  subjectList: any = [];
  teacherList: any = [];
  pattern = /^\S{0,50}$/;
  classroomAddForm: FormGroup;
  //
  listDemo =[
    {
      id:1,
      name:'Demo'
    }
  ];
  selectDemo;
  years;
  gradeId;

  isFirstLoad;

  placeholder
  constructor(public dialogRef: MatDialogRef<UpdateClassComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private classroomService: ClassroomService,
              private changeDetectorRef: ChangeDetectorRef,
              private translate: TranslateService) {
    this.placeholder = this.translate.instant('TRANSFER_STUDENTS.SELECT_PLACEHOLDER');
    this.action = data.action;
    this.data = data;
    this.gradeList = data.gradeList;
    this.years = data.years;
    this.listYears = [{years: this.years}];
    this.buildForm();
    console.log(data, 'data update');
  }

  ngOnInit(): void {
    this.isFirstLoad = true;
    this.loadForm();
  }

  buildForm() {
    this.classroomAddForm = this.fb.group({
      years: [''],
      gradeLevel: [null, Validators.required],
      deptId: [null, Validators.required],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      specialize: [null],
      teacherId: [null, Validators.required]
    });
    this.classroomAddForm.get('years').setValue(this.years);
    this.classroomAddForm.get('deptId').valueChanges.subscribe(val => {
      this.deptId = val;
      if (this.action === 'edit' && this.isFirstLoad) {
        this.isFirstLoad = false;
        this.autoSearchSubject({
          term: this.data.specializeCode === null || this.data.specializeCode === undefined
            ? ''
            : this.data.specializeCode
        });
      } else {
        this.classroomAddForm.get('specialize').setValue(null);
        this.autoSearchSubject({term: ''});
      }
    });
  }

  autoSearchDept(event) {
    const dept: any = {};
    dept.name = event.term;
    this.classroomService.autoSearchDept(dept).subscribe(res => {
      this.departmentList = res.map(item => {
        return {
          ...item,
          deptIdName: item.code + ' - ' + item.name
        }
      });
      console.log(this.departmentList);
      this.changeDetectorRef.detectChanges();
    });
  }

  autoSearchTeacher(event) {
    const teacher: any = {};
    teacher.fullName = event.term?.trim();
    console.log('teacher search',teacher)
    this.classroomService.autoSearchTeacher(teacher).subscribe(res => {
      this.teacherList = res.map( item => {
        return {...item, teacherNameCode: item.code + ' - ' + item.fullName};
      });
      this.changeDetectorRef.detectChanges();
    });

  }

  autoSearchSubject(event) {
    if (this.deptId === 0 || this.deptId === null) {
      console.log('chua chon dept')
      return;
    }
    const subject: any = {};
    subject.name = event.term;
    this.classroomService.autoSearchSubject(subject, this.deptId).subscribe(res => {
      this.subjectList = res.map(item => {
        return {
          ...item,
          subjectNameCode: item.code + ' - ' + item.name
        }
      });
      console.log(this.subjectList);
    });
  }

  // =============== Form edit ========================
  loadForm() {
    if (this.action === 'edit') {
      this.autoSearchTeacher({term: this.data.teacherCode})
      this.autoSearchDept({term: this.data.deptCode});
      for (const controlName in this.classroomAddForm.controls) {
        this.classroomAddForm.get(controlName).setValue(this.data[controlName]);
      }
      this.classroomAddForm.get('code').disable();
    } else {
      this.autoSearchTeacher({term: ''});
      this.autoSearchDept({term: ''});
    }
  }

  // ============================================ Add new ==================================
  add() {
    const addData: any = {};
    // tslint:disable-next-line:forin
    for (const controlName in this.classroomAddForm.controls) {
      addData[controlName] = this.classroomAddForm.get(controlName).value;
    }
    addData.code = addData.code.trim();
    addData.name = addData.name.trim();
    console.log(addData)
    // Call API
    this.classroomService.addClassroom(addData).subscribe(responseAPI => {
      if (responseAPI.status === 'OK') {
        this.dialogRef.close({event: this.action, data:responseAPI});
      } else if(responseAPI.status === 'BAD_REQUEST'){
        this.toastr.error(responseAPI.message);
      }
    });
  }

  // ========================================= Update ===========================================
  edit() {
    const eidtData: any = {};
    for (const controlName in this.classroomAddForm.controls) {
      eidtData[controlName] = this.classroomAddForm.get(controlName).value;
    }
    eidtData.id = this.data.id;
    eidtData.code = eidtData.code.trim();
    eidtData.name = eidtData.name.trim();

    console.log(eidtData)
    // Call API
    this.classroomService.updateClassroom(eidtData).subscribe(responseAPI => {
      if (responseAPI.status === 'OK') {
        this.dialogRef.close({event: this.action,
          data: responseAPI
        });
      }else if (responseAPI.status === 'BAD_REQUEST') {
        console.log(responseAPI);
        this.toastr.error(responseAPI.message);
      }
    });
  }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }

  // ===================== validate code======================
  listenCode(control:string) {
    const keyword = this.classroomAddForm.controls[control].value;
    this.classroomAddForm.controls[control].setValue(keyword.trim());
  }
}

