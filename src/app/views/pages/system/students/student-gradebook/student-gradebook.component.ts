import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ClassroomService} from 'src/app/core/service/service-model/classroom.service';
import {StudentsService} from 'src/app/core/service/service-model/students.service';
import {calculateFistLastPageTable, pagination, removeEmptyQuery} from 'src/app/helpers/utils';
import {NO_ROW_GRID_TEMPLATE, PAGE_SIZE, TABLE_CELL_STYLE} from 'src/app/helpers/constants';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {InputScoreComponent} from './input-score/input-score.component';
import {InputRankComponent} from './input-rank/input-rank.component';
import {ActionEvaluateComponent} from './action-evaluate/action-evaluate.component';
import {HeaderCheckboxComponent} from './header-checkbox/header-checkbox.component';
import {CheckboxColumnComponent} from './checkbox-column/checkbox-column.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';
import {AvgScoreComponent} from './avg-score/avg-score.component';
import {TranslateService} from '@ngx-translate/core';
import PerfectScrollbar from "perfect-scrollbar";
import {TooltipComponent} from "../../system-configuration/scoreboard/tooltip/tooltip.component";

@Component({
  selector: 'kt-student-gradebook',
  templateUrl: './student-gradebook.component.html',
  styleUrls: ['./student-gradebook.component.scss']
})
export class StudentGradebookComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  overlayNoRowsTemplate;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private classRoomService: ClassroomService,
    private studentService: StudentsService,
    private toaStr: ToastrService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private translate: TranslateService,
  ) {
    this.translatePage();
    this.overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  }

  modalRef: BsModalRef;

  columnDefs = [];
  rowData = [];
  rowDataClone = [];
  semesters = [];

  classRooms = [];
  subjects = [];
  lockTimes = [];
  isShowButton = false;

  gridApi;
  gridColumnApi;
  totalPage;
  currentYear: any;

  currentSchoolYear;
  schoolYearByTeacher;
  isTouch;

  searchModel = {
    classCode: null,
    schoolYear: null,
    semester: null,
    subjectCode: null
  };

  title = {
    subjectName: null,
    className: null,
    semester: null,
  }

  lastSemester;
  notAllowUpdate;
  currentPage = 1;
  total = 0;
  first = 0;
  last = 0;
  rangeWithDots: number[];

  HEADER_HEIGHT_SCORE = 40;
  HEADER_GROUP_HEIGHT = 24;
  HEADER_HEIGHT_RANK = 56;
  ROW_HEIGHT = 50;

  typeSubject;
  update = false;

  checkedColumn = 1;

  pageData: any = [];

  fullYearSemester;
  studentCode;
  studentName;
  scoreIndex;
  avgScoreTranslate;
  titleConfirmTranslate;
  msgConfirmTranslate;
  sttTranslate;

  isShowLoading;

  ngOnInit(): void {
    this.studentService.changeIsShowUpdateGradeBook(false);

    this.loadCurrentYear();

    // Auto checkbox
    this.checkBoxAllChange();
  }

  loadCurrentYear(): void {
    this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res) {
        this.currentYear = res;
        this.searchModel.schoolYear = res;
        // Load class list
        this.loadClassRoom();
      }
    });
  }

  loadClassRoom(data?): void {
    const query =
      {
        years: this.currentYear
      };
    this.studentService.getAllClassRoom(query).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res && res.length > 0) {
          this.classRooms = res;
          this.searchModel.classCode = data ? data.code : res[0].code;
          this.title.className = data ? data.name : res[0].name;
          this.loadSubject();
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res);
      }
    });
  }

  loadSubject(): void {
    const query = {
      years: this.currentYear,
      classCode: this.searchModel.classCode
    };

    // Show loading
    this.isShowLoading = true;
    this.studentService.getAllSubject(query).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res && res.length > 0) {
          this.subjects = res;
          this.searchModel.subjectCode = res[0].code;
          this.title.subjectName = res[0].name;
          this.loadSemester(res[0]);
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        this.isShowLoading = false;
        console.log(res);
      }
    });
  }

  selectSubject(data) {
    let subjectSelected = {};
    this.subjects.forEach(item => {
      if (item.code === data.code) {
        subjectSelected = item;
      }
    });
    this.title.subjectName = data.name;
    this.searchModel.subjectCode = data.code;
    this.loadSemester(subjectSelected);
  }

  loadSemester(subject:any): void {
    console.log('subject',subject);
    let isFullYear = false;

    this.semesters = subject.schoolYears.map(e => {
      if (e.semester === this.fullYearSemester) {
        isFullYear = true;
        return {
          ...e,
          semesterDisplay: e.semester
        };
      } else {
        return {
          ...e,
          semesterDisplay: this.mapSemester(e.semester)
        };
      }
    });
    if (isFullYear) {
      this.lastSemester = this.semesters[this.semesters.length - 2];
    } else {
      this.lastSemester = this.semesters[this.semesters.length - 1];
    }
    this.searchModel.semester = subject.schoolYear.semester;
    this.title.semester = this.mapSemester(this.searchModel.semester);
    this.loadLockTime();

    this.currentSchoolYear = subject.schoolYearCurrent;

    // Check semester current is semester assignment for teacher
    this.isTouch = false;
    subject.schoolYearsByTeacher.forEach(
      item => {
        if (item.semester === this.currentSchoolYear.semester) {
          this.isTouch = true;
        }
    });
  }

  selectSemester(event) {
    this.searchModel.semester = event.semester;
    this.loadLockTime();
  }

  loadLockTime(subject?: any): void {
    const query = this.searchModel.semester === this.fullYearSemester ?
      {
        ...this.searchModel,
        semester: this.lastSemester.semester
      }
      :
      this.searchModel;
    this.studentService.getTimeLockPoint(query).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {

        this.doSearch(1);

        if (res && res.length > 0) {
          console.log('lock date',res);
          this.notAllowUpdate = true;
          this.lockTimes = res;
          res.forEach(lock => {
            if (lock.status !== null) {
              if (lock.status === 1) {
                this.notAllowUpdate = false;
              }
            } else {
              this.notAllowUpdate = false;
            }
          });
          this.changeDetectorRef.detectChanges();
        } else {
          this.notAllowUpdate = true;
          this.lockTimes = [];
        }
      },
      error: res => {
        this.isShowLoading = false;
        console.log(res);
      }
    });
  }

  // =================================================TABLE============================================//
  doSearch(page: number): void {
    if (!this.update) {
      // Set default input by column
      this.checkedColumn = 1;
      this.gridApi.checkedColumn = 1;
    } else {
      // Set checkbox row or column
      this.gridApi.checkedColumn = this.checkedColumn;
    }

    this.currentPage = page;

    const search = this.searchModel.semester === this.fullYearSemester ?
      {
        ...this.searchModel,
        semester: 0,
        page: this.currentPage,
        pageSize: PAGE_SIZE
      }
      :
      {
        ...this.searchModel,
        page: this.currentPage,
        pageSize: PAGE_SIZE
      };

    removeEmptyQuery(search);

    console.log({search});

    // Loading
    if (!this.isShowLoading) {
      this.isShowLoading = true;
      this.changeDetectorRef.detectChanges();
    }

    this.studentService.getAllGradebook(search).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        this.isShowLoading = false;

        if (res.content?.length > 0 && res.content[0]?.listScore?.length > 0) {
          // Type score
          if (res.content[0].listScore[0].type === 0) {
            this.typeSubject = 0;
            res.content.forEach(element => {
              this.setDateLock(element);
              element.semesterNow = this.currentSchoolYear.semester;
              element.semesterSelected = this.searchModel.semester;
              element.isTouch = this.isTouch;
              element.checked = element.avgScore ? true : false;
              element.listScore.forEach((e, i) => {
                const score = 'score' + (i + 1);
                element[score] = e.value;
              });
              element.listScoreFormat = this.formatListScoreData(element.listScore)
                .map(o => {
                  return {
                    ...o,
                    scoreCode: o.options[0].scoreCode,
                  };
                });
              element.table = this.generateScores(element.listScoreFormat);
            });
            console.log('scores', res.content);
            this.generateColumn(res.content, 'score');
            this.rowData = res.content;
            this.autoCheckBoxHeader('score');

            this.gridApi.setGroupHeaderHeight(this.HEADER_GROUP_HEIGHT);
            this.gridApi.setHeaderHeight(this.HEADER_HEIGHT_SCORE);
          }
          // Type rank
          else if(res.content[0].listScore[0].type === 1) {
            this.typeSubject = 1;
            res.content.forEach((element) => {
              this.setDateLock(element);
              element.listScore.forEach((e, i) => {
                const ranks = 'ranks' + i;
                const selected = 'selectList' + i;
                element[ranks] = e.value;
                element[selected] = e.selectedValue;
              });
              element.semesterNow = this.currentSchoolYear.semester;
              element.semesterSelected = this.searchModel.semester;
              element.isTouch = this.isTouch;
              element.listScoreFormat = this.formatListScoreData(element.listScore);
              element.table = this.generateRanks(element.listScoreFormat);
            });
            console.log('ranks', res.content);
            this.generateColumn(res.content, 'rank');
            res.content.map(item => {
              if (this.isCheckedRankScore(item)) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            });
            this.rowData = res.content;
            this.autoCheckBoxHeader('rank');

            this.gridApi.setHeaderHeight(this.HEADER_HEIGHT_RANK);
          }
          this.total = res.totalElements;

          this.totalPage = Math.ceil(this.total / PAGE_SIZE);
          this.rangeWithDots = pagination(this.currentPage, this.totalPage);
          this.first = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).first;
          this.last = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).last;

          // Set count row data
          this.gridApi.rowCount = this.rowData.length;

          setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
            this.resizeTwoLastColumns()
          }, 500);
          this.changeDetectorRef.detectChanges();
        } else {
          this.columnDefs = [];
          this.rowData = [];
          this.total = 0;
          setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
            this.resizeTwoLastColumns()
          }, 500);
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res);
        this.isShowLoading = false;
      }
    });
  }

  formatListScoreData(listScore) {
    const grouped = Object.entries(
      listScore.reduce((acc, {times, scoreName, value, selectedValue, scoreCode}) => {
        if (!acc[scoreName]) {
          acc[scoreName] = [];
        }
        acc[scoreName].push({times, value, selectedValue, scoreCode});
        return acc;
      }, {})
    ).map(([label, options]) => ({label, options}));
    return grouped;
  }

  generateScores(data) {
    if (data && data.length > 0) {
      const result = data.map((element) => {
        return {
          headerName: element.label,
          scoreCode: element.scoreCode,
          children: element.options.map((e) => {
            return {
              headerName: e.times,
              score: e.value,
            };
          })
        };
      });
      return result;
    }
  }

  generateRanks(data) {
    if (data && data.length > 0) {
      const result = data.map((element) => {
        return {
          headerName: element.label,
          ranks: element.options[0].selectedValue || [],
          rankDescription: element.options[0].value
        };
      });
      return result;
    }
  }

  generateColumn(data, type: string) {
    this.columnDefs = [];
    let array2: any[] = [];
    let array3: any[] = [];

    let stt: any = {
      headerName: this.sttTranslate,
      headerTooltip: this.sttTranslate,
      lockPosition: true,
      initialPinned: 'left',
      valueGetter: param => {
        return param.node.rowIndex + (((this.currentPage - 1) * PAGE_SIZE) + 1);
      },
      minWidth: 60,
      maxWidth: 60,
      cellStyle: {...TABLE_CELL_STYLE, color: '#101840', 'margin-left': '5px'}
    };
    let codeStudent: any = {
      headerName: this.studentCode,
      headerTooltip: this.studentCode,
      lockPosition: true,
      cellRendererFramework: TooltipComponent,
      field: 'studentCode',
      cellClass: 'lock-pinned show-limit-name',
      initialPinned: 'left',
      cellStyle: {
        ...TABLE_CELL_STYLE,
        color: '#3366FF'
      },
      minWidth: 150,
    };
    let nameStudent: any = {
      headerName: this.studentName,
      headerTooltip: this.studentName,
      lockPosition: true,
      field: 'studentName',
      initialPinned: 'left',
      cellRendererFramework: ActionEvaluateComponent,
      cellClass: 'lock-pinned',
      cellStyle: {
        display: 'flex',
        displayce: 'nowrap',
        padding: '10px',
        height: '100%',
      },
      minWidth: 200,
    };

    if (type === 'score') {
      stt = {...stt, headerClass: 'custom-merge-header-stt'};
      codeStudent = {...codeStudent, headerClass: 'custom-merge-header-stt'};
      nameStudent = {...nameStudent, headerClass: 'custom-merge-header-stt'};
    }

    if (type === 'score') {
      let i = 0;
      if (data[0] && data[0].table) {
        array2 = data[0]?.table.map((element, index) => {

          let checkHasOneChild = false;
          data[0]?.confScoreDetailsList.forEach(item => {
            if (item.code === element.scoreCode && item.quantity === 1) {
              checkHasOneChild = true;
            }
          });

          return checkHasOneChild ?
            {
              headerName: element.headerName,
              headerTooltip: element.headerName,
              lockPosition: true,
              suppressMovable: true,
              headerClass: `custom-merge-header-score-group`,
              children: element.children.map(e => {
                i++;
                return {
                  headerName: this.scoreIndex + e.headerName,
                  headerTooltip: this.scoreIndex + e.headerName,
                  suppressMovable: true,
                  tooltipField: 'score' + i,
                  field: 'score' + i,
                  cellClass: 'justify-center',
                  headerClass: 'hide-child-header',
                  cellRendererFramework: InputScoreComponent,
                  cellStyle: {...TABLE_CELL_STYLE, color: '#101840', 'justify-content': 'center'},
                  minWidth: 100,
                };
              }),
              minWidth: 200,
            }
            :
            {
              headerName: element.headerName,
              headerTooltip: element.headerName,
              lockPosition: true,
              suppressMovable: true,
              headerClass: `score-background-${index}`,
              children: element.children.map(e => {
                i++;
                return {
                  headerName: this.scoreIndex + e.headerName,
                  headerTooltip: this.scoreIndex + e.headerName,
                  suppressMovable: true,
                  tooltipField: 'score' + i,
                  headerClass: `header-diem header-child-${index}`,
                  field: 'score' + i,
                  cellClass: 'justify-center',
                  cellRendererFramework: InputScoreComponent,
                  cellStyle: {...TABLE_CELL_STYLE, color: '#101840', 'justify-content': 'center'},
                  minWidth: 100,
                };
              }),
            };
        });
      }
      const avg =
        {
          headerTooltip: this.avgScoreTranslate,
          lockPosition: true,
          suppressMovable: true,
          tooltipField: 'avgScore',
          pinned: 'right',
          headerComponentParams :{
            template:`<span style="font-size:10px; color:#8f95b2;text-align: center;white-space: break-spaces;text-transform: uppercase;">${this.avgScoreTranslate}</span>`,
          },
          cellClass: 'justify-center',
          cellRendererFramework: AvgScoreComponent,
          field: 'avgScore',
          headerClass: 'custom-merge-header-avg-score',
          minWidth: 100,
          maxWidth: 100,
          cellStyle: {
            ...TABLE_CELL_STYLE,
            color: '#3366FF',
            'justify-content': 'center',
          }
        };
      const checkBox =
        {
          lockPosition: true,
          suppressMovable: true,
          pinned: 'right',
          headerClass: 'custom-merge-header-checkbox-gradebook',
          headerComponentFramework: HeaderCheckboxComponent,
          cellRendererFramework: CheckboxColumnComponent,
          maxWidth: 50,
          minWidth: 50,
          cellStyle: {
            ...TABLE_CELL_STYLE,
            'justify-content': 'center',
            color: '#101840',
            'padding-left': '16px',
            'padding-bottom': '18px'
          },
        };

      this.columnDefs.push(stt);
      this.gridApi.setColumnDefs(this.columnDefs);
      this.columnDefs.push(codeStudent);
      this.columnDefs.push(nameStudent);
      this.columnDefs = [...this.columnDefs, ...array2];
      this.gridApi.setColumnDefs(this.columnDefs);
      this.columnDefs.push(avg);
      this.gridApi.setColumnDefs(this.columnDefs);
      this.columnDefs.push(checkBox);
      this.gridApi.setColumnDefs(this.columnDefs);
      this.gridApi.sizeColumnsToFit();

    } else {
      if (data[0] && data[0].table) {

        array2 = data[0]?.table.map((element, i) => {
          return {
            headerTooltip: element.headerName,
            lockPosition: true,
            suppressMovable: true,
            field:  'ranks' + i,
            headerComponentParams :{
              template:'<span style="font-size:10px; ' +
                'color:#8f95b2;' +
                'white-space: break-spaces;' +
                'text-transform: uppercase">' +
                element.headerName +
                '</span>',
            },
            headerClass: 'margin-left-cell-header',
            cellRendererFramework: InputRankComponent,
            cellStyle: {
              'font-weight': '500',
              'font-size': '12px',
              'font-family': 'Inter',
              'font-style': 'normal',
              'align-items': 'center',
              display: 'flex',
              color: '#101840'
            },
            minWidth: 215,
          };
        });
      }
      array3 = [{
        lockPosition: true,
        suppressMovable: true,
        pinned: 'right',
        headerClass: 'custom-merge-header-rank-checkbox',
        headerComponentFramework: HeaderCheckboxComponent,
        cellRendererFramework: CheckboxColumnComponent,
        minWidth: 50,
        maxWidth: 50,
        cellClass: 'checkbox-rank-column',
        cellStyle: {
          ...TABLE_CELL_STYLE,
          left: '5px',
          color: '#101840',
          'padding-bottom': '18px',
        }
      },];
      this.columnDefs.push(stt);
      this.gridApi.setColumnDefs(this.columnDefs);
      this.columnDefs.push(codeStudent);
      this.columnDefs.push(nameStudent);
      this.columnDefs = [...this.columnDefs, ...array2, ...array3];
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  // Set date lock
  setDateLock(row) {
    row.listScore.forEach(score => {
      this.lockTimes.forEach(lock => {
        if (lock.scoreCode === score.scoreCode) {
          score.dateLock = lock.entryLockDate;
          score.statusLock = lock.status;
        }
      });
    });
  }

  // Search old data from page data
  searchDataFromPageData(page, type) {
    this.currentPage = page;

    this.rowData = this.pageData[page - 1];
    this.first = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).first;
    this.last = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).last;

    this.autoCheckBoxHeader(type);
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
      this.resizeTwoLastColumns()
    }, 500);
    this.changeDetectorRef.detectChanges();
  }

  // =================================================END TABLE============================================//

  onGridReady(params) {
    // const agBodyHorizontalViewport: HTMLElement = document.querySelector('.gradebook-table .ag-body-horizontal-scroll-viewport');
    // if (agBodyHorizontalViewport) {
    //   const ps = new PerfectScrollbar(agBodyHorizontalViewport);
    //   ps.update();
    // }
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      params.api.sizeColumnsToFit();
      this.resizeTwoLastColumns()
    }, 500);
  }

  gridSizeChanged(params): void {
    setTimeout( () => {
      params.api.sizeColumnsToFit()
      this.resizeTwoLastColumns()
    }, 500)
  }

  // =================================================paging ===============================================
  page(page: number): void {

    // Delete value rxjs when change page
    this.studentService.changeScoreGradeBookValue(null);
    this.studentService.changeValueScoreRank(null);

    if (this.update) {
      this.pageData[this.currentPage - 1] = this.rowData;
      if (this.pageData[page - 1] === undefined || this.pageData[page - 1] === null) {
        this.doSearch(page);
      } else {
        if (this.typeSubject === 0) {
          this.searchDataFromPageData(page, 'score');
        } else {
          this.searchDataFromPageData(page, 'rank');
        }
      }
    } else {
      this.doSearch(page);
    }
  }

  prev(): void {
    if (this.currentPage === 1) {
      this.page(1);
    } else {
      this.page(this.currentPage - 1);
    }
  }

  next(): void {
    if (this.currentPage === this.totalPage) {
      this.page(this.currentPage);
    } else {
      this.page(this.currentPage + 1);
    }
  }

  // ==================================== Export =============================================
  exportData() {
    let dataExport = {};
    if (this.searchModel.semester === this.fullYearSemester) {
      dataExport = {...this.searchModel, semester: '0'};
    } else {
      dataExport = {...this.searchModel};
    }
    removeEmptyQuery(dataExport);
    console.log('data transfer:', dataExport);

    this.studentService.exportGradebooks(dataExport).subscribe(
      (responseMessage) => {
        const file = new Blob([responseMessage], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const fileURL = URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = `${this.translate.instant('GRADEBOOK.EXPORT_FILE_NAME')}_${moment().format('DDMMYYYY').toString()}`;
        anchor.href = fileURL;
        anchor.click();
    });
  }

  // =================================================SAVE TABLE============================================//
  showUpdate() {
    this.isShowButton = !this.isShowButton;
    this.pageData = [];
    this.update = true;
    this.studentService.changeIsShowUpdateGradeBook(true);
  }

  hideButton() {
    this.update = false;
    this.isShowButton = !this.isShowButton;
    this.studentService.changeIsShowUpdateGradeBook(false);
    this.studentService.changeScoreGradeBookValue(null);
    this.studentService.changeValueScoreRank(null);
    this.doSearch(1);
  }

  save() {
    let rowData = [];
    this.pageData[this.currentPage - 1] = this.rowData;
    this.pageData.forEach(element => {
      rowData = [...rowData, ...element];
    });
    console.log('roww',rowData);
    const body = this.searchModel.semester === this.fullYearSemester ?
      {
        classCode: this.searchModel.classCode,
        schoolYear: this.searchModel.schoolYear,
        semester: '0',
        subjectCode: this.searchModel.subjectCode,
        subjectsDetails: rowData,
      }
      :
      {
        ...this.searchModel,
        subjectsDetails: rowData
      };
    console.log(body);

    this.studentService.save(body).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) {
          this.toaStr.success(res.message);
          this.isShowButton = !this.isShowButton;
          this.update = false;
          this.studentService.changeIsShowUpdateGradeBook(false);
          this.doSearch(1);
        }
      },
      error: res => {
        console.log(res);
      }
    });
  }

  saveBeforeEvaluate() {
    this.isShowLoading = true;
    this.changeDetectorRef.detectChanges()
    const body = this.searchModel.semester === this.fullYearSemester ?
      {
        classCode: this.searchModel.classCode,
        schoolYear: this.searchModel.schoolYear,
        semester: 0,
        subjectCode: this.searchModel.subjectCode,
        subjectsDetails: this.rowData,
      }
      :
      {
        ...this.searchModel,
        subjectsDetails: this.rowData
      };
    console.log(body);

    this.studentService.save(body).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) {
          this.toaStr.success(this.translate.instant('GRADEBOOK.MSG_EVALUATE_ADD_SUCCESS'));
          this.doSearch(1);
        }
      },
      error: res => {
        console.log(res);
      }
    });
  }

  // -=====================================Auto fill data anh check box=========================================

  checkBoxAllChange() {
    this.studentService.checkBoxHeader$.subscribe(type => {
      this.autoCheckBoxHeader(type);
    });
  }

  autoCheckBoxHeader(type: string) {
    let isTrueAll = true;
    if (type === 'score') {
      this.rowData.forEach(item => {
        if (item.avgScore === null) {
          isTrueAll = false;
        }
      });
    } else if (type === 'rank') {
      this.rowData.forEach(item => {
        if (!this.isCheckedRankScore(item)) {
          isTrueAll = false;
        }
      });
    }
    if (isTrueAll) {
      this.studentService.changeIsSelectedALl(true);
    } else {
      this.studentService.changeIsSelectedALl(false);
    }
  }

  isCheckedRankScore(item) {
    let checked = true;
    if(item.listScore.length === 0) return false;
    item.listScore.forEach(e => {
      if (e.value === '') {
        checked = false;
      }
    });
    return checked;
  }

  sum(items, key) {
    const arr = items.filter(ele => ele.score !== null);
    return arr.reduce((a, b) => {
      return a + b[key];
    }, 0);
  };

  // Check calc avgScore
  checkCalcAvgScore(element) {
    let calcSum = true;
    element.confScoreDetailsList.forEach(item => {
      let i = 0;
      element.listScore.forEach(e => {
        if (item.code === e.scoreCode && e.value !== null && e.value !== '') {
          i++;
        }
      });
      if (i < item.minimumScore) calcSum = false;
    });
    return calcSum;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  mapSemester(value) {
    if (!value) {
      return;
    }
    switch (value) {
      case '0' :
        return this.fullYearSemester
      case '1':
        return this.translate.instant('GRADEBOOK.SEMESTER1');
      case '2':
        return this.translate.instant('GRADEBOOK.SEMESTER2');
      case '3':
        return this.translate.instant('GRADEBOOK.SEMESTER3');
      case '4':
        return this.translate.instant('GRADEBOOK.SEMESTER4');
      case '5':
        return this.translate.instant('GRADEBOOK.SEMESTER5');
      default:
        return value;
    }
  }

  showConfirmDialog() {
    const dataConfirm = {title: this.titleConfirmTranslate, message: this.msgConfirmTranslate};
    this.matDialog.open(ConfirmDialogComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        // Delete value rxjs when change page
        this.studentService.changeScoreGradeBookValue(null);
        this.studentService.changeValueScoreRank(null);
        this.isShowLoading = true;
        this.save();
        this.changeDetectorRef.detectChanges()
      }
    });
  }

  // Checked By row and column
  changeInputByColumn(event) {
    this.gridApi.checkedColumn = this.checkedColumn;
    this.gridApi.redrawRows();
  }

  //  ====================================== Focus ======================================
  navigateFocus(event) {
    if (event.keyCode === 9) {
      document.getElementById('ag-grid-gradebook').blur();
    }
  }

  public checkDataGrid(): boolean {
    if (this.rowData?.length > 0) {
      return true;
    }
    return false;
  }

  gridColumnsChanged(param) {
    setTimeout( () => {
      this.resizeTwoLastColumns()
      param.api.sizeColumnsToFit()
    }, 500)
  }

  resizeTwoLastColumns(): void {
    const header = (document.querySelector('.ag-pinned-right-header') as HTMLElement)
    const body = (document.querySelector('.ag-pinned-right-cols-container') as HTMLElement)
    body.style.minWidth = `${header.offsetWidth}px`
  }

  translatePage() {
    this.fullYearSemester = this.translate.instant('GRADEBOOK.FULL_YEAR');
    this.studentCode = this.translate.instant('TRANSFER_STUDENTS.STUDENT_CODE');
    this.studentName = this.translate.instant('TRANSFER_STUDENTS.STUDENT_NAME');
    this.scoreIndex = this.translate.instant('GRADEBOOK.SCORE_INDEX');
    this.avgScoreTranslate = this.translate.instant('GRADEBOOK.AVG_SCORE');
    this.titleConfirmTranslate = this.translate.instant('GRADEBOOK.TITLE_CONFORM');
    this.msgConfirmTranslate = this.translate.instant('GRADEBOOK.MSG_CONFIRM');
    this.sttTranslate = this.translate.instant('STUDENT.INFO.NO');
  }
}
