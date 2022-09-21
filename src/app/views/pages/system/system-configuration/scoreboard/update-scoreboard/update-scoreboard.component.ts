import {ChangeDetectorRef, Component, Inject, OnInit, Optional} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {ConfScoreDetailsService} from '../../../../../../core/service/service-model/conf-score-details.service';
import {ToastrService} from 'ngx-toastr';
import {TableS} from 'src/app/core/service/model/tabe.model';
import {SubjectService} from '../../../../../../core/service/service-model/subject.service';
import {TableGradingModel} from '../../../../../../core/service/model/tableGrading.model';
import {DatePipe} from '@angular/common';
import {formatDate} from '@angular/common'
import {ScoreBoardService} from '../../../../../../core/service/service-model/score-board.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-update-scoreboard',
  templateUrl: './update-scoreboard.component.html',
  styleUrls: ['./update-scoreboard.component.scss'],
})
export class UpdateScoreboardComponent implements OnInit {
  public itemTableS: TableS;
  public itemTableGrading: TableGradingModel;
  listConfScoreDetailsTemp = [];
  listData: any = {};
  type: any;
  subject;
  parentCode: any;
  confScoreDetails: any = {};
  confGradingLevel: any = {};
  gradeLevel:any;
  year: any;
  bl: boolean;
  checked = 0;
  subjectId: any;
  subjectCode: any;
  scoreSubject: any = {};
  searchScoreSubject: any;
  applyDate;
  listDelete: any = [];
  dataUpdate;
  semester;
  dateLock;
  listYear: any = [];
  toDateValue: Date;
  fromDateValue: Date;
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
  errApplyDate = {
    error: false,
    message: ''
  }
  toDate;
  fromDate;
  KEYCODE_0 = 48
  KEYCODE_9 = 57
  check;
  checkDateFalse = true;
  langKey;

  constructor(private dialogRef: MatDialogRef<UpdateScoreboardComponent>,
              private confScoreDetailSerice: ConfScoreDetailsService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private toastr: ToastrService,
              private matDialog: MatDialog,
              private subjectService: SubjectService,
              private datepipe: DatePipe,
              private scoreBoardService: ScoreBoardService,
              private changeDetectorRef : ChangeDetectorRef,
              private translate: TranslateService) {
    this.toDate = data.toDate;
    this.dataUpdate = data.listData;
    this.type = data.action;
    this.subjectId = data.subjectId;
    this.year = data.year;
    this.gradeLevel = data.gradeLevel;
    this.langKey = (localStorage.getItem('language'));
  }

  ngOnInit(): void {
    this.scoreSubject.parentCode = this.dataUpdate[0].parentCode;
    // Lấy ra kỳ của năm học đó
    const todayDate = new Date(this.toDate);
    const toDateValue = formatDate(todayDate, 'yyyy/MM/dd', 'en');
    this.confScoreDetailSerice.getYear(this.year).subscribe(re=>{
      this.listYear = re;
      this.changeDetectorRef.detectChanges();
    })
    this.subjectService.findById(this.subjectId).subscribe(res => {
      this.subject = res.code + ' - ' + res.name;
      this.subjectCode = res.code;
      this.confScoreDetailSerice.findConfScoreSubject(this.scoreSubject.parentCode, res.code).subscribe(re => {
        console.log(re)
        this.applyDate = this.datepipe.transform(re.applySate, 'yyyy-MM-dd');
        console.log(this.applyDate);
        if(this.type === 'score'){
          this.scoreBoardService.loadGridViewLeft(this.gradeLevel, this.subjectId, this.applyDate, this.year).subscribe(resAPI => {
            this.listConfScoreDetailsTemp = resAPI;
            this.changeDetectorRef.detectChanges();
          });
        }else{
          this.scoreBoardService.loadGridViewRight(this.gradeLevel, this.subjectId, this.applyDate, this.year).subscribe(resAPI => {
            this.listConfScoreDetailsTemp = resAPI;
            this.changeDetectorRef.detectChanges();
          });
        }
      })
    })

    this.getDateToFrom(this.year);
    // Lấy ra đk ngày khóa
    this.confScoreDetailSerice.getSemesterConf(this.year).subscribe(res=>{
    if(this.type === 'score'){
      this.confScoreDetailSerice.getEntryLockDate(this.year, this.gradeLevel, res, this.scoreSubject.parentCode).subscribe(re=>{
        console.log(re);
        if (re.length === 0) {
          return;
        }
        this.dateLock = re[0].entryLockDate;
        console.log(this.dateLock);
        this.changeDetectorRef.detectChanges();
      })
    }else{
      // tslint:disable-next-line:max-line-length
      this.confScoreDetailSerice.getEntryLockDateGrading(this.year, this.gradeLevel, res, this.scoreSubject.parentCode).subscribe(re=>{
        if (re.length === 0) {
          return;
        }
        this.dateLock = re[0].entryLockDate;
        console.log(this.dateLock);
        this.changeDetectorRef.detectChanges();
      })
    }
    })
  }

  getDateToFrom(year: any){
    let length;
    this.confScoreDetailSerice.getYear(year).subscribe(re=>{
      length = re.length;
      console.log(re)
      this.fromDate = this.datepipe.transform(re[0].fromDate, 'yyyy-MM-dd');
      this.toDate = this.datepipe.transform(re[length-1].toDate, 'yyyy-MM-dd');
      this.changeDetectorRef.detectChanges();
    })
  }

  changeApplyDate($event) {
    // Nếu chưa nhập ngày áp dụng
    this.check = true;
    if (this.applyDate === '') {
      this.errApplyDate.error = true;
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.APPLY_DATE_BLANK');
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
      this.errApplyDate.error = true;
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    if (dateValue < today) {
      this.errApplyDate.error = true;
      // this.errApplyDate.message = 'Ngày áp dụng phải lớn hơn hoặc bằng ngày hiện tại!';
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_TODAY');
      return;
    }
    // check them endDate
    const toDate = new Date(this.toDate);
    const toDateValue = formatDate(toDate, 'yyyy/MM/dd', 'en');
    if (dateValue > toDateValue) {
      this.errApplyDate.error = true;
      // this.errApplyDate.message = 'Ngày áp dụng phải thuộc khoảng thời gian năm học đang cấu hình!';
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    // check datelock
    console.log(this.dateLock)
    if(this.dateLock !== undefined){
      const dateLock = new Date(this.dateLock);
      const dateLockValue = formatDate(dateLock, 'yyyy/MM/dd', 'en');
      console.log(dateLockValue)
      console.log(dateValue)
      if (dateLockValue < dateValue || dateLockValue === dateValue) {
        this.errApplyDate.error = true;
        // this.errApplyDate.message = 'Ngày áp dụng phải nhỏ hơn ngày khóa nhập điểm!';
        this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_DATE_CONF');
        return;
      }
    }
    this.checkDateFalse = true;
    this.errApplyDate.error = false;
  }

  updateScoreDetail() {
    if (this.errApplyDate.error) {
      this.toastr.error(this.errApplyDate.message);
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
      this.errApplyDate.error = true;
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    if (dateValue < today) {
      this.errApplyDate.error = true;
      // this.errApplyDate.message = 'Ngày áp dụng phải lớn hơn hoặc bằng ngày hiện tại!';
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_TODAY');
      return;
    }
    // check them endDate
    const toDate = new Date(this.toDate);
    const toDateValue = formatDate(toDate, 'yyyy/MM/dd', 'en');
    if (dateValue > toDateValue) {
      this.errApplyDate.error = true;
      // this.errApplyDate.message = 'Ngày áp dụng phải thuộc khoảng thời gian năm học đang cấu hình!';
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    // check datelock
    if(this.dateLock !== undefined){
      const dateLock = new Date(this.dateLock);
      const dateLockValue = formatDate(dateLock, 'yyyy/MM/dd', 'en');
      if (dateLockValue < dateValue || dateLockValue === dateValue) {
        this.errApplyDate.error = true;
        // this.errApplyDate.message = 'Ngày áp dụng phải nhỏ hơn ngày khóa nhập điểm!';
        this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_DATE_CONF');
        return;
      }
    }
    this.errApplyDate.error = false;
    if (this.validatorScoreDetails() === true) {
      this.scoreSubject.applySate = this.applyDate + 'T00:00:00Z';
      this.scoreSubject.subjectCode = this.subjectCode;
      this.scoreSubject.code = this.listConfScoreDetailsTemp[0].parentCode;
      this.confScoreDetailSerice.findConfScoreSubject(this.scoreSubject.code, this.subjectCode).subscribe(re => {
        this.scoreSubject.id = re.id;
        this.scoreSubject.parentCode = re.parentCode;
        this.confScoreDetailSerice.updateScoreSuject(re.id, this.scoreSubject).subscribe(res => {
          console.log('Thành công');
          this.listConfScoreDetailsTemp.forEach(e => {
            // update scoredetail
            this.confScoreDetails.id = e.id;
            this.confScoreDetails.name = e.name.trim();
            this.confScoreDetails.coefficient = e.coefficient;
            this.confScoreDetails.quantity = e.quantity;
            this.confScoreDetails.minimumScore = e.minimumScore;
            this.confScoreDetails.parentCode = this.scoreSubject.code;
            this.confScoreDetails.code = e.code;
            console.log(this.confScoreDetails);
            if(e.id === null || e.id === undefined){
              this.confScoreDetailSerice.addDataConfScoreDetail(this.confScoreDetails).subscribe(resAPI => {
                console.log('Thành công');
              });
            }else{
              this.confScoreDetailSerice
                .updateConfScoreDetail(this.confScoreDetails.id, this.confScoreDetails)
                .subscribe((resAPI) => {
                  console.log(resAPI);
                  console.log('Thành công');
                  this.checked = this.checked + 1;
                });
            }
          })
          // delete
          if(this.listDelete !== null){
          console.log(this.listDelete);
            this.listDelete.forEach(e=>{
              this.confScoreDetailSerice.removeDataConfScore(e).subscribe((resAPI) => {
              });
            })
          }
        })
      })
      this.dialogRef.close({event: this.type, data: 'Thành công'});
    }
  }

  updateGradingLevel() {
    if (this.errApplyDate.error) {
      this.toastr.error(this.errApplyDate.message);
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
      this.errApplyDate.error = true;
      // this.errApplyDate.message = 'Ngày áp dụng phải thuộc khoảng thời gian năm học đang cấu hình!';
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    if (dateValue < today) {
      this.errApplyDate.error = true;
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_TODAY');
      return;
    }
    // check them endDate
    const toDate = new Date(this.toDate);
    const toDateValue = formatDate(toDate, 'yyyy/MM/dd', 'en');
    if (dateValue > toDateValue) {
      this.errApplyDate.error = true;
      // this.errApplyDate.message = 'Ngày áp dụng phải thuộc khoảng thời gian năm học đang cấu hình!';
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_NOT_YEAR');
      return;
    }
    // check datelock
    if(this.dateLock !== undefined){
      const dateLock = new Date(this.dateLock);
      const dateLockValue = formatDate(dateLock, 'yyyy/MM/dd', 'en');
      console.log(dateLockValue)
      console.log(dateValue)
      if (dateLockValue < dateValue || dateLockValue === dateValue) {
        this.errApplyDate.error = true;
        // this.errApplyDate.message = 'Ngày áp dụng phải nhỏ hơn ngày khóa nhập điểm!';
        this.errApplyDate.message = this.translate.instant('SCOREBOARD.MSG.APPLY_DATE_DATE_CONF');
        return;
      }
    }
    this.errApplyDate.error = false;
    if (this.validatorGrading() === true) {
      this.scoreSubject.applySate = this.applyDate + 'T00:00:00Z';
      this.scoreSubject.subjectCode = this.subjectCode;
      this.scoreSubject.code = this.listConfScoreDetailsTemp[0].parentCode;
      this.confScoreDetailSerice.findConfScoreSubject(this.scoreSubject.code, this.subjectCode).subscribe(re => {
        this.scoreSubject.id = re.id;
        this.scoreSubject.parentCode = re.parentCode;
        this.confScoreDetailSerice.updateScoreSuject(re.id, this.scoreSubject).subscribe(res => {
          console.log('Thành công');
          // update scoredetail
          console.log(this.listConfScoreDetailsTemp);
          this.listConfScoreDetailsTemp.forEach(e => {
            // update scoresubject
            console.log(this.confGradingLevel);
            this.confGradingLevel.id = e.id;
            this.confGradingLevel.name = e.name.trim();
            console.log(e.typeChoose);
            if (e.typeChoose === true || e.typeChoose === 1)
              this.confGradingLevel.typeChoose = 1;
            else
              this.confGradingLevel.typeChoose = 0
            if(e.selectedValue === null || e.selectedValue === undefined)
              this.confGradingLevel.selectedValue = e.selectedValue;
            else
              this.confGradingLevel.selectedValue = e.selectedValue.trim();
            this.confGradingLevel.code = e.code;
            this.confGradingLevel.parentCode = this.scoreSubject.code;
            console.log(this.confGradingLevel);
            if(e.id === null || e.id === undefined){
              console.log(this.confGradingLevel);
              this.confScoreDetailSerice.addDataConfGradingDetails(this.confGradingLevel).subscribe(resAPI => {
                console.log('Thành công');
              })
            }else{
              this.confScoreDetailSerice
                .updateConfGradeLevelDetail(e.id, this.confGradingLevel)
                .subscribe((resApi) => {
                  console.log('Thành công');
                })
            }
          })
        })
        if(this.listDelete !== null){
          this.listDelete.forEach(e=>{
            this.confScoreDetailSerice.removeDataConfGrade(e).subscribe((resAPI) => {
            });
          })
        }
      })
      this.dialogRef.close({event: this.type, data: 'Thành công'});
    }
  }

  deleteItem(item: any, id: number) {

  }

  addColumn() {
    this.itemTableS = new TableS();
    const length = this.listConfScoreDetailsTemp.length;
    if (this.type === 'score') {
      if (this.validatorScoreDetails() === true) {
        this.itemTableS.quantity = 1;
        this.itemTableS.minimumScore = 1;
        this.itemTableS.coefficient = 1;
        this.listConfScoreDetailsTemp.push(this.itemTableS);
      }
    } else {
      if (this.validatorGrading() === true) {
        this.itemTableGrading = new TableGradingModel();
        this.itemTableGrading.typeChoose = 0;
        this.listConfScoreDetailsTemp.push(this.itemTableGrading);
      }
    }
  }

  changeTypeChoose(i: any) {
    if (this.listConfScoreDetailsTemp[i].typeChoose === false)
      this.listConfScoreDetailsTemp[i].selectedValue = '';
  }

  getDateToday() {
    return new Date();
  }

  // Validate cell table
  validatorScoreDetails(): boolean {
    let check = 0
    for (let i = 0; i < this.listConfScoreDetailsTemp.length; i++) {
      // tslint:disable-next-line:max-line-length
      if (this.isEmpty(this.listConfScoreDetailsTemp[i].name) || this.listConfScoreDetailsTemp[i].name.trim() === null || this.listConfScoreDetailsTemp[i].name.trim() === '' || this.listConfScoreDetailsTemp[i].name.trim() === undefined) {
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.SCORE_BLANK'));
        check = check + 1;
        break;
      } else if (this.listConfScoreDetailsTemp[i].name.length > 250) {
        // this.toastr.error('Cột điểm có độ dài không quá 250 ký tự!');
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.SCORE_MAX_LENGHT'));
        check = check + 1;
        break;
      } else {
        for (let j = i + 1; j < this.listConfScoreDetailsTemp.length; j++) {
          // tslint:disable-next-line:max-line-length
          if (this.isEmpty(this.listConfScoreDetailsTemp[j].name) || this.listConfScoreDetailsTemp[j].name.trim() === null|| this.listConfScoreDetailsTemp[j].name.trim() === '' || this.listConfScoreDetailsTemp[j].name.trim() === undefined) {
            break;
          }
          // tslint:disable-next-line:max-line-length
          if ((this.listConfScoreDetailsTemp[i].name).trim().toUpperCase() === (this.listConfScoreDetailsTemp[j].name).trim().toUpperCase()) {
            // this.toastr.error('Không được nhập trùng tên cột điểm!');
            this.toastr.error(this.translate.instant('SCOREBOARD.MSG.SCORE_NOT_MATCH'));
            check = check + 1;
            break;
          }
        }
      }
      if(check === 0 && (this.listConfScoreDetailsTemp[i].minimumScore > this.listConfScoreDetailsTemp[i].quantity)) {
        // this.toastr.error('Số điểm nhập tối thiểu phải nhỏ hơn hoặc bằng số lượng!')
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
    for (let i = 0; i < this.listConfScoreDetailsTemp.length; i++) {
      // tslint:disable-next-line:max-line-length
      if (this.isEmpty(this.listConfScoreDetailsTemp[i].name) || this.listConfScoreDetailsTemp[i].name.trim() === null || this.listConfScoreDetailsTemp[i].name.trim() === '') {
        // this.toastr.error('Cột xếp loại không được để trống!');
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.GRADING_BLANK'));
        check = check + 1;
        break;
      } else if (this.listConfScoreDetailsTemp[i].name.length > 250) {
        // this.toastr.error('Tên xếp loại có độ dài không quá 250 ký tự!');
        this.toastr.error(this.translate.instant('SCOREBOARD.MSG.NAME_GRADING_MAXLENGHT'));
        check = check + 1;
        break;
      } else {
        for (let j = i + 1; j < this.listConfScoreDetailsTemp.length; j++) {
          // tslint:disable-next-line:max-line-length
          if (this.isEmpty(this.listConfScoreDetailsTemp[j].name) || this.listConfScoreDetailsTemp[j].name.trim() === null || this.listConfScoreDetailsTemp[j].name.trim() === undefined || this.listConfScoreDetailsTemp[j].name.trim() === '') {
            break;
          }
          // tslint:disable-next-line:max-line-length
          if ((this.listConfScoreDetailsTemp[i].name).trim().toUpperCase() === (this.listConfScoreDetailsTemp[j].name).trim().toUpperCase()) {
            this.toastr.error(this.translate.instant('SCOREBOARD.MSG.GRADING_NOT_MATCH'));
            check = check + 1;
            break;
          }
        }
      }
      if (check === 0 && (this.listConfScoreDetailsTemp[i].typeChoose === true || this.listConfScoreDetailsTemp[i].typeChoose === 1)) {
        // tslint:disable-next-line:max-line-length
        if (this.isEmpty(this.listConfScoreDetailsTemp[i].selectedValue) || this.listConfScoreDetailsTemp[i].selectedValue.trim() === null || this.listConfScoreDetailsTemp[i].selectedValue.trim() === undefined || this.listConfScoreDetailsTemp[i].selectedValue.trim() === '') {
          this.toastr.error(this.translate.instant('SCOREBOARD.MSG.TYPE_CHOOSE_BLANK'));
          check = check + 1;
          break;
        } else if (this.listConfScoreDetailsTemp[i].selectedValue.length > 500) {
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

  checkApplyDate($event) {
    if(this.check){
      return;
    }
    if ($event.keyCode >= this.KEYCODE_0 && $event.keyCode <= this.KEYCODE_9) {
      console.log($event.keyCode)
      if (this.isEmpty(this.applyDate)) {
        this.errApplyDate.error= true
        this.errApplyDate.message = this.translate.instant('SCOREBOARD.APPLY_DATE_REQUIRED');
        this.checkDateFalse = false;
        return
      }
      this.errApplyDate.error = false;
      this.checkDateFalse = true;
    }
    if ($event.keyCode === 8 || $event.keyCode === 46) {
      this.errApplyDate.error= true
      this.errApplyDate.message = this.translate.instant('SCOREBOARD.APPLY_DATE_BLANK');
      return
    }
    this.checkDateFalse = true;
    // this.errApplyDate.error = false
  }

  isEmpty(data: any): boolean {
    return data === null || data === undefined || data === ''
  }

  cannel(){
    this.dialogRef.close({event: this.type, data: 'cancel'});
  }

}
