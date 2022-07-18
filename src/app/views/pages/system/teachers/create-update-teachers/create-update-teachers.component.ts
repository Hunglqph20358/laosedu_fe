import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, Form, FormGroup, FormArray, FormControl, NgModel } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Teacher, SpecializeLevel, ForeignLanguage, JobTransferHistoryOut, AddTeacherDTO } from 'src/app/core/service/model/teacher.model';
import { TeacherService } from '../../../../../core/service/service-model/teacher.service';
import * as moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { StudentsService } from 'src/app/core/service/service-model/students.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {DepartmentService} from '../../../../../core/service/service-model/unit.service';
import {AuthService} from '../../../../../core/auth';
import {ViewFileComponent} from '../teacher-profile/view-file/view-file.component';
import {MatDialog} from '@angular/material/dialog';
import {CommonFunction} from '../../../../../core/service/utils/common-function';
import {KEYCODE_0, KEYCODE_9, PHONE_9_NUMBER} from '../../../../../helpers/constants';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-create-update-teachers',
  templateUrl: './create-update-teachers.component.html',
  styleUrls: ['./create-update-teachers.component.scss']
})
export class CreateUpdateTeachersComponent implements OnInit {
  constructor(private modalService: BsModalService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private teacherService: TeacherService,
    private studentService: StudentsService,
    private deparmentService: DepartmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private translate: TranslateService) {
      this.route.queryParams.subscribe(params => {
        this.idTeacher = params.id;
    });

    this.itemTecher = new Teacher();
    this.itemTecher.unionMember = 0;
    this.itemTecher.partyMember = 0;
    this.itemTecher.status = 1;
    this.itemTecher.contractType = 1;
    this.itemTecher.sex = 0;
    this.itemTecher.contractName = this.translate.instant('TEACHER.CREATE.EMBODY');
    this.itemTecher.sexStr = this.translate.instant('TEACHER.CREATE.MALE');
    this.itemTecher.marriageStatusStr = this.translate.instant('TEACHER.CREATE.SINGLE');
    // them moi bang dai hoc mac dinh
    // this.itemSpecializeLevel = new SpecializeLevel();// dai hoc-sau dai hoc
    // this.itemSpecializeLevel.sysEdu = 1;
    // this.itemSpecializeLevel.levelType = 1;
    // this.listSpecializeLevel.push(this.itemSpecializeLevel);
    // this.itemSpecializeLevel = new SpecializeLevel();
    // this.itemSpecializeLevel.levelType = 2;
    // this.listSpecializeLevel.push(this.itemSpecializeLevel);
    // them moi ngoai ngu mac dinh
    // this.itemForeignLanguage = new ForeignLanguage();// ngoai ngu
    // this.listForeignLanguage.push(this.itemForeignLanguage);
    // them moi lich su lam viec
    // this.itemJobTransferHistoryOut = new JobTransferHistoryOut();// lich su lam viec
    // this.listJobTransferHistoryOut.push(this.itemJobTransferHistoryOut);
    if (this.idTeacher) {
      this.update = true;
      this.getInfoTeacher(this.idTeacher);
    } else {
      this.update = false;
      this.createInfoTeacher();
    }
  }
  modalRef: BsModalRef;
  public itemTecher: Teacher;
  public itemTecherDT0: AddTeacherDTO;
  public itemSpecializeLevel: SpecializeLevel;
  public itemForeignLanguage: ForeignLanguage;
  public positionList;
  public itemJobTransferHistoryOut: JobTransferHistoryOut;unsubscribe$ = new Subject<void>();
  listJobTransferHistoryOuts: any = {};
  update = false;
  selectDemo;
  listDemo = [
    {
      id: 1,
      name: 'Demo'
    }
  ];

  listHD = [
    {
      id: 0,
      name: this.translate.instant('TEACHER.CREATE.CONTRACT')
    },
    {
      id: 1,
      name: this.translate.instant('TEACHER.CREATE.EMBODY')
    }
  ];
  listTTHN = [
    {
      id: 0,
      name: this.translate.instant('TEACHER.CREATE.SINGLE')
    },
    {
      id: 1,
      name: this.translate.instant('TEACHER.CREATE.MARRIED')
    }
  ];
  listGT = [
    {
      id: 0,
      name: this.translate.instant('TEACHER.CREATE.MALE')
    },
    {
      id: 1,
      name: this.translate.instant('TEACHER.CREATE.FEMALE')
    }
  ];
  listTD = [
    {
      id: 1,
      name: this.translate.instant('TEACHER.LEVEL.UNIVERSITY')
    },
    {
      id: 2,
      name: this.translate.instant('TEACHER.LEVEL.MASTER')
    },
    {
      id: 3,
      name: this.translate.instant('TEACHER.LEVEL.DOCTOR')
    }
  ];
  listTT = [
    {
      id: 0,
      name: this.translate.instant('TEACHER.LIST_STATUS.STATUS_WORKING')
    },
    {
      id: 1,
      name:  this.translate.instant('TEACHER.LIST_STATUS.STATUS_NOT_WORKING')
    }
  ];
  listHDT = [
    {
      id: 0,
      name: this.translate.instant('TEACHER.LEVEL.IN_OFFICE')
    },
    {
      id: 1,
      name: this.translate.instant('TEACHER.LEVEL.FORMAL')
    }
  ]
  sex = 0;
  marriageStatus;
  sysEdu;
  listDeptParent;
  deptParent;
  frmTeacher: FormGroup;
  listTeacher = [];
  listSpecializeLevel = [];
  listForeignLanguage = [];
  listJobTransferHistoryOut = [];
  listPosition = [];
  deptParentId;
  listDept = [];
  listSubjectParent = [];
  errorCB = false;
  errorCBMessage = '';
  errorPhone = false;
  errorPhoneMessage = '';
  listAllTeacher =[];
  idTeacher: number;
  check = false;
  color;
  fullName;
 formData: FormData;
 // id dv
  idDV: any;
  // id khoa
  idKhoa: any = null;
  // id bomon
  idBoMon: any = null;
  typeImportInsert = 0;
  listDepartment: [];
  imageUrl = null;
  avatarFile: File;
  avatarName: any;
  a: File;

  fileUniversity: File;
  fileUniversityName: any;
  fileUniversityUrl: any;

  fileCertificate: File[];
  fileCertificateName: any;
  fileCertificateUrl: any;
  // List lưu chứng chỉ
  arrBufferFile: any[] = [];
  listFileCertificate: any[] = [];
  // Bằng thạc sỹ
  fileMaster: File;
  fileMasterName: any;
  // Bằng tiến sỹ
  fileDoctor: File;
  fileDoctorName: any;
  hide = true;
  pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 getAllTeacher(){
  this.teacherService.getAllTeacher().subscribe(res => {
    this.listAllTeacher = res;
  })
 }

  ngOnInit() {
    this.getListDV();
    this.getAuthority();
    this.getAllTeacher();
    //this.getColor();
  }
  addNewSpecializeLevel() {// add new băng thạc sỹ/ tiến sỹ
    this.itemSpecializeLevel = new SpecializeLevel();
    this.itemSpecializeLevel.sysEdu = 2;
    this.listSpecializeLevel.push(this.itemSpecializeLevel)
  }
  addNewForeignLanguage() {// add new ngoai ngu
    this.itemForeignLanguage = new ForeignLanguage();
    this.listForeignLanguage.push(this.itemForeignLanguage);
  }
  addNewJobTransferHistoryOut() {// add new cong viec
    this.itemJobTransferHistoryOut = new JobTransferHistoryOut();
    this.listJobTransferHistoryOut.push(this.itemJobTransferHistoryOut);
  }

  // Load đơn vị
  getListDV() {
    this.teacherService.getParentDeptNull().then((res: []) => {
      if (res.length > 0) {
        this.listDeptParent = res;
        // @ts-ignore
        this.idDV = this.listDeptParent[0].id;
        this.itemTecher.unitName = this.listDeptParent[0].name;
        let list = [];
        res.forEach(item=>{
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        })
        this.listDeptParent = list;
      }
      this.getdeptParent(this.idDV);
      this.changeDetectorRef.detectChanges();
    })
  }

  // Chức vụ
  getAuthority() {
    this.teacherService.getAuthority().subscribe(res => {
      // this.listPosition = res;
      let list = [];
      res.forEach(item => {
        let customItem = {};
        let posionName = '';
        if(item.code === 'ROLE_HT')
          posionName = this.translate.instant('TEACHER.POSITION_LIST.PRINCIPAL');
        else if(item.code === 'ROLE_HP')
          posionName = this.translate.instant('TEACHER.POSITION_LIST.ASSISTANT_PRINCIPAL');
        else if(item.code === 'ROLE_TK')
          posionName =this.translate.instant('TEACHER.POSITION_LIST.LEADER_DEPARTMENT');
        else if(item.code === 'ROLE_GVBM')
          posionName = this.translate.instant('TEACHER.POSITION_LIST.TEACHER_SUBJECT');
        else
          posionName = this.translate.instant('TEACHER.POSITION_LIST.TEACHER_HOMEROOM');
        customItem = {...item, name: posionName};
        list = [...list, customItem];
      });
      this.listPosition = list;
      this.changeDetectorRef.detectChanges();
    })
  }
  // List khoa
  changedeptParent() {
    this.listDept = [];
    this.idKhoa = null;
    this.idBoMon = null;
    // Lấy tên đơn vị
    this.teacherService.getDepartmentsById(this.idDV).subscribe(re=>{
      this.itemTecher.unitName = re.name;
    })
    this.teacherService.
    getDeptByParent(this.idDV).then((res: []) => {
      this.changeDetectorRef.detectChanges();
      if (res.length > 0) {
        this.listDept = res;
        let list = [];
        res.forEach(item => {
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        });
        this.listDept = list;
      }
      this.changeDeptId();
      this.changeDetectorRef.detectChanges();
    })
  }

  getdeptParent(id: any){
    this.teacherService.getDeptByParent(this.idDV).then((res: []) => {
      this.changeDetectorRef.detectChanges();
      if (res.length > 0) {
        this.listDept = res;
        let list = [];
        res.forEach(item => {
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        });
        this.listDept = list;
      }
        // this.getSubjectParent(res[0].id);
      this.changeDetectorRef.detectChanges();
    })
  }

  // List tổ bộ môn
  changeDeptId() {
   this.listSubjectParent = [];
    this.idBoMon = null;
    // Lấy tên khoa
    this.teacherService.getDepartmentsById(this.idKhoa).subscribe(re=>{
      this.itemTecher.deptName = re.name;
    })
    this.teacherService.getDeptByParent(this.idKhoa).then((res: []) => {
      if (res.length > 0) {
        this.listSubjectParent = res;
        let list = [];
        res.forEach(item => {
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        });
        this.listSubjectParent = list;
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  changeSubjectParent(){
    // Lấy tên bộ môn
    this.teacherService.getDepartmentsById(this.idBoMon).subscribe(re=>{
      this.itemTecher.subjectParentName = re.name;
    })
  }

  getSubjectParent(id: any){
    this.teacherService.getDeptByParent(this.idKhoa).then((res: []) => {
      if (res.length > 0) {
        this.listSubjectParent = res;
        let list = [];
        res.forEach(item => {
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        });
        this.listSubjectParent = list;
      }
      this.changeDetectorRef.detectChanges();
    })
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }

  cancelImport() {
    this.modalRef.hide()
  }

  save() {
    // Thêm mới
    if(this.itemTecher.phone === null || this.itemTecher.phone === '' || this.itemTecher.phone === undefined){
      this.errorPhone = true;
      this.errorPhoneMessage = this.translate.instant('TEACHER.MSG.PHONE_BLANK');
      return;
    }
    if(this.itemTecher.code === null || this.itemTecher.code === '' || this.itemTecher.code === undefined){
      this.errorPhone = true;
      this.errorPhoneMessage = this.translate.instant('TEACHER.MSG.TEACHER_CODE_BLANK');
      return;
    }
    if(this.checkDateBirthDay===true){
      return;
    }
    if(this.listDept.length > 0 && (this.idKhoa === null || this.idKhoa === undefined)){
      return;
    }
    if(this.listSubjectParent.length > 0 && (this.idBoMon === null || this.idBoMon === undefined)){
      return;
    }
    if(this.positionList.length === 0 || this.errorPhone === true || this.errorCB === true){
      return;
    }
    if (this.idTeacher === null || this.idTeacher === undefined) {
      this.itemTecherDT0 = new AddTeacherDTO();
      // lưu deptId
      // if(this.idBoMon !== undefined || this.idBoMon !== null){
      if(this.idBoMon !== null){
        this.itemTecher.deptId = this.idBoMon;
      // }else if(this.idKhoa !== undefined || this.idKhoa !== null){
      }else if(this.idKhoa !== null){
        this.itemTecher.deptId = this.idKhoa;
      }else{
        this.itemTecher.deptId = this.idDV;
      }
      // Mặc định trạng thái đang làm việc
      this.itemTecher.status = 0;
      // Checkbox khi chọn
      if(this.itemTecher.unionMember === 0){
        this.itemTecher.dateUnionMember = null;
        this.itemTecher.adrOfUnionMember = null;
      }
      if(this.itemTecher.partyMember === 0){
        this.itemTecher.datePartyMember = null;
        this.itemTecher.adrOfPartyMember = null;
      }
      this.itemTecherDT0.teacherDTO = this.itemTecher;
      this.itemTecherDT0.specializeLevelList = this.listSpecializeLevel;
      this.itemTecherDT0.jobTransferHistoryOutDTOList = this.listJobTransferHistoryOut;
      this.itemTecherDT0.foreignLanguageDTOList = this.listForeignLanguage;
      this.itemTecherDT0.positionList = this.positionList;
      console.log(this.itemTecherDT0);
      // insert file
      const formData = new FormData();
      const rqStr = JSON.stringify(this.itemTecherDT0);
      formData.append('dto', new Blob([rqStr], {type: 'application/json'}));
      // Bằng tốt nghiệp đại học
      if(this.fileUniversity !== undefined){
        formData.append('fileUniversity', this.fileUniversity[0]);
      }
      // Chứng chỉ
      if(this.fileCertificate !== undefined){
        // tslint:disable-next-line:prefer-for-of
        for(let i=0;i<this.fileCertificate.length;i++){
          formData.append('fileCertificate', this.fileCertificate[i]);
        }
      }
      // Ảnh avatar
      if(this.avatarFile !== undefined){
        formData.append('avatar', this.avatarFile);
      }
      // Bằng thạc sỹ
      if(this.fileMaster !== undefined){
        formData.append('fileMaster', this.fileMaster[0]);
      }
      // Bằng tiến sỹ
      if(this.fileDoctor !== undefined){
        formData.append('fileDoctor', this.fileDoctor[0]);
      }

      this.hide = false;
      this.teacherService.create(formData).subscribe(
        (res: any) => {
          if (res.status === 'OK') {
            this.toastr.success(this.translate.instant('TEACHER.MSG.CREATE_SUCCESS'));
            this.redirect();
          } else if (res.status === 'INTERNAL_SERVER_ERROR') {
            this.hide = true;
            this.toastr.error(res.message);
          }
        }
      )
    } else {
      // Update
      this.itemTecherDT0 = new AddTeacherDTO();
      if(this.idBoMon !== null){
        this.itemTecher.deptId = this.idBoMon;
      }else if(this.idKhoa !== null){
        this.itemTecher.deptId = this.idKhoa;
      }else{
        this.itemTecher.deptId = this.idDV;
      }
      this.itemTecherDT0.teacherDTO = this.itemTecher;
      this.itemTecherDT0.specializeLevelList = this.listSpecializeLevel;
      this.itemTecherDT0.jobTransferHistoryOutDTOList = this.listJobTransferHistoryOut;
      this.itemTecherDT0.foreignLanguageDTOList = this.listForeignLanguage;
      this.itemTecherDT0.positionList = this.positionList;
      this.fullName = this.itemTecher.fullName?this.itemTecher.fullName.trim():'';
      if(this.fullName === '' || this.fullName === undefined){
          return;
      }
      // update file
      const formData = new FormData();
      const rqStr = JSON.stringify(this.itemTecherDT0);
      formData.append('dto', new Blob([rqStr], {type: 'application/json'}));
      // Bằng tốt nghiệp đại học
      if(this.fileUniversity !== undefined){
        formData.append('fileUniversity', this.fileUniversity[0]);
      }
      // Chứng chỉ
      if(this.fileCertificate !== undefined){
        // tslint:disable-next-line:prefer-for-of
        for(let i=0;i<this.fileCertificate.length;i++){
          formData.append('fileCertificate', this.fileCertificate[i]);
        }
      }
      // Ảnh avatar
      if(this.avatarFile !== undefined){
        formData.append('avatar', this.avatarFile);
      }
      // Bằng thạc sỹ
      if(this.fileMaster !== undefined){
        formData.append('fileMaster', this.fileMaster[0]);
      }
      // Bằng tiến sỹ
      if(this.fileDoctor !== undefined){
        formData.append('fileDoctor', this.fileDoctor[0]);
      }
      this.hide = false;
      this.teacherService.updateTeacher(this.idTeacher, formData).subscribe(
        (res: any) => {
          if (res.status === 'OK') {
            this.toastr.success(this.translate.instant('TEACHER.MSG.UPDATE_SUCCESS'));
            this.redirect();
          } else if (res.status === 'INTERNAL_SERVER_ERROR') {
            this.hide = true;
            this.toastr.error(res.message);
          }
        }
      )
    }
  }
  checkValue(event: any, type) {
    if (type === 1) {
      this.itemTecher.unionMember = event;
      console.log('unionMember', this.itemTecher.unionMember);
    } else {
      this.itemTecher.partyMember = event;
      console.log('partyMember', this.itemTecher.partyMember);
    }

  }
  // check Date
  isDate(s) {
    if (isNaN(s) && !isNaN(Date.parse(s)))
      return true;
    else return false;
  }

  isTeacherPhone($event) {
    const phone = $event.target.value;
    this.teacherService.getTeacherByPhone(phone).subscribe(res => {
      if (res.length > 0)
        this.errorPhone = true;
      if (res.length === 0)
        this.errorPhone = false;
    })
  }

  validateTeacherPhone(){
   if(this.itemTecher.phone === null || this.itemTecher.phone === ''){
     this.errorPhone = true;
     this.errorPhoneMessage = this.translate.instant('TEACHER.MSG.PHONE_BLANK');
     return;
   }else{
    const a = this.itemTecher.phone.toString().slice(0, 3);

    const result = CommonFunction.validatePhoneNumber(this.itemTecher.phone);
    if(result === 1){
      this.errorPhone = true;
      this.errorPhoneMessage = this.translate.instant('TEACHER.MSG.PHONE_MAXLENT_9');
      return;
    }else if(result === 2){
      this.errorPhone = true;
      this.errorPhoneMessage = this.translate.instant('TEACHER.MSG.PHONE_MAXLENT_10');
      return;
    }else if(result === 3){
      this.errorPhone = true;
      this.errorPhoneMessage = this.translate.instant('TEACHER.MSG.PHONE_NOT_FORMAT');
      return;
    }
     this.teacherService.getTeacherByPhone(this.itemTecher.phone).subscribe(res => {
       if (res.length > 0){
         this.errorPhone = true;
         this.errorPhoneMessage = this.translate.instant('TEACHER.MSG.PHONE_EXIST');
       }
       if (res.length === 0)
         this.errorPhone = false;
     })
   }
   this.errorPhone = false;
  }

  validateTeacherCode(){
   if(this.itemTecher.code === null || this.itemTecher.code === undefined || this.itemTecher.code === ''){
     this.errorCB = true;
     this.errorCBMessage = this.translate.instant('TEACHER.MSG.TEACHER_CODE_BLANK');
     return;
   }else{
     if(this.itemTecher.code.length > 50){
       this.errorCB = true;
       this.errorCBMessage = this.translate.instant('TEACHER.MSG.TEACHER_CODE_MAXLENT');
       return;
     }
     const code = this.itemTecher.code.trim().split(' ');
     if(code.length > 1){
       this.errorCB = true;
       this.errorCBMessage = this.translate.instant('TEACHER.MSG.TEACHER_CODE_SPACE');
       return;
     }else{
       this.errorCB = false;
     }
     this.teacherService.getTeacherByTeacherCode(this.itemTecher.code).subscribe(res => {
       if (res !== null){
         this.errorCB = true;
          this.errorCBMessage = this.translate.instant('TEACHER.MSG.TEACHER_CODE_EXIST');
       }
       else
         this.errorCB = false;
     })
   }
  }

  changeSpecializeLevels(id) {// thay doi  trinh do

   if(id === 1)
     this.itemTecher.specializeLevelStr = this.translate.instant('TEACHER.LEVEL.UNIVERSITY');
   else if(id === 2)
     this.itemTecher.specializeLevelStr = this.translate.instant('TEACHER.LEVEL.MASTER');
   else
     this.itemTecher.specializeLevelStr = this.translate.instant('TEACHER.LEVEL.DOCTOR');
    this.itemTecher.specializeLevel = id;
    console.log(this.itemTecher.specializeLevel);
    if (this.itemTecher.specializeLevel === 2) {
      if (this.listSpecializeLevel.length === 1) {
        this.itemSpecializeLevel = new SpecializeLevel();
        this.itemSpecializeLevel.levelType = 2;
        this.listSpecializeLevel.push(this.itemSpecializeLevel)
      }
      if (this.listSpecializeLevel.length === 2) {

      }
      if (this.listSpecializeLevel.length === 3) {
        this.listSpecializeLevel.pop();
      }
    }

    if (this.itemTecher.specializeLevel === 3) {
      if (this.listSpecializeLevel.length === 1) {
        this.itemSpecializeLevel = new SpecializeLevel();
        this.itemSpecializeLevel.levelType = 2;
        this.listSpecializeLevel.push(this.itemSpecializeLevel);

        this.itemSpecializeLevel = new SpecializeLevel();
        this.itemSpecializeLevel.levelType = 3;
        this.listSpecializeLevel.push(this.itemSpecializeLevel)
      }
      if (this.listSpecializeLevel.length === 2) {
        this.itemSpecializeLevel = new SpecializeLevel();
        this.itemSpecializeLevel.levelType = 3;
        this.listSpecializeLevel.push(this.itemSpecializeLevel)
      }
    }
    console.log(this.listSpecializeLevel);
  }
  // End


  createInfoTeacher() {
    this.itemTecher = new Teacher();
    this.itemTecher.unionMember = 0;
    this.itemTecher.partyMember = 0;
    this.itemTecher.status = 0;
    this.itemTecher.contractType = 1;
    this.itemTecher.specializeLevel = 1;
    this.itemTecher.sex = 0;
    this.itemTecher.position= [];
    this.itemTecher.contractName = this.translate.instant('TEACHER.CREATE.EMBODY');
    this.itemTecher.sexStr = this.translate.instant('TEACHER.CREATE.MALE');
    this.itemTecher.specializeLevelStr = this.translate.instant('TEACHER.LEVEL.UNIVERSITY');
    // this.itemTecher.marriageStatusStr = 'Độc thân';
    // them moi bang dai hoc mac dinh
    this.itemSpecializeLevel = new SpecializeLevel();// dai hoc-sau dai hoc
    this.itemSpecializeLevel.sysEdu = 1;
    this.itemSpecializeLevel.levelType = 1;
    this.listSpecializeLevel.push(this.itemSpecializeLevel);

    this.itemSpecializeLevel = new SpecializeLevel();
    this.itemSpecializeLevel.levelType = 2;
    this.listSpecializeLevel.push(this.itemSpecializeLevel);
    // them moi ngoai ngu mac dinh
    this.itemForeignLanguage = new ForeignLanguage();// ngoai ngu
    this.listForeignLanguage.push(this.itemForeignLanguage);
    // them moi lich su lam viec
    this.itemJobTransferHistoryOut = new JobTransferHistoryOut();// lich su lam viec
    this.listJobTransferHistoryOut.push(this.itemJobTransferHistoryOut);
  }

  convert(date:any){
    // tslint:disable-next-line:only-arrow-functions
    const values = date.split('-').map(function(v) {
      return v.replace(/\D/g, '')
    });
    console.log('values',values);
    return {
      // tslint:disable-next-line:radix
      year: parseInt(values[0]),
      // tslint:disable-next-line:radix
      month: parseInt(values[1]),
      // tslint:disable-next-line:radix
      day : parseInt(values[2])
    }
  }

  getInfoTeacher(id) {
    this.teacherService.getInforById(id).then((res: any) => {
      this.itemTecher = res;
      this.changeDetectorRef.detectChanges();
      if (this.itemTecher.startDate) {
        this.itemTecher.dateStart = this.datePipe.transform(new Date(res.startDate), 'yyyy-MM-dd');
      }
      if (this.itemTecher.birthDay) {
        // this.itemTecher.dayBirth = this.datePipe.transform(new Date(res.birthDay), 'yyyy-MM-dd');

        console.log('res.birthDay',res.birthDay);
        this.itemTecher.dayBirth = this.convert(formatDate(new Date(res.birthDay),'yyyy-MM-dd','en_US').toString());
        console.log('date',formatDate(new Date(res.birthDay),'yyyy-MM-dd','en_US').toString());
        console.log('date',this.convert(formatDate(new Date(res.birthDay),'yyyy-MM-dd','en_US').toString()));

      }
      if (this.itemTecher.issuedDate) {
        this.itemTecher.dateIssued = this.datePipe.transform(new Date(res.issuedDate), 'yyyy-MM-dd');
      }
      if (this.itemTecher.dateOfPartyMember) {
        this.itemTecher.datePartyMember = this.datePipe.transform(new Date(res.dateOfPartyMember), 'yyyy-MM-dd');
      }
      if (this.itemTecher.dateOfUnionMember) {
        this.itemTecher.dateUnionMember = this.datePipe.transform(new Date(res.dateOfUnionMember), 'yyyy-MM-dd');
      }
      // Khoa
      // this.itemTecher.deptId = res.deptId;
      this.itemTecher.subjectParentId = res.subjectParentId;
      // Loại hợp đồng
      if (this.itemTecher.contractTypeStr === 'Biên chế')
        this.itemTecher.contractType = 1;
      else
        this.itemTecher.contractType = 0;
      // Giới tính
      if (this.itemTecher.sexStr === 'Nam')
        this.itemTecher.sex = 0;
      else
        this.itemTecher.sex = 1;
      // Tính trạng hôn nhân
      if (this.itemTecher.marriageStatusStr === 'Độc thân')
        this.itemTecher.marriageStatus = 0;
      else
        this.itemTecher.marriageStatus = 1;
      // Tình trạng
      if (this.itemTecher.statusStr === 'Đang làm việc')
        this.itemTecher.status = 0;
      else
        this.itemTecher.status = 1;
      // Trình độ
      this.itemTecher.specializeLevel = res.specializeLevel;
      if(this.itemTecher.specializeLevel === 1)
        this.itemTecher.specializeLevelStr = this.translate.instant('TEACHER.LEVEL.UNIVERSITY');
      else if(this.itemTecher.specializeLevel === 2)
        this.itemTecher.specializeLevelStr = this.translate.instant('TEACHER.LEVEL.MASTER');
      else
        this.itemTecher.specializeLevelStr = this.translate.instant('TEACHER.LEVEL.DOCTOR');
      // Chức vụ
      this.positionList = this.itemTecher.position;
      // Đon vị. Khoa, Bộ môn
      this.idDV = this.itemTecher.unitId;
      this.changedeptParent();
      this.idKhoa = this.itemTecher.deptParentId;
      this.changeDeptId();
      this.idBoMon = this.itemTecher.subjectParentId;
      if(this.itemTecher.contractType === 0)
        this.itemTecher.contractName = this.translate.instant('TEACHER.CREATE.CONTRACT');
      else
        this.itemTecher.contractName = this.translate.instant('TEACHER.CREATE.EMBODY');
      console.log(this.itemTecher);
      // ================================Lịch sử làm việc======================================
      if(res.jobTransferHistoryOutList.length === 0){
        this.itemJobTransferHistoryOut = new JobTransferHistoryOut();// lich su lam viec
        this.listJobTransferHistoryOut.push(this.itemJobTransferHistoryOut)
      }else{
        this.listJobTransferHistoryOut = res.jobTransferHistoryOutList.map(e =>{
          if(e.startDate !== null && e.endDate !== null){
            return {
              ...e,
              dateStart: this.datePipe.transform(new Date(e.startDate), 'yyyy-MM-dd'),
              dateEnd: this.datePipe.transform(new Date(e.endDate), 'yyyy-MM-dd')
            }
          }else if(e.startDate === null && e.endDate !== null) {
            return {
              ...e,
              dateEnd: this.datePipe.transform(new Date(e.endDate), 'yyyy-MM-dd')
            }
          }else if(e.startDate !== null && e.endDate === null){
            return {
              ...e,
              dateStart: this.datePipe.transform(new Date(e.startDate), 'yyyy-MM-dd')}
          }else if(e.startDate === null && e.endDate === null) {
            return e
          }
        })
      }
      console.log(this.listJobTransferHistoryOut);
      // =================================================================================
      if(res.foreignLanguageList.length === 0){
        this.itemForeignLanguage = new ForeignLanguage();// ngoai ngu
        this.listForeignLanguage.push(this.itemForeignLanguage);
      }else{
        this.listForeignLanguage = res.foreignLanguageList;
      }
      if(res.specializeLevels.length === 0){
        this.itemSpecializeLevel = new SpecializeLevel();// dai hoc-sau dai hoc
        this.itemSpecializeLevel.sysEdu = 1;
        this.itemSpecializeLevel.levelType = 1;
        this.listSpecializeLevel.push(this.itemSpecializeLevel);
      }else{
        this.listSpecializeLevel = res.specializeLevels;
      }
      // avatar
      if (this.itemTecher.avatar != null) {
        // this.imageUrl = 'data:image/jpeg;base64,' + this.itemTecher.avatarByte;
        this.imageUrl = this.itemTecher.avatar;
      }
      // Bằng đại học
      const listUniversity = this.itemTecher.specializeLevelsDtos.filter(i => i.levelType === 1);
      // Bằng thạc sỹ
      const listMaster = this.itemTecher.specializeLevelsDtos.filter(i => i.levelType === 2);
      // Bằng tiến sỹ
      const listDoctor = this.itemTecher.specializeLevelsDtos.filter(i => i.levelType === 3);
      if (listUniversity.length > 0) {
        this.fileUniversityUrl = listUniversity[0].diplomaByte[0];
        // tslint:disable-next-line:max-line-length
        const nameFile = listUniversity[0].degreePath.slice(listUniversity[0].degreePath.lastIndexOf('saved') + 6, listUniversity[0].degreePath.length);
        this.fileUniversityName = nameFile;
      }
      if(listMaster.length > 0){
        const nameFile = listMaster[0].degreePath.slice(listMaster[0].degreePath.lastIndexOf('saved') + 6, listMaster[0].degreePath.length);
        this.fileMasterName = nameFile;
      }
      if(listDoctor.length > 0){
        const nameFile = listDoctor[0].degreePath.slice(listDoctor[0].degreePath.lastIndexOf('saved') + 6, listDoctor[0].degreePath.length);
        this.fileDoctorName = nameFile;
      }
      // List chứng chỉ
      // if(this.itemTecher.certificatePath !== null){
      //     let listData2 = [];
      //     this.itemTecher.certificatePathList.forEach(item => {
      //       let a = {};
      //       const pathFile:string = item;
      //       const nameFile = pathFile.slice(pathFile.lastIndexOf('saved') + 6, pathFile.length);
      //       a = {...this.arrBufferFile, name: nameFile, path: item};
      //       listData2 = [...listData2, a];
      //     })
      //     this.arrBufferFile = listData2;
      //     console.log(this.arrBufferFile);
      //     console.log(listData2)
      // }
      // Trình độ đào tạo
      // if(this.itemTecher.specializeLevel === null){
      //   this.itemTecher.specializeLevel = 1;
      // }
      this.changeDetectorRef.detectChanges();
    })
  }

  processFile(imageInput) {
    this.a = imageInput.files[0];
    if(this.a.type === 'image/jpeg' || this.a.type === 'image/png'){
      this.avatarFile = imageInput.files[0];
      this.avatarName = this.avatarFile.name;
      console.log(this.avatarFile)
      const reader = new FileReader();
      reader.readAsDataURL(this.avatarFile);
      reader.onload = (_event) => {
        this.imageUrl = reader.result;
        this.changeDetectorRef.detectChanges();
      }
    }else{
      this.toastr.error(this.translate.instant('TEACHER.IMPORT.MAX'));
      return;
    }
  }
  // Check if update change text color of teacherCode and status

  // getColor(){
  //   return this.update !== true;
  // }
  // Sau khi thêm mới thành công
  redirect() {
    this.router.navigate([`/system/teacher/teacher-management`]);
  }
  // Bằng đại học
  selectFile(uploadDiploma) {
    if(uploadDiploma.files[0].type !== 'application/pdf'){
      this.toastr.error(this.translate.instant('TEACHER.IMPORT.FILE_NOT_FORMAT'));
      return;
    }
    if(uploadDiploma.files[0].size > 5242880){
      this.toastr.error(this.translate.instant('TEACHER.IMPORT.MAX'));
      return;
    }
    this.fileUniversity = uploadDiploma.files;
    this.fileUniversityName = this.fileUniversity[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(uploadDiploma.files[0]);
    reader.onload = (_event) => {
      this.fileUniversityUrl = reader.result;
      this.changeDetectorRef.detectChanges();
    }
  }

  // Danh sách file chứng chỉ
  selectFileCertifi(uploadCertificate){
    const files = uploadCertificate.files;
    // tslint:disable-next-line:prefer-for-of
    for(let i=0; i<files.length; i++){
      const element = files[i];
      if(element.type !== 'application/pdf'){
        this.toastr.error(this.translate.instant('TEACHER.IMPORT.FILE_NOT_FORMAT'));
        return;
      }
      if(element.size > 5242880){
        this.toastr.error(this.translate.instant('TEACHER.IMPORT.MAX'));
        return;
      }
    }
    // tslint:disable-next-line:prefer-for-of
    for(let j = 0; j < files.length; j++){
      this.arrBufferFile.push(files[j]);
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.fileCertificateUrl = reader.result;
        this.changeDetectorRef.detectChanges();
      }
      this.listFileCertificate = [...this.arrBufferFile, this.fileCertificateUrl];
    }
    this.fileCertificate = this.arrBufferFile;
  }

  // Xóa file chứng chỉ
  deleteFile(i){
    this.arrBufferFile.splice(i, 1);
  }
  // File bằng thạc sỹ
  selectFileMaster(uploadDiploma) {
    if(uploadDiploma.files[0].type !== 'application/pdf'){
      this.toastr.error(this.translate.instant('TEACHER.IMPORT.FILE_NOT_FORMAT'));
      return;
    }
    if(uploadDiploma.files[0].size > 5242880){
      this.toastr.error(this.translate.instant('TEACHER.IMPORT.MAX'));
      return;
    }
    this.fileMaster = uploadDiploma.files;
    this.fileMasterName = this.fileMaster[0].name;
  }

  // File bằng tiến sỹ
  selectFileDoctor(uploadDiploma) {
    if(uploadDiploma.files[0].type !== 'application/pdf'){
      this.toastr.error(this.translate.instant('TEACHER.IMPORT.FILE_NOT_FORMAT'));
      return;
    }
    if(uploadDiploma.files[0].size > 5242880){
      this.toastr.error(this.translate.instant('TEACHER.IMPORT.MAX'));
      return;
    }
    this.fileDoctor = uploadDiploma.files;
    this.fileDoctorName = this.fileDoctor[0].name;
  }

  // Check ký tự tiếng việt
  validate(value: any){
    if(!/^[0-9A-Za-z{}|\\;:\[\]'"/+=\-~_ )(><?.,!@#$%^&*]{1,50}$/.test(value)){
      this.check = true;
    }else{
      this.check = false;
    }
  }

  changeCV(){
    console.log(this.positionList);
  }

  cancel(){
    this.redirect();
  }

  // viewFile
  viewFile(item: any){
    const data: any = {};
    console.log(item);
    data.fileURL = item;
    data.check = 1;
    this.matDialog.open(ViewFileComponent, {
      width: '80vw',
      height: '90vh',
      hasBackdrop: true,
      data,
      disableClose: true,
    }).afterClosed().subscribe(dataRes => {
      console.log(dataRes);
    });
  }

  formatDate(originalDate: string): string {
    const date = new Date(originalDate)
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`
  }

  changeContractType(){
   if(this.itemTecher.contractType === 0)
     this.itemTecher.contractName = this.translate.instant('TEACHER.CREATE.CONTRACT');
   else
     this.itemTecher.contractName = this.translate.instant('TEACHER.CREATE.EMBODY');
  }

  changeGT(){
    if(this.itemTecher.sex === 0)
      this.itemTecher.sexStr = this.translate.instant('TEACHER.CREATE.MALE');
    else
      this.itemTecher.sexStr = this.translate.instant('TEACHER.CREATE.FEMALE');
  }

  changeMarriageStatus(){
    if(this.itemTecher.marriageStatus === 0)
      this.itemTecher.marriageStatusStr = this.translate.instant('TEACHER.CREATE.SINGLE');
    else
      this.itemTecher.marriageStatusStr = this.translate.instant('TEACHER.CREATE.MARRIED');
  }

  interceptKeyboard(event): void {
    const keyCode = event.keyCode
    if (keyCode >= KEYCODE_0 && keyCode <= KEYCODE_9) {
      event.preventDefault()
    }
  }

  messageBirthdayIllegal=this.translate.instant('TEACHER.MSG.BIRTHDAY_REQUITRED');

  checkDateBirthDay = false;
  getValueDate(event) {
    if(event!=='error'){
      this.checkDateBirthDay = true;
    }else {
      this.checkDateBirthDay = false;
    }

  }
}
