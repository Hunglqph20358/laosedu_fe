import {Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {RewardDisciplineModel} from '../../../../../core/service/model/reward-discipline.model';
import {RewardDisciplineService} from '../../../../../core/service/service-model/reward-discipline.service';
import {LeaveJobModel} from '../../../../../core/service/model/leave-job.model';
import {LeaveJobService} from '../../../../../core/service/service-model/leave-job.service';
import {JobTransferHistoryModel} from '../../../../../core/service/model/job-transfer-history.model';
import {SalaryAllowancesModel} from '../../../../../core/service/model/salary-allowances.model';
import {JobTransferHistoryService} from '../../../../../core/service/service-model/job-transfer-history.service';
import {ApParamService} from '../../../../../core/service/service-model/ap-param.service';
import {ToastrService} from 'ngx-toastr';
import {SalaryAllowancesService} from '../../../../../core/service/service-model/salary-allowances.service';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {FormBuilder} from '@angular/forms';
import {TeacherService} from '../../../../../core/service/service-model/teacher.service';
import {Teacher} from '../../../../../core/service/model/teacher.model';
import { Router } from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {environment} from '../../../../../../environments/environment';
import {DepartmentService} from '../../../../../core/service/service-model/unit.service';
import {DatePipe, formatDate} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-action-teacher',
  templateUrl: './action-teacher.component.html',
  styleUrls: ['./action-teacher.component.scss']
})
export class ActionTeacherComponent implements OnInit, ICellRendererAngularComp {
  constructor(private modalService: BsModalService,
              private rewardDisciplineService: RewardDisciplineService,
              private leaveJobService: LeaveJobService,
              private jobTransferHistoryService: JobTransferHistoryService,
              private salaryAllowancesService: SalaryAllowancesService,
              private apParamService: ApParamService,
              private classromService: ClassroomService,
              private toastr: ToastrService,
              private fb:FormBuilder,
              private router:Router,
              private teacherService: TeacherService,
              private changeDetectorRef: ChangeDetectorRef,
              private departmentService: DepartmentService,
              private datePipe: DatePipe,
              private translate: TranslateService) {
  }
  unsubscribe$ = new Subject<void>();
  modalRef: BsModalRef;
  rewardDisciplineModel: RewardDisciplineModel;
  leaveJob: LeaveJobModel;
  jobTransferHistory: JobTransferHistoryModel;
  salaryAllowances: SalaryAllowancesModel;
  cellValue: string;
  teacher: any;
  salaryLeavel: any;
  rankSalary: any;
  year;
  appParamValue;
  listDeptParent = [];
  deptParentId;
  listDept = [];
  oldTeacher: Teacher = new Teacher();
  chuyen;
  rowIndex;
  currentRoles = [];
  isRole: boolean;
  click = 0;
  // Role Admin, HT
  ADMIN = `${environment.ROLE.ADMIN}`;
  HT = `${environment.ROLE.HT}`;
  errorDate: boolean = false;
  hide = true;
  // Lỗi khen thưởng
  errorKhenThuong = {
    ht:{
      error: false,
      message: '',
    },
    date:{
      error: false,
      message: ''
    },
    diachi:{
      error: false,
      message: ''
    },
    noidung:{
      error: false,
      message: ''
    }
  }
  // Lỗi kỷ luật
  errorKyLuat = {
    ht:{
      error: false,
      message: '',
    },
    date:{
      error: false,
      message: ''
    },
    diachi:{
      error: false,
      message: ''
    },
    noidung:{
      error: false,
      message: ''
    }
  }
  // Lỗi phụ cấp
  errorPhuCap = {
    bl:{
      error: false,
      message: '',
    },
    hn:{
      error: false,
      message: ''
    },
    hs:{
      error: false,
      message: ''
    },
    vk:{
      error: false,
      message: ''
    },
    gc:{
      error: false,
      message: ''
    },
    tt:{
      error: false,
      message: ''
    }
  }
  // Lỗi don vi
  errorDV = {
    qd:{
      error: false,
      message: '',
    },
    date:{
      error: false,
      message: ''
    },
    dv:{
      error: false,
      message: ''
    },
    kh:{
      error: false,
      message: ''
    },
    ld:{
      error: false,
      message: ''
    },
    gc:{
      error: false,
      message: ''
    }
  }
  // Lỗi cập nhật nghỉ
  errorNV = {
    qd:{
      error: false,
      message: ''
    },
    date:{
      error: false,
      message: ''
    },
    gc:{
      error: false,
      message: ''
    },
    ld:{
      error: false,
      message: ''
    },
    tt:{
      error: false,
      message: ''
    }
  }
  listDepartment: [];
  oldDeptId: any;
  errorTN = false;
  messgeTN =  '';
  loading = false;

  messageErrorKhenThuongNull = this.translate.instant('TEACHER.MSG.DATE_REWARD_REQUIRED');
  messageErrorKhenThuongIllegal = this.translate.instant('REWARD.NOTIFY.RW_DATE.BLANK');

  ngOnInit() {
    // this.getYear();
    this.changeDetectorRef.detectChanges();
    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    if (this.currentRoles && this.currentRoles.length > 0) {
      // TODO: this.isRole = true không cho chỉnh sửa
      this.currentRoles.forEach(e=>{
        if(e === this.ADMIN || e === this.HT){
          this.isRole = false;
          return;
        }
      })
    }
  }



  // gets called once before the renderer is used
  agInit(params ): void {
    this.cellValue = params;
    this.teacher = params.data;
    this.rowIndex = +params.rowIndex + 1;
    console.log(this.teacher);
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true
  }


  openModal(template: TemplateRef<any>, act: number) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
    this.click = 0;
    this.loading = false;
    this.hide = true;
    this.rewardDisciplineModel = new RewardDisciplineModel();
    this.leaveJob = new LeaveJobModel();
    this.jobTransferHistory = new JobTransferHistoryModel();
    this.salaryAllowances = new SalaryAllowancesModel();
    this.leaveJob.breakTime = '1';
    this.chuyen = 0;
    this.errorDate = false;
    // Lỗi khen thưởng
    this.errorKhenThuong = {
      ht:{
        error: false,
        message: '',
      },
      date:{
        error: false,
        message: ''
      },
      diachi:{
        error: false,
        message: ''
      },
      noidung:{
        error: false,
        message: ''
      }
    }
    // Lỗi kỷ luật
    this.errorKyLuat = {
      ht:{
        error: false,
        message: '',
      },
      date:{
        error: false,
        message: ''
      },
      diachi:{
        error: false,
        message: ''
      },
      noidung:{
        error: false,
        message: ''
      }
    }
    // Lỗi phụ cấp
    this.errorPhuCap = {
      bl:{
        error: false,
        message: '',
      },
      hn:{
        error: false,
        message: ''
      },
      hs:{
        error: false,
        message: ''
      },
      vk:{
        error: false,
        message: ''
      },
      gc:{
        error: false,
        message: ''
      },
      tt:{
        error: false,
        message: ''
      }
    }
    // Lỗi don vi
    this.errorDV = {
      qd:{
        error: false,
        message: '',
      },
      date:{
        error: false,
        message: ''
      },
      dv:{
        error: false,
        message: ''
      },
      kh:{
        error: false,
        message: ''
      },
      ld:{
        error: false,
        message: ''
      },
      gc:{
        error: false,
        message: ''
      }
    }
    // Lỗi cập nhật nghỉ
    this.errorNV = {
      qd:{
        error: false,
        message: ''
      },
      date:{
        error: false,
        message: ''
      },
      gc:{
        error: false,
        message: ''
      },
      ld:{
        error: false,
        message: ''
      },
      tt:{
        error: false,
        message: ''
      }
    }
    this.loadRankSalary();
    this.loadSalaryLevel();
    this.getListDV()
    this.getYear();
    this.changeDetectorRef.detectChanges();
    console.log(this.teacher);
    // Lấy giá trị cũ trước đó
    this.getSalaryAllowancen(this.teacher.code);
    if(act === 3){
      this.getLeaveJob(this.teacher.id, 1);
    }
    if(act === 4){
      this.getLeaveJob(this.teacher.id, 0);
    }
    if(act === 5){
      this.getLeaveJob(this.teacher.id, 2);
    }
    // Đon vị. Khoa, Bộ môn
    this.teacherService.getDepartmentsById(this.teacher.deptId).subscribe(re=>{
      console.log(re)
      this.departmentService.apiGetDataTree(re.code, '', '', 0).then((resAPI: []) => {
        if (resAPI.length > 0) {
          this.listDepartment = resAPI;
          console.log(resAPI);
          // @ts-ignore
          this.teacher.unitName = this.listDepartment[0].name;
          // @ts-ignore
          this.jobTransferHistory.oldDepartmentId = this.listDepartment[0].id;
          // @ts-ignore
          this.jobTransferHistory.newDepartmentId = this.listDepartment[0].id;
          this.teacherService.getDeptByParent(this.jobTransferHistory.newDepartmentId).then((res: []) => {
            if(res.length > 0){
              this.listDept = res;
              this.jobTransferHistory.newDeptId = this.listDept[0].id;
              let list = [];
              res.forEach(item=>{
                let customItem = {};
                // @ts-ignore
                customItem = {...item, name: item.code + ' - ' + item.name};
                list = [...list, customItem];
              })
              this.listDept = list;
            }
          })
          // this.changedeptParent();
          // @ts-ignore
          if(this.listDepartment[0].children !== null){
            // @ts-ignore
            this.teacher.deptName = this.listDepartment[0].children[0].name;
            // @ts-ignore
            this.jobTransferHistory.oldDeptId = this.listDepartment[0].id;
          }
        }
      })
    })
  }

  getSalaryAllowancen(teacherCode: any){
    this.salaryAllowancesService.getByTeacherCode(teacherCode).subscribe(res=>{
      if(res != null){
        this.salaryAllowances = res;
        this.salaryAllowances.id = null;
        this.salaryAllowances.datePay = this.datePipe.transform(new Date(res.payDay), 'yyyy-MM-dd');
      }
    })
  }

  getLeaveJob(teacherId: any, isLeave: any){
    this.leaveJobService.getByTeacherId(teacherId, isLeave).subscribe(res=>{
      if(res!= null){
        this.leaveJob = res;
        this.leaveJob.id = null;
        this.leaveJob.dateLeave = this.datePipe.transform(new Date(res.leaveDate), 'yyyy-MM-dd');
      }
    })
  }

 getYear(){
   this.classromService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
     this.rewardDisciplineModel.rdYear = res;
     console.log(res);
   })
   this.changeDetectorRef.detectChanges();
  }

  // Load bậc lương
  loadSalaryLevel(){
    const parentCode = 'salary_level';
    this.apParamService.getByParenCode(parentCode).subscribe(res=>{
      this.salaryLeavel = res.data;
    })
  }

  // Load ngach
  loadRankSalary(){
    const parentCode = 'rank_salary';
    this.apParamService.getByParenCode(parentCode).subscribe(res=>{
      this.rankSalary = res.data;
      console.log(this.rankSalary);
    })
  }

  // Load hệ số lương
  changeRankSalary(){
    this.apParamService.getById(this.salaryAllowances.rankId).subscribe(res=>{
      this.salaryAllowances.coefficient = res.value;
      console.log(res);
    })
  }
  // Load đơn vị
  getListDV(){
    this.teacherService.getParentDeptNull().then((res: []) => {
      if(res.length > 0){
        this.listDeptParent = res;
        this.jobTransferHistory.newDepartmentId = this.listDeptParent[0].id;
        let list = [];
        res.forEach(item=>{
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        })
        this.listDeptParent = list;
        this.changedeptParent();
      }
    })
  }
  // Khoa ban
  changedeptParent(){
    this.teacherService.getDeptByParent(this.jobTransferHistory.newDepartmentId).then((res: []) => {
      if(res.length > 0){
        this.listDept = res;
        this.jobTransferHistory.newDeptId = this.listDept[0].id;
        let list = [];
        res.forEach(item=>{
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        })
        this.listDept = list;
      }
    })
  }
  // check value
  changeValue(){
    if(this.chuyen === 0){
      // @ts-ignore
      this.jobTransferHistory.newDepartmentId = this.listDepartment[0].id;
      this.changedeptParent();
    }else{
      this.getListDV();
      // this.changedeptParent();
    }
  }
  // Khen thưởng
  bouns(){
    this.validateKhenThuong();
    if(this.errorKhenThuong.ht.error === true
      || this.errorKhenThuong.date.error === true
      || this.errorKhenThuong.diachi.error === true
      || this.errorKhenThuong.noidung.error === true){
      return;
    }
    // if(this.errorKhenThuong.ht.error === true
    //   || this.errorKhenThuong.date.error === true
    //   || this.errorKhenThuong.diachi.error === true
    //   || this.errorKhenThuong.noidung.error === true
    //   || this.valueDate ===undefined || this.valueDate==='error'){
    //   return;
    // }
    this.hide = false;
    this.loading = true;
    this.rewardDisciplineModel.isReward = 1;
    this.rewardDisciplineModel.teacherId = this.teacher.id;
    this.rewardDisciplineService.addBouns(this.rewardDisciplineModel).subscribe(res=>{
      this.loading = false;
      this.modalRef.hide();
      this.toastr.success(this.translate.instant('TEACHER.MSG.UPDATE_REWARD_SUCCESS'));
    }, error => {
      this.hide = true;
      this.toastr.error(this.translate.instant('TEACHER.MSG.UPDATE_REWARD_FAILURE'));
    })
  }

  discipline(){
    this.validateKyLuat();
    if(this.errorKyLuat.ht.error === true
      || this.errorKyLuat.date.error === true
      || this.errorKyLuat.diachi.error === true
      || this.errorKyLuat.noidung.error === true){
      return;
    }
    this.hide = false;
    this.rewardDisciplineModel.isReward = 0;
    this.rewardDisciplineModel.teacherId = this.teacher.id;
    this.rewardDisciplineService.addBouns(this.rewardDisciplineModel).subscribe(res=>{
      this.toastr.success(this.translate.instant('TEACHER.MSG.UPDATE_DISCIPLINE_SUCCESS'));
      this.modalRef.hide();
    }, error => {
      this.hide = true;
      this.toastr.error(this.translate.instant('TEACHER.MSG.UPDATE_DISCIPLINE_FAILURE'));
    })
  }

  // Nghỉ việc
  quiJob(type: number){
    this.validateNV(type);
    let messges;
    if(this.errorNV.date.error === true ||
      (this.errorNV.qd.error === true && type !== 2)||
      (this.errorNV.ld.error === true && type !== 1)||
      this.errorNV.gc.error === true ||
      this.errorNV.tt.error === true){
      return;
    }
    if(type === 1){
      this.leaveJob.isLeave = 1;
      this.leaveJob.breakTime = null;
    }
    if(type === 0){
      this.leaveJob.isLeave = 0
      this.leaveJob.breakTime = null;
    }
    if(type === 2){
      this.leaveJob.isLeave = 2;
    }
    if(this.errorTN === true){
      return ;
    }
    this.hide = false;
    this.leaveJob.teacherId = this.teacher.id;
    this.leaveJobService.addLeaveJob(this.leaveJob).subscribe(res=>{
      if(type === 1)
        messges = this.translate.instant('TEACHER.MSG.UPDATE_RETIREMENT_SUCCESS');
      if(type === 0)
        messges = this.translate.instant('TEACHER.MSG.UPDATE_QUITJOB_SUCCESS');
      if(type === 2)
        messges = this.translate.instant('TEACHER.MSG.UPDATE_BREAK_SUCCESS');
      this.toastr.success(messges);
      this.leaveJobService.changeIsReload(true);
      this.modalRef.hide();
    }, error => {
      this.hide = true;
      if(type === 1)
        messges = this.translate.instant('TEACHER.MSG.UPDATE_RETIREMENT_FAILURE');
      if(type === 0)
        messges = this.translate.instant('TEACHER.MSG.UPDATE_QUITJOB_FAILURE');
      if(type === 2)
        messges = this.translate.instant('TEACHER.MSG.UPDATE_BREAK_FAILURE');
      this.toastr.error(messges);
    })
  }

  // Chuyển đơn vị phòng ban
  changeDepartment(){
    this.validateDV();
    if(this.errorDV.qd.error === true
      || this.errorDV.date.error === true
      || this.errorDV.ld.error === true
      || this.errorDV.gc.error === true){
      return;
    }
    this.hide = false;
    this.jobTransferHistory.teacherCode = this.teacher.code;
    this.jobTransferHistory.oldPosition = 'ROLE_BGH';
    this.jobTransferHistory.type = this.chuyen;
    // chuyển cùng đơn vị
    if(this.chuyen === 0){
      this.jobTransferHistoryService.addJobTransferHistory(this.jobTransferHistory).subscribe(res=>{
        this.toastr.success(this.translate.instant('TEACHER.MSG.UPDATE_TRANSFER_SUCCESS'));
        this.leaveJobService.changeIsReload(true);
        this.modalRef.hide();
      }, error => {
        this.hide = true;
        this.toastr.error(this.translate.instant('TEACHER.MSG.UPDATE_TRANSFER_FAILURE'));
      })
    }
    // Chuyển khác đơn vị
    else{
      this.jobTransferHistoryService.addJobTransferHistory(this.jobTransferHistory).subscribe(res=>{
        this.toastr.success(this.translate.instant('TEACHER.MSG.UPDATE_TRANSFER_SUCCESS'));
        this.leaveJobService.changeIsReload(true);
        this.modalRef.hide();
      }, error => {
        this.hide = true;
        this.toastr.error(this.translate.instant('TEACHER.MSG.UPDATE_TRANSFER_FAILURE'));
      })
    }
  }

  // Cập nhật lương phụ cấp
  updateSalary(){
    this.validatePhuCap();
    if(this.errorPhuCap.bl.error === true
      || this.errorPhuCap.hn.error === true
      || this.errorPhuCap.hs.error === true
      || this.errorPhuCap.vk.error === true
      || this.errorPhuCap.gc.error === true
      || this.errorPhuCap.tt.error === true){
      return;
    }
    this.hide = false;
    this.salaryAllowances.teacherCode = this.teacher.code;
    this.salaryAllowancesService.addSalaryAllowances(this.salaryAllowances).subscribe(res=>{
      this.toastr.success(this.translate.instant('TEACHER.MSG.UPDATE_SALARY_SUCCESS'));
      this.modalRef.hide();
    }, error => {
      this.hide = true;
      this.toastr.error(this.translate.instant('TEACHER.MSG.UPDATE_SALARY_FAILURE'));
    })
  }

  // Validate
  // check Date
  isDate(s) {
    if(isNaN(s) && !isNaN(Date.parse(s)))
      return true;
    else return false;
  }
  openUpdate(){
    this.router.navigate(['/system/teacher/create-update-teacher'], { queryParams: {id: this.teacher.id}});
  }

  isEmpty(data: any): boolean {
    return data === null || data === undefined || data === ''
  }

  // validate khen thưởng
  validateKhenThuong():void{
    this.validateHT();
    this.validateDate();
    this.validateDiaChi();
    this.validateND();
  }

  // hình thức khen thưởng
  validateHT(){
    if(this.isEmpty(this.rewardDisciplineModel.rdType)){
      this.errorKhenThuong.ht.error = true;
      this.errorKhenThuong.ht.message = this.translate.instant('TEACHER.MSG.TYPE_REWARD_BLANK');
      return;
    }else if(this.rewardDisciplineModel.rdType.length > 250){
      this.errorKhenThuong.ht.error = true;
      this.errorKhenThuong.ht.message = this.translate.instant('TEACHER.MSG.TYPE_REWARD_MAXLENT');
      return;
    }
    this.errorKhenThuong.ht.error = false;
  }
  // ngày khen thưởng

  validateDate(){
    if(this.isEmpty(this.rewardDisciplineModel.dateRd)){
      this.errorKhenThuong.date.error = true;
      this.errorKhenThuong.date.message = this.translate.instant('TEACHER.MSG.DATE_REWARD_REQUIRED');
      return;
    }
    this.errorKhenThuong.date.error  = false;

    // if(this.valueDate === undefined){
    //   this.errorKhenThuong.date.error = true;
    //   this.errorKhenThuong.date.message = this.translate.instant('TEACHER.MSG.DATE_REWARD_REQUIRED');
    //   return;
    // }
    // this.errorKhenThuong.date.error  = false;
    //
    // if(this.valueDate === 'error'){
    //   return;
    // }


  }

  // Đia chỉ
  validateDiaChi(){
    if(this.isEmpty(this.rewardDisciplineModel.rdAddress)){
      this.errorKhenThuong.diachi.error = true;
      this.errorKhenThuong.diachi.message = this.translate.instant('TEACHER.MSG.ADDRESS_REWARD_BLANK');
      return;
    }else if(this.rewardDisciplineModel.rdAddress.length > 250){
      this.errorKhenThuong.diachi.error = true;
      this.errorKhenThuong.diachi.message = this.translate.instant('TEACHER.MSG.ADDRESS_REWARD_MAXLENT');
      return;
    }
    this.errorKhenThuong.diachi.error = false;
  }
  // Noi dung
  validateND(){
    if(!this.isEmpty(this.rewardDisciplineModel.rdContent) && this.rewardDisciplineModel.rdContent.length > 500){
      this.errorKhenThuong.noidung.error = true;
      // this.errorKhenThuong.noidung.message = this.translate.instant('TEACHER.MSG.NOTE_MAXLENT');
      this.errorKhenThuong.noidung.message = this.translate.instant('TEACHER.MSG.CONTENT_REWARD_MAXLENT');
      return;
    }
    this.errorKhenThuong.noidung.error = false;
  }

  // Validate kỷ luật
  validateKyLuat():void{
    this.validateKLHT();
    this.validateKLDate();
    this.validateKLDiaChi();
    this.validateKLND();
  }

  // hình thức kỷ luật
  validateKLHT(){
    if(this.isEmpty(this.rewardDisciplineModel.rdType)){
      this.errorKyLuat.ht.error = true;
      this.errorKyLuat.ht.message = this.translate.instant('TEACHER.MSG.TYPE_DISCIPLINE_BLANK');
      return;
    }else if(this.rewardDisciplineModel.rdType.length > 250){
      this.errorKyLuat.ht.error = true;
      this.errorKyLuat.ht.message = this.translate.instant('TEACHER.MSG.TYPE_DISCIPLINE_MAXLENT');
      return;
    }
    this.errorKyLuat.ht.error = false;
  }
  // ngày kỷ luật
  validateKLDate(){
    if(this.isEmpty(this.rewardDisciplineModel.dateRd)){
      this.errorKyLuat.date.error = true;
      this.errorKyLuat.date.message = this.translate.instant('TEACHER.MSG.DATE_DISCIPLINE_REQUIRED');
      return;
    }
    this.errorKyLuat.date.error  = false;
  }

  // Đia chỉ
  validateKLDiaChi(){
    if(this.isEmpty(this.rewardDisciplineModel.rdAddress)){
      this.errorKyLuat.diachi.error = true;
      this.errorKyLuat.diachi.message = this.translate.instant('TEACHER.MSG.ADDRESS_DISCIPLINE_BLANK');
      return;
    }else if(this.rewardDisciplineModel.rdAddress.length > 250){
      this.errorKyLuat.diachi.error = true;
      this.errorKyLuat.diachi.message = this.translate.instant('TEACHER.MSG.ADDRESS_DISCIPLINE_MAXLENT');
      return;
    }
    this.errorKyLuat.diachi.error = false;
  }
  // Noi dung
  validateKLND(){
    if(!this.isEmpty(this.rewardDisciplineModel.rdContent) &&  this.rewardDisciplineModel.rdContent.length > 500){
      this.errorKyLuat.noidung.error = true;
      this.errorKyLuat.noidung.message = this.translate.instant('TEACHER.MSG.CONTENT_DISCIPLINE_MAXLENT');
      return;
    }
    this.errorKyLuat.noidung.error = false;
  }

  // Validate phụ cấp
  validatePhuCap():void{
    this.validateBL();
    this.validateHN();
    this.validateHS();
    this.validateGC();
    this.validateTT();
  }
  // Bac luong
  validateBL(){
    if(this.isEmpty(this.salaryAllowances.salaryLevelId)){
      this.errorPhuCap.bl.error = true;
      this.errorPhuCap.bl.message = this.translate.instant('TEACHER.MSG.SALARY_LEVEL_BLANK');
      return;
    }
    this.errorPhuCap.bl.error = false;
  }
  // validate hạng ngạch
  validateHN(){
    if(this.isEmpty(this.salaryAllowances.rankId)){
      this.errorPhuCap.hn.error = true;
      this.errorPhuCap.hn.message = this.translate.instant('TEACHER.MSG.RANK_NAME_BLANK');
      return;
    }
    this.errorPhuCap.hn.error = false;
  }
  // Hệ số lương
  validateHS(){
    if(this.isEmpty(this.salaryAllowances.coefficient)){
      this.errorPhuCap.hs.error = true;
      this.errorPhuCap.hs.message = this.translate.instant('TEACHER.MSG.COEFFICIENT_BLANK');
      return;
    }
    this.errorPhuCap.hs.error = false;
  }

  // Ghi chú
  validateGC(){
    if(!this.isEmpty( this.salaryAllowances.description) && this.salaryAllowances.description.length > 500){
      this.errorPhuCap.gc.error = true;
      this.errorPhuCap.gc.message = this.translate.instant('TEACHER.MSG.NOTE_MAXLENT');
      return;
    }
    this.errorPhuCap.gc.error = false;
  }

  // Thông tin phụ cấp
  validateTT(){
    if(!this.isEmpty(this.salaryAllowances.allowanceMode) && this.salaryAllowances.allowanceMode.length > 500){
      this.errorPhuCap.tt.error = true;
      this.errorPhuCap.tt.message = this.translate.instant('TEACHER.MSG.ALLOWANCES_MODE_MAXLENT');
      return;
    }
    this.errorPhuCap.tt.error = false;
  }

  // Validate chuyển đon vị
  validateDV(){
    this.validateDVQD();
    this.validateDVDate();
    this.validateDVC();
    this.validateDVKH();
    this.validateDVLD();
    this.validateDVGC();
  }
  // quyết định
  validateDVQD(){
    if(this.isEmpty(this.jobTransferHistory.code)){
      this.errorDV.qd.error = true;
      this.errorDV.qd.message = this.translate.instant('TEACHER.MSG.DECISION_TRANSFER_BLANK');
      return;
    }else if(this.jobTransferHistory.code.length > 250){
      this.errorDV.qd.error = true;
      this.errorDV.qd.message = this.translate.instant('TEACHER.MSG.DECISION_TRANSFER_MAXLENT');
      return;
    }
    this.errorDV.qd.error = false;
  }

  // Ngay chuyen
  validateDVDate(){
    if(this.isEmpty(this.jobTransferHistory.dateTransfer)){
      this.errorDV.date.error = true;
      this.errorDV.date.message = this.translate.instant('TEACHER.MSG.DATE_TRANSFER_REQUITRED');
      return;
    }else{
      const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      const dateValue = formatDate(this.jobTransferHistory.dateTransfer, 'yyyy/MM/dd', 'en');
      if(today > dateValue){
        this.errorDV.date.error = true;
        this.errorDV.date.message = this.translate.instant('TEACHER.MSG.DATE_TRANSFER_TODAY');
        return;
      }
      this.errorDV.date.error = false;
    }
    this.errorDV.date.error = false;
  }
  // Đơn vị chuyển
  validateDVC(){
    if(this.isEmpty(this.jobTransferHistory.newDepartmentId)){
      this.errorDV.dv.error = true;
      this.errorDV.dv.message = this.translate.instant('TEACHER.MSG.DEPT_TRANSFER_BLANK');
      return;
    }
    this.errorDV.dv.error = false;
  }
  // Khoa bam
  validateDVKH(){
    if(this.isEmpty(this.jobTransferHistory.newDeptId)){
      this.errorDV.kh.error = true;
      this.errorDV.kh.message = this.translate.instant('TEACHER.MSG.DEPT_CHILD_TRANSFER_BLANK');
      return;
    }
    this.errorDV.kh.error = false;
  }
  // Lý do
  validateDVLD(){
    if(this.isEmpty(this.jobTransferHistory.reason)){
      this.errorDV.ld.error = true;
      this.errorDV.ld.message = this.translate.instant('TEACHER.MSG.REASON_TRANSFER_BLANK');
      return;
    }else if(this.jobTransferHistory.reason.length > 250){
      this.errorDV.ld.error = true;
      this.errorDV.ld.message = this.translate.instant('TEACHER.MSG.REASON_TRANSFER_MAXLENT');
      return;
    }
    this.errorDV.ld.error = false;
  }
  // Ghi chú
  validateDVGC(){
    if(!this.isEmpty(this.jobTransferHistory.description)
      && this.jobTransferHistory.description.length > 500){
      this.errorDV.gc.error = true;
      this.errorDV.gc.message = this.translate.instant('TEACHER.MSG.NOTE_MAXLENT');
      return;
    }
    this.errorDV.gc.error = false;
  }
  // Check ngày tạm nghỉ
  checkNgayTamNghi(){
    if(!this.isEmpty(this.leaveJob.breakTime)){
      const tn: number = + this.leaveJob.breakTime;
      if(tn < 1 || tn > 100){
        this.errorTN = true;
        this.messgeTN =  'Thời gian tạm nghỉ từ 1 - 100';
        return;
      }
      this.errorTN = false;
    }
  }


  validateLeaveDate($event){
    console.log($event.target.value);
      const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      const dateValue = formatDate($event.target.value, 'yyyy/MM/dd', 'en');
      if(this.isEmpty(dateValue)){
        this.errorDate = true;
        return;
      }else if(today > dateValue){
        this.errorDate = true;
        return;
      }
      this.errorDate = false;
  }

  // Validate tạm nghỉ, nghỉ việc, tạm nghỉ
  validateNV(type: number){
    this.validateNVQD(type);
    this.validateNVNN(type);
    this.validateNVGC(type);
    this.validateNVLD(type);
    this.validateNVTGTN();
  }
  validateNVQD(type: number){
    if(this.isEmpty(this.leaveJob.decision)){
      this.errorNV.qd.error = true;
      if(type === 1)
        this.errorNV.qd.message = this.translate.instant('TEACHER.MSG.DECISION_RETIREMENT_BLANK');
      if(type === 0)
        this.errorNV.qd.message = this.translate.instant('TEACHER.MSG.DECISION_QUITJOB_BLANK');
      // else
      //   this.errorNV.qd.message = 'Quyết định tạm nghỉ không được để trống';
      return;
    }else{
      if(this.leaveJob.decision.length > 250){
        this.errorNV.qd.error = true;
        if(type === 1)
          this.errorNV.qd.message = this.translate.instant('TEACHER.MSG.DECISION_RETIREMENT_MAXLENT');
        if(type === 0)
          this.errorNV.qd.message = this.translate.instant('TEACHER.MSG.DECISION_QUITJOB_MAXLENT');
        if(type === 2)
          this.errorNV.qd.message = 'Quyết định tạm nghỉ không được để trống';
        return;
      }
    }
    this.errorNV.qd.error = false;
  }

  validateNVNN(type: number){
    if(this.isEmpty(this.leaveJob.dateLeave)){
      this.errorNV.date.error = true;
      if(type === 1)
        this.errorNV.date.message = this.translate.instant('TEACHER.MSG.DATE_RETIREMENT_BLANK');
      if(type === 0)
        this.errorNV.date.message = this.translate.instant('TEACHER.MSG.DATE_QUITJOB_BLANK');
      if(type === 2)
        this.errorNV.date.message = this.translate.instant('TEACHER.MSG.DATE_BREAK_BLANK');
      return;
    }else{
      const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      const dateValue = formatDate(this.leaveJob.dateLeave, 'yyyy/MM/dd', 'en');
      if(today > dateValue){
        this.errorNV.date.error = true;
        if(type === 1)
          this.errorNV.date.message = this.translate.instant('TEACHER.MSG.DATE_RETIREMENT_TODAY');
        if(type === 0)
          this.errorNV.date.message = this.translate.instant('TEACHER.MSG.DATE_QUITJOB_TODAY');
        if(type === 2)
          this.errorNV.date.message = this.translate.instant('TEACHER.MSG.DATE_BREAK_TODAY');
        return;
      }
    }
    this.errorNV.date.error = false;
  }

  validateNVGC(type: number){
    if(!this.isEmpty(this.leaveJob.description) && this.leaveJob.description.length > 500){
      this.errorNV.gc.error = true;
      if(type === 1)
        this.errorNV.gc.message = this.translate.instant('TEACHER.MSG.NOTE_MAXLENT');
      if(type === 0)
        this.errorNV.gc.message = this.translate.instant('TEACHER.MSG.NOTE_MAXLENT');
      if(type === 2)
        this.errorNV.gc.message = this.translate.instant('TEACHER.MSG.NOTE_MAXLENT');
      return;
    }
    this.errorNV.gc.error = false;
  }

  validateNVLD(type: number){
    if(this.isEmpty(this.leaveJob.reason)){
      this.errorNV.ld.error = true;
      if(type === 0)
        this.errorNV.ld.message = this.translate.instant('TEACHER.MSG.REASON_QUITJOB_BLANK');
      if(type === 2)
        this.errorNV.ld.message = this.translate.instant('TEACHER.MSG.REASON_BREAK_BLANK');
      return;
    }else{
      if(this.leaveJob.reason.length > 250){
        this.errorNV.ld.error = true;
        if(type === 0)
          this.errorNV.ld.message = this.translate.instant('TEACHER.MSG.REASON_QUITJOB_MAXLENT');
        if(type === 2)
          this.errorNV.ld.message = this.translate.instant('TEACHER.MSG.REASON_BREAK_MAXLENT');
        return;
      }
    }
    this.errorNV.ld.error = false;
  }

  validateNVTGTN(){
    if(this.isEmpty(this.leaveJob.breakTime)){
      this.errorNV.tt.error = true;
      this.errorNV.tt.message = this.translate.instant('TEACHER.MSG.TIME_BREAK_BLANK');
      return;
    }else{
      const tn: number = + this.leaveJob.breakTime;
      if(tn < 1 || tn > 100){
        this.errorNV.tt.error = true;
        this.errorNV.tt.message =  this.translate.instant('TEACHER.MSG.TIME_BREAK_MAXLENT');
        return;
      }
    }
    this.errorNV.tt.error = false;
  }

  validateNVNH(){
    if(this.isEmpty(this.leaveJob.dateLeave)){
      this.errorNV.date.error = true;
      this.errorNV.date.message = 'Ngày nghỉ hưu không được để trống';
      return;
    }else{
      const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      const dateValue = formatDate(this.leaveJob.dateLeave, 'yyyy/MM/dd', 'en');
      if(today > dateValue){
        this.errorNV.date.error = true;
        this.errorNV.date.message = 'Ngày nghỉ hưu không được nhỏ hơn ngày hiện tại';
        return;
      }
      this.errorNV.date.error = false;
    }
    this.errorNV.date.error = false;
  }

  valueDate;
  getValueDate(event) {
    this.valueDate = event;
    if(event!==undefined){
      this.errorKhenThuong.date.error = false;
    }
    console.log(event);
  }
}
