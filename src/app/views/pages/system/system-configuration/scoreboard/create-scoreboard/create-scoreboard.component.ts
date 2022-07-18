import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubjectService} from '../../../../../../core/service/service-model/subject.service';
import {ConfScoreDetailsService} from '../../../../../../core/service/service-model/conf-score-details.service';
import {TableS} from '../../../../../../core/service/model/tabe.model';
import {ScoreBoardService} from '../../../../../../core/service/service-model/score-board.service';
import {TableGradingModel} from '../../../../../../core/service/model/tableGrading.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeleteClassRoomComponent} from '../../../class-room/delete-class-room/delete-class-room.component';
import {GradeLevelService} from 'src/app/core/service/service-model/grade-level.service';
import {ToastrService} from 'ngx-toastr';
import {DatePipe, formatDate} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-create-scoreboard',
  templateUrl: './create-scoreboard.component.html',
  styleUrls: ['./create-scoreboard.component.scss']
})

export class CreateScoreboardComponent implements OnInit {
  public itemTableS: TableS;
  public itemTableGrading: TableGradingModel;
  listSubject: any = [];
  listConfScoreDetailsTemp = [];
  listConfGradeDetails = [];
  listAddConfGrading = [];
  listType = [
    {
      id: 0,
      name: this.translate.instant('SCOREBOARD.SCORE')
    },
    {
      id: 1,
      name: this.translate.instant('SCOREBOARD.GRADING')
    }
  ];
  scoreDetail: any = {};
  gradeDetail: any = {};
  selected;
  listChoose = [
    {
      id: 1,
      name: '1',
    },
    {
      id: 2,
      name: '2',
    },
    {
      id: 3,
      name: '3',
    },
    {
      id: 4,
      name: '4',
    },
    {
      id: 5,
      name: '5',
    },
    {
      id: 6,
      name: '6',
    },
    {
      id: 7,
      name: '7',
    },
    {
      id: 8,
      name: '8',
    },
    {
      id: 9,
      name: '9',
    },
    {
      id: 10,
      name: '10',
    },
  ];

  errSubject = {
    error: false,
    message: ''
  }
  errApplyDate = {
    error: false,
    message: ''
  }
  year;
  applyDate;
  defaultDate = new Date().toISOString().slice(0, 10);
  gradeLevel: number;
  subject: any;
  checked: boolean;
  listGradeLevel: any = {};
  parentCode: any;
  add: boolean;
  addConfScoreDetail: any = {};
  addConfGradingDetail: any = {};
  // validate
  showErr = false;
  messageErr;
  toDate;
  fromDate;
  KEYCODE_0 = 48
  KEYCODE_9 = 57
  addListConfScoreDetailsDTO: any = {};
  check;
  checkDateFalse =true;
  constructor(private fb: FormBuilder,
              private subjectService: SubjectService,
              private confScoreDetailsService: ConfScoreDetailsService,
              private scoreBoardService: ScoreBoardService,
              private gradeLevelService: GradeLevelService,
              private matDialog: MatDialog,
              private dialogRef: MatDialogRef<CreateScoreboardComponent>,
              private toastr: ToastrService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private datePipe: DatePipe,
              private confScoreDetailSerice: ConfScoreDetailsService,
              private translate: TranslateService) {
    this.year = data.year;
    const today = new Date();
    this.applyDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.year = data.year;
    console.log(this.year);
    this.toDate = data.toDate;
    console.log(this.toDate);
    // Ngày áp dụng theo năm học
    const toYear = this.year.slice(0,4);
    const formYear = this.year.slice(5,9);
    const yearNow = this.applyDate.slice(0,4);
    // tslint:disable-next-line:variable-name
    const today_now = new Date();
    if(yearNow >= toYear && yearNow < formYear)
      this.applyDate = this.datePipe.transform(today_now, 'yyyy-MM-dd');
    else{
      this.confScoreDetailSerice.getYear(this.year).subscribe(re=>{
        this.applyDate = this.datePipe.transform(re[0].fromDate, 'yyyy-MM-dd');
      })
    }
  }


  ngOnInit(): void {
    this.selected = 0;
    this.itemTableS = new TableS();
    this.itemTableS.quantity = 1;
    this.itemTableS.minimumScore = 1;
    this.itemTableS.coefficient = 1;
    this.itemTableGrading = new TableGradingModel();
    this.itemTableGrading.typeChoose = 0;
    // this.itemTableGrading.name = 'Xếp loại';
    this.itemTableGrading.name = this.translate.instant('SCOREBOARD.GRADING');
    this.listConfScoreDetailsTemp.push(this.itemTableS);
    this.listConfGradeDetails.push(this.itemTableGrading);
    console.log(this.listConfScoreDetailsTemp);
    this.getGradeLevel();
    this.checked = false;
    this.getDateToFrom(this.year);
  }

  changeType($event) {
    if (this.selected === 0) {
      this.selected = 0;
    } else {
      this.selected = 1;
    }
    this.loadSubject(this.gradeLevel, this.selected);
    this.subject = null;
  }

  getDateToFrom(year: any){
    let length;
    this.confScoreDetailSerice.getYear(year).subscribe(re=>{
      length = re.length;
      console.log(re)
      this.fromDate = this.datePipe.transform(re[0].fromDate, 'yyyy-MM-dd');
      this.toDate = this.datePipe.transform(re[length-1].toDate, 'yyyy-MM-dd');
    })
  }
  // ==================================Validate date apply ==========================================
  changeApplyDate($event) {
    // Nếu chưa nhập ngày áp dụng
    this.check = true;
    if (this.applyDate === '') {
      this.showErr = true;
      this.messageErr = this.translate.instant('SCOREBOARD.APPLY_DATE_BLANK');
      this.check = false;
      return;
    }
    // So sánh ngày bắt đầu của năm học vs ngày hiện tại
    // Ngày bắt đầu của năm học
    const fromDate = new Date(this.fromDate);
    const fromDateValue = formatDate(fromDate, 'yyyy/MM/dd', 'en');
    // Ngày hiện tại
    const valueDate = new Date(this.applyDate);
    const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    const dateValue = formatDate(valueDate, 'yyyy/MM/dd', 'en');
    // TH ngày hiện tại nhỏ hơn ngày bắt đầu
    if(fromDateValue > dateValue){
      this.showErr = true;
      // this.messageErr = 'Ngày áp dụng phải thuộc khoảng thời gian năm học đang cấu hình!';
      this.messageErr = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    if (dateValue < today) {
      this.showErr = true;
      // this.messageErr = 'Ngày áp dụng phải lớn hơn hoặc bằng ngày hiện tại!';
      this.messageErr = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_TODAY');
      return;
    }
    // check them endDate
    const toDate = new Date(this.toDate);
    const toDateValue = formatDate(toDate, 'yyyy/MM/dd', 'en');
    if (dateValue > toDateValue) {
      this.showErr = true;
      // this.messageErr = 'Ngày áp dụng phải thuộc khoảng thời gian năm học đang cấu hình!';
      this.messageErr = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    this.showErr = false;
    this.checkDateFalse = true;
  }

  checkApplyDate($event) {
    if(this.check){
      return;
    }
    if ($event.keyCode >= this.KEYCODE_0 && $event.keyCode <= this.KEYCODE_9) {
      if (this.isEmpty(this.applyDate)) {
        this.showErr= true;
        // this.messageErr = 'Ngày áp dụng không hợp lệ!';
        this.messageErr = this.translate.instant('SCOREBOARD.APPLY_DATE_REQUIRED');
        this.checkDateFalse = false;
        return
      }
      this.errApplyDate.error = false;
      this.checkDateFalse = true;
    }
    if ($event.keyCode === 8 || $event.keyCode === 46) {
      console.log('xoa')
      this.showErr= true
      // this.messageErr = 'Vui lòng nhập ngày áp dụng!'
      this.messageErr = this.translate.instant('SCOREBOARD.APPLY_DATE_BLANK');
      return
    }
    this.checkDateFalse = true;
  }

  changeGradeLevel($event) {
    console.log(this.gradeLevel);
    console.log(this.selected);
    this.loadSubject(this.gradeLevel, this.selected);
    this.subject = null;
  }

  changeSubject($event) {
    this.subject = $event.target.value;
    console.log(this.subject);
    this.checkValidateSubject();
  }

  changeCheckBox($event) {
    this.checked = $event.target.checked;
  }

  loadSubject(gradeLevel: any, selected: any) {
    this.subjectService.findAllSubjectNotConfScoreSubject(gradeLevel, selected, this.year).subscribe(res => {
      this.listSubject = res;
      let list = [];
      res.forEach(item => {
        let customItem = {};
        customItem = {...item, name: item.code + ' - ' + item.name};
        list = [...list, customItem];
      });
      this.listSubject = list;
    })
  }


  // Load data khối
  getGradeLevel() {
    this.gradeLevelService.getGradeLevelOrderByName().subscribe(res => {
      this.listGradeLevel = res;
      this.gradeLevel = this.listGradeLevel[0].id;
      this.loadSubject(res[0].id, this.selected);
    })
  }

  onSubmit() {
    if (this.showErr) {
      this.toastr.error(this.messageErr);
      return;
    }

    // So sánh ngày bắt đầu của năm học vs ngày hiện tại
    // Ngày bắt đầu của năm học
    const fromDate = new Date(this.fromDate);
    const fromDateValue = formatDate(fromDate, 'yyyy/MM/dd', 'en');
    // Ngày hiện tại
    const valueDate = new Date(this.applyDate);
    const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    const dateValue = formatDate(valueDate, 'yyyy/MM/dd', 'en');
    // TH ngày hiện tại nhỏ hơn ngày bắt đầu
    if(fromDateValue > dateValue){
      this.showErr = true;
      // this.messageErr = 'Ngày áp dụng phải thuộc khoảng thời gian năm học đang cấu hình!';
      this.messageErr = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    if (dateValue < today) {
      this.showErr = true;
      // this.messageErr = 'Ngày áp dụng phải lớn hơn hoặc bằng ngày hiện tại!';
      this.messageErr = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_TODAY');
      return;
    }
    // check them endDate
    const toDate = new Date(this.toDate);
    const toDateValue = formatDate(toDate, 'yyyy/MM/dd', 'en');
    if (dateValue > toDateValue) {
      this.showErr = true;
      this.messageErr = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    this.showErr = false;
    // Môn học
    if (this.checkValidateSubject() === false) {
      return;
    }
    // Cột điểm
    if (this.selected === 0 && (this.listConfScoreDetailsTemp.length === 0 || this.listConfScoreDetailsTemp.length === undefined)) {
      // this.toastr.error('Vui lòng thêm cột điểm');
      this.toastr.error(this.translate.instant('SCOREBOARD.MSG.ADD_SCORE'));
      return;
    }
    if (this.selected === 0 && this.validatorScoreDetails() === false) {
      return;
    }
    if (this.selected === 1 && this.validatorGrading() === false) {
      return;
    }
    // Lưu dữ liệu
    // Không chọn áp dụng
    if (this.checked === false) {
      // Tính điểm
      this.addListConfScoreDetailsDTO.gradeId = this.gradeLevel;
      this.addListConfScoreDetailsDTO.applyDate = this.applyDate;
      this.addListConfScoreDetailsDTO.year = this.year;
      this.addListConfScoreDetailsDTO.listSubjectDTO = this.subject;
      if (this.selected === 0){
        this.addListConfScoreDetailsDTO.listConfScoreDetails = this.listConfScoreDetailsTemp;
        this.confScoreDetailsService.addConfScoreDetails(this.addListConfScoreDetailsDTO).subscribe(re => {
          if (re.status === 'OK') {
            this.dialogRef.close({data: 'Thành công'});
          } else if (re.status === 'INTERNAL_SERVER_ERROR') {
            this.toastr.error(re.message);
          }
        })
      }else{
        // Xếp loại
        let listData = [];
        this.listConfGradeDetails.forEach(e => {
          let item = {};
          if (e.typeChoose) {
            item = {...this.gradeDetail, name: e.name.trim(), selectedValue: e.selectedValue, typeChoose: 1}
          } else {
            item = {...this.gradeDetail, name: e.name.trim(), selectedValue: e.selectedValue, typeChoose: 0}
          }
          listData = [...listData, item];
        });
        this.listConfGradeDetails = listData;
        this.addListConfScoreDetailsDTO.confGradingDetailsDTOS = this.listConfGradeDetails;
        this.confScoreDetailsService.addConfGradingDetails(this.addListConfScoreDetailsDTO).subscribe(re => {
          if (re.status === 'OK') {
            this.dialogRef.close({data: 'Thành công'});
          } else if (re.status === 'INTERNAL_SERVER_ERROR') {
            this.toastr.error(re.message);
          }
        })
      }
    }
    // Chọn áp dụng
    else {
      if (this.selected === 0) {
        this.addConfScoreDetail.year = this.year;
        this.addConfScoreDetail.applyDate = this.applyDate + 'T00:00:00Z';
        this.addConfScoreDetail.confScoreDetailsDTOList = this.listConfScoreDetailsTemp;
        this.confScoreDetailsService.addAllScoreDetails(this.addConfScoreDetail).subscribe(re => {
          if (re.status === 'OK') {
            this.dialogRef.close({data: 'Thành công'});
          } else if (re.status === 'INTERNAL_SERVER_ERROR') {
            this.toastr.error(re.message);
          }
        })
      } else {
        this.addConfGradingDetail.year = this.year;
        this.addConfGradingDetail.applyDate = this.applyDate + 'T00:00:00Z';
        let listData = [];
        this.listConfGradeDetails.forEach(e => {
          let item = {};
          if (e.typeChoose) {
            item = {...this.gradeDetail, name: e.name.trim(), selectedValue: e.selectedValue, typeChoose: 1}
          } else {
            item = {...this.gradeDetail, name: e.name.trim(), selectedValue: e.selectedValue, typeChoose: 0}
          }
          listData = [...listData, item];
        });
        this.listConfGradeDetails = listData;
        this.addConfGradingDetail.confGradingDetailsDTOS = this.listConfGradeDetails;
        this.confScoreDetailsService.addAllGradingDetails(this.addConfGradingDetail).subscribe(re => {
          if (re.status === 'OK') {
            this.dialogRef.close({data: 'Thành công'});
          } else if (re.status === 'INTERNAL_SERVER_ERROR') {
            this.toastr.error(re.message);
          }
        })
      }
    }
  }

  addColum() {
    if (this.selected === 0) {
      if (this.validatorScoreDetails() === true) {
        this.itemTableS = new TableS();
        this.itemTableS.quantity = 1;
        this.itemTableS.minimumScore = 1;
        this.itemTableS.coefficient = 1;
        this.listConfScoreDetailsTemp.push(this.itemTableS);
      }
    } else {
      if (this.validatorGrading() === true) {
        this.itemTableGrading = new TableGradingModel();
        this.itemTableGrading.typeChoose = 0;
        if (this.listConfGradeDetails.length === 0 || this.listConfGradeDetails === undefined)
          // this.itemTableGrading.name = 'Xếp loại';
          this.itemTableGrading.name = this.translate.instant('SCOREBOARD.GRADING');
        this.listConfGradeDetails.push(this.itemTableGrading);
      }
    }
  }

  changeTypeChoose(i: any) {
    if (this.listConfGradeDetails[i].typeChoose === false)
      this.listConfGradeDetails[i].selectedValue = '';
  }

  deleteItem(i: number) {
    const dataConfirm = {title: this.translate.instant('SCOREBOARD.TITLE_CONFIRM_DELETE'), message: this.translate.instant('SCOREBOARD.CONFIRM_DELETE')}
    this.matDialog.open(DeleteClassRoomComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        if (this.selected === 0)
          this.listConfScoreDetailsTemp.splice(i, 1);
        else
          this.listConfGradeDetails.splice(i, 1);
      }
    })
  }

  // Validate cell table
  validatorScoreDetails(): boolean {
    let check = 0
    for (let i = 0; i < this.listConfScoreDetailsTemp.length; i++) {
      // tslint:disable-next-line:max-line-length
      if (this.isEmpty(this.listConfScoreDetailsTemp[i].name) || this.listConfScoreDetailsTemp[i].name.trim() === null|| this.listConfScoreDetailsTemp[i].name.trim() === '' || this.listConfScoreDetailsTemp[i].name.trim() === undefined) {
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.SCORE_BLANK'));
        check = check + 1;
        break;
      } else if ((this.listConfScoreDetailsTemp[i].name.trim()).length > 250) {
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.SCORE_MAX_LENGHT'));
        check = check + 1;
        break;
      } else {
        for (let j = i+1; j < this.listConfScoreDetailsTemp.length; j++) {
          // tslint:disable-next-line:max-line-length
          if (this.isEmpty(this.listConfScoreDetailsTemp[j].name) || this.listConfScoreDetailsTemp[j].name.trim() === null|| this.listConfScoreDetailsTemp[j].name.trim() === '' || this.listConfScoreDetailsTemp[j].name.trim() === undefined) {
            break;
          }
          // tslint:disable-next-line:max-line-length
          if ((this.listConfScoreDetailsTemp[i].name).trim().toUpperCase() === (this.listConfScoreDetailsTemp[j].name).trim().toUpperCase() || (this.listConfScoreDetailsTemp[i].name) === (this.listConfScoreDetailsTemp[j].name)) {
            // this.toastr.error('Không được nhập trùng tên cột điểm');
            this.toastr.error(this.translate.instant('SCOREBOARD.MSG.SCORE_NOT_MATCH'));
            check = check + 1;
            break;
          }
        }
      }
      if (check === 0 && (this.listConfScoreDetailsTemp[i].minimumScore > this.listConfScoreDetailsTemp[i].quantity)) {
        // this.toastr.error('Số điểm nhập tối thiểu phải nhỏ hơn hoặc bằng số lượng')
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.MINSCORE_QUANTITY'))
        check = check + 1;
        break;
      }
    }
    if (check === 0) {
      return true;
    } else
      return false;
  }

  // Validate cell GradingDetails
  validatorGrading(): boolean {
    let check = 0;
    for (let i = 0; i < this.listConfGradeDetails.length; i++) {
      // tslint:disable-next-line:max-line-length
      if (this.isEmpty(this.listConfGradeDetails[i].name) || this.listConfGradeDetails[i].name.trim() === null || this.listConfGradeDetails[i].name.trim() === undefined || this.listConfGradeDetails[i].name.trim() === '') {
        // this.toastr.error('Cột xếp loại không được để trống!');
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.GRADING_BLANK'));
        check = check + 1;
        break;
      } else if (this.listConfGradeDetails[i].name.length > 250){
        // this.toastr.error('Tên xếp loại có độ dài không quá 250 ký tự');
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.NAME_GRADING_MAXLENGHT'));
        check = check + 1;
        break;
      } else {
        for (let j = i + 1; j < this.listConfGradeDetails.length; j++) {
          // tslint:disable-next-line:max-line-length
          if (this.isEmpty(this.listConfGradeDetails[j].name) || this.listConfGradeDetails[j].name.trim() === null || this.listConfGradeDetails[j].name.trim() === undefined || this.listConfGradeDetails[j].name.trim() === '') {
            break;
          }
        else if ((this.listConfGradeDetails[i].name).trim().toUpperCase() === (this.listConfGradeDetails[j].name).trim().toUpperCase()) {
            // this.toastr.error('Không được nhập trùng tên xếp loại');
            this.toastr.error(this.translate.instant('SCOREBOARD.MSG.GRADING_NOT_MATCH'));
            check = check + 1;
            break;
          }
        }
      }
      if (check === 0 && this.listConfGradeDetails[i].typeChoose === true) {
        // tslint:disable-next-line:max-line-length
        if (this.isEmpty(this.listConfGradeDetails[i].selectedValue) || this.listConfGradeDetails[i].selectedValue.trim() === undefined || this.listConfGradeDetails[i].selectedValue.trim() === null || this.listConfGradeDetails[i].selectedValue.trim() === '') {
          // this.toastr.error('Giá trị lựa chọn không được để trống!');
          this.toastr.error(this.translate.instant('SCOREBOARD.MSG.TYPE_CHOOSE_BLANK'));
          check = check + 1;
          break;
        } else if (this.listConfGradeDetails[i].selectedValue.length > 500) {
          // this.toastr.error('Nhập giá trị lựa chọn có độ dài không quá 500 ký tự');
          this.toastr.error(this.translate.instant('SCOREBOARD.MSG.TYPE_CHOOSE_MAXLENGHT'));
          check = check + 1;
          break;
        }
      }
    }
    if (check === 0) {
      return true;
    } else
      return false;
  }

  checkValidateSubject(): boolean {
    let check = 0;
    if (this.isEmpty(this.subject) || this.subject === [] || this.subject.length === 0) {
      this.errSubject.error = true;
      this.errSubject.message = this.translate.instant('SCOREBOARD.MSG.SUBJECT_BLANK');
      check = 1;
    } else {
      this.errSubject.error = false;
      this.errSubject.message = '';
      check = 0;
    }
    if (check === 0)
      return true;
    else
      return false;
  }

  isEmpty(data: any): boolean {
    return data === null || data === undefined || data === ''
  }

  cancel(){
    this.dialogRef.close();
  }
}
