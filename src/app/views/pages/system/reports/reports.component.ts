import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {DepartmentService} from '../../../../core/service/service-model/unit.service';
import {Department} from '../../../../core/service/model/department.model';
import {SchoolService} from '../../../../core/service/service-model/school.service';
import {HttpClient} from '@angular/common/http';
import {SchoolServices} from '../school/school.service';
import {takeUntil} from 'rxjs/operators';
import {GradeLevelService} from '../../../../core/service/service-model/grade-level.service';
import {Subject, Subscription} from 'rxjs';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {AcademicAbilitiesService} from '../academic-abilities/academic-abilities.service';
import {ReportsService} from '../../../../core/service/service-model/reports.service';
import {NO_ROW_GRID_TEMPLATE} from '../../../../helpers/constants';
import {TranslateService} from '@ngx-translate/core';
import {EvaluateConductService} from '../../../../core/service/service-model/evaluate-conduct.service';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';

@Component({
  selector: 'kt-teachers',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  noRowsTemplate;
  overlayLoadingTemplate;
  lsName;
  lsReport;
  langKey;
  obj: any;
  constructor(private modalService: BsModalService, private schoolService: SchoolService, public http: HttpClient,
              private deparmentService: DepartmentService,
              private classroomService: ClassroomService,
              private gradeLevelService: GradeLevelService,
              private changeDetectorRef: ChangeDetectorRef,
              private classRoomService: ClassroomService,
              private departmentService: DepartmentService,
              private reportsService: ReportsService,
              private translate: TranslateService,
              private attendanceStudentService: AcademicAbilitiesService,
              private academicAbilitiesService: AcademicAbilitiesService,
              private evaluateConductService: EvaluateConductService,
              private toatr: ToastrService, private schoolSv: SchoolServices) {
    this.overlayLoadingTemplate = `<span>${this.translate.instant('GRID.LOADING')}</span>`
    this.department = new Department();
    this.typeImportInsert = 0;
    const type = {
      type: 'COMPETITION'
    };
    this.langKey = (localStorage.getItem('language'));
    console.log(this.langKey);
    this.evaluateConductService.getCompetition(type).subscribe(res => {
      this.lsName = {
        // headerName: 'SỐ LƯỢNG HỌC SINH ĐẠT DANH HIỆU',
        headerName: this.translate.instant('REPORT_SCHOOL.GRID.NUMBER_STUDENT_ACHIEVEMENTS'),
        headerTooltip: this.translate.instant('REPORT_SCHOOL.GRID.NUMBER_STUDENT_ACHIEVEMENTS'),
        minWidth: 480,
        suppressMovable: true,
        lockPosition: true,
        headerClass: 'custom-merge-header3',
        cellStyle: {
          'font-weight': '600',
          'font-size': '10px',
          'align-items': 'center',
          'line-height': '16',
          color: '#0000008A',
          display: 'flex',
          'white-space': 'nowrap',
          'justify-content': 'center',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        children: [],
      }
      console.log(res);
      // header translate
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < res?.length; i++) {
        if(this.langKey === 'vn')
          res[i].name.toUpperCase();
        else if(this.langKey === 'la')
          res[i].nameLA.toUpperCase();
        else
          res[i].nameEN.toUpperCase();
        this.lsReport = res;
        // @ts-ignore
        let obj: {};
        if(this.langKey === 'vn'){
            this.obj = {
            headerName: `${res[i].name.toUpperCase()}`,
            field: `${res[i].value}`,
            headerTooltip: `${res[i].name.toUpperCase()}`,
            headerStyle: {
              'font-size': '10px',
            },
            minWidth: 120,
            tooltipField: `${res[i].value}`,
            lockPosition: true,
            suppressMovable: true,
            headerClass: 'header-color-report',
            cellStyle: params => {
              if (params.data.teachrName) {
                return this.cellStyle;
              } else {
                return this.cellStyle1;
              }
            }
          }
        }else if(this.langKey === 'la'){
          this.obj = {
            headerName: `${res[i].nameLA.toUpperCase()}`,
            field: `${res[i].value}`,
            headerTooltip: `${res[i].nameLA.toUpperCase()}`,
            headerStyle: {
              'font-size': '10px',
            },
            minWidth: 120,
            tooltipField: `${res[i].value}`,
            lockPosition: true,
            suppressMovable: true,
            headerClass: 'header-color-report',
            cellStyle: params => {
              if (params.data.teachrName) {
                return this.cellStyle;
              } else {
                return this.cellStyle1;
              }
            }
          }
        }else{
          this.obj = {
            headerName: `${res[i].nameEN.toUpperCase()}`,
            field: `${res[i].value}`,
            headerTooltip: `${res[i].nameEN.toUpperCase()}`,
            headerStyle: {
              'font-size': '10px',
            },
            minWidth: 120,
            tooltipField: `${res[i].value}`,
            lockPosition: true,
            suppressMovable: true,
            headerClass: 'header-color-report',
            cellStyle: params => {
              if (params.data.teachrName) {
                return this.cellStyle;
              } else {
                return this.cellStyle1;
              }
            }
          }
        }
        this.lsName.children.push(this.obj);
      }
    });
    this.autoGroupColumnDefTree = {
      field: 'name',
      // headerName: 'LỚP',
      headerName: this.translate.instant('REPORT_SCHOOL.GRID.CLASS'),
      height: 30,
      tooltipField: 'name',
      headerClass: 'custom-merge-header2',
      tooltip: (value: string): string => value,
    }
    this.themeName = 'red-theme';
    this.noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
    this.autoGroupColumnDef = {
      field: 'className',
      // headerName: 'LỚP',
      headerName: this.translate.instant('REPORT_SCHOOL.GRID.CLASS'),
      headerTooltip: this.translate.instant('REPORT_SCHOOL.GRID.CLASS'),
      headerClass: 'custom-merge-header4',
      tooltipField: 'className',
      tooltip: (value: string): string => value,
      minWidth: 220,
      cellStyle: {
        'font-weight': '700',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'margin-right': '15px'
      }

    };
    this.rowModelType = 'serverSide';
    this.serverSideStoreType = 'partial';
    // tslint:disable-next-line:only-arrow-functions
    this.isServerSideGroupOpenByDefault = function (params) {
      return params.rowNode.level < 90;
    };
    // tslint:disable-next-line:only-arrow-functions
    this.isServerSideGroupOpenByDefaultTree = function (params) {
      return params.rowNode.level < 99;
    };
    // tslint:disable-next-line:only-arrow-functions
    this.isServerSideGroup = function (dataItem) {
      return dataItem.group;
    };
    // tslint:disable-next-line:only-arrow-functions
    this.getServerSideGroupKey = function (dataItem) {
      return dataItem.className;
    };

    this.defaultColDef = {sortable: false, resizable: false, lockPosition: true, suppressMovable: true};


  }

  value?: string;
  nodes = [];

  @ViewChild('importUnit') public importUnit: ModalDirective;
  @ViewChild('file') file: ElementRef;

  modalRef: BsModalRef;
  progress;

  gridApi;
  columnDefs;
  defaultColDef;
  autoGroupColumnDef;
  rowModelType;
  serverSideStoreType;
  isServerSideGroupOpenByDefault;
  isServerSideGroupOpenByDefaultTree;
  isServerSideGroup;
  getServerSideGroupKey;
  rowData;

  groupDefaultExpanded;
  getDataPath
  typeUnit;
  typeImportInsert;
  typeImportUpdate;
  selectedFiles;

  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  selectDemo;
  codeSearch;

  fileName;
  fileSize;
  resultImport;
  department: Department = new Department();
  afuConfig;
  spaceWhite;
  specicalChar;
  autoGroupColumnDefTree;
  listUnitParent = [];
  listTeacher = [];
  tooltipShowDelay = 0;
  rowSelection = 'single';
  themeName: string;
  a = false;
  blCode: boolean;
  blName: boolean;
  blType: boolean;
  formDatas;

  cellStyle = {
    'font-weight': '500',
    'font-size': '12px',
    'align-items': 'center',
    color: '#101840',
    display: 'flex',
    'white-space': 'nowrap',
    'justify-content': 'center',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
  };

  cellStyle1 = {
    'font-weight': '700',
    'font-size': '12px',
    'align-items': 'center',
    color: '#101840',
    display: 'flex',
    'white-space': 'nowrap',
    'justify-content': 'center',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
  };

  // xu ly khoa/ban
  deptId: any;
  deptList: any = [];


  // xu ly chon học kỳ
  dataSemester;
  schoolYear;
  semester;
  semesterName = 'a';
  classRoom;

  // xu ly khoi
  listGradeLevel = [];
  selectedGradeLevel = null;
  unsubscribe$ = new Subject<void>();
  selectedClassId = null;
  listClass = [];
  subscription: Subscription;
  searchObj = {
    deptIdParent: null,
    deptId: null,
    position: null,
    nameCodeSearch: '',
    status: null,
    role: ''
  }
  isShowImport = false;
  cacheBlockSize = 10;

  getGrid() {
    this.createHeaderStart()
    this.createHeaderCenter()
    this.createHeaderEnd()
  }

  createHeaderCenter() {
    this.columnDefs.push(this.lsName);
  }

  createHeaderStart() {
    this.columnDefs = [
      {
        // headerName: 'LỚP',
        headerName: this.translate.instant('REPORT_SCHOOL.GRID.CLASS'),
        field: 'className',
        hide: true,
        headerTooltip: this.translate.instant('REPORT_SCHOOL.GRID.CLASS'),
        suppressMovable: true,
        minWidth: 220,
        cellStyle: {
          'font-weight': '700',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex'
        }
      },
      {
        // headerName: 'GIÁO VIÊN CHỦ NHIỆM',
        headerName: this.translate.instant('REPORT_SCHOOL.GRID.TEACHER_LEAD'),
        field: 'teachrName',
        suppressMovable: true,
        lockPosition: true,
        minWidth: 160,
        headerTooltip: this.translate.instant('REPORT_SCHOOL.GRID.TEACHER_LEAD'),
        tooltipField: 'teachrName',
        headerClass: 'custom-merge-header5',
        tooltip: (value: string): string => value,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',

        }
      },
      {
        headerName: this.translate.instant('REPORT_SCHOOL.GRID.TOTAL'),
        field: 'total',
        headerTooltip: this.translate.instant('REPORT_SCHOOL.GRID.TOTAL'),
        tooltipField: 'total',
        minWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        headerClass: 'custom-merge-header2',
        tooltip: (value: string): string => value,
        cellStyle: params => {
          if (params.data.teachrName) {
            return this.cellStyle;
          } else {
            return this.cellStyle1;
          }
        }
      },
    ];
  }

  createHeaderEnd() {
    const ct = {
      headerName: '',
      field: 'make',
      cellRenderer: param => {
        if (param.data.group === false) {
          const url = this.makeid(10) + window.btoa(unescape(encodeURIComponent(
            this.schoolYear + '/' + this.semester + '/' + param.data.code + '/' + this.selectedGradeLevel + '/' + this.semesterName)));
          // return `<a style='color: #3366FF'href='/laosedu/#/system/reports/class-report/${url}' >Xem chi tiết</a>`
          return `<a style='color: #3366FF'href='/laosedu/#/system/reports/class-report/${url}' >${this.translate.instant('REPORT_SCHOOL.GRID.DETAIL')}</a>`
        }
      },
      minWidth: 150,
      headerClass: 'custom-merge-header1',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#3366FF',
        display: 'flex',
        'justify-content': 'center',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
    }
    this.columnDefs.push(ct);
  }


  getAllDept() {
    const dept: any = {};
    dept.name = '';
    this.classroomService.autoSearchDept(dept).subscribe(res => {
      let list = [];
      res.forEach(item => {
        let customItem = {};
        customItem = {...item, deptIdName: item.code + ' - ' + item.name};
        list = [...list, customItem];
      });
      this.deptList = list;
    });
  }

  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  loadGradeLevelInit(): void {
    this.listGradeLevel = null;
    this.gradeLevelService
      .getGradeLevelOfSubject()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.listGradeLevel = res;
          this.selectedGradeLevel = res[0].id;
          this.changeDetectorRef.detectChanges();
          this.searchData();
        },
      });
  }

  onChangeGradeLevel(gradeLevelId) {
    this.selectedGradeLevel = gradeLevelId;
    this.searchData();
  }

  selectSemester(event) {
    this.semester = event.value;
    this.semesterName = event.value === 0 ? this.translate.instant('REPORT_SCHOOL.YEAR') : event.name;
    this.searchData();
  }

  onChangeDepId(event) {
    this.deptId = event;
    this.searchData();
  }

  getSemester() {
    const obj: any = {};
    this.semester = null;
    obj.years = this.schoolYear;
    this.academicAbilitiesService.getSemesterByYear(this.schoolYear).subscribe(res => {
      if (res.length > 0) {
        this.dataSemester = res;
        res.forEach(item => {
          if (item.defaultValue) {
            this.semester = item.value;
            this.semesterName =  item.name;
          }
        })
        if (this.semester == null) {
          this.semester = res[0].value;
          this.semesterName = res[0].name;
        }
        this.loadGradeLevelInit();
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  loadCurrentYear(): void {
    this.subscription = this.classRoomService.yearCurrent$.subscribe(
      (schoolYear) => {
        this.schoolYear = schoolYear;
        if (schoolYear !== '') {
          this.getSemester();
        }
      }
    );
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    this.removeStyle();
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    document.querySelector('#selectedRows').innerHTML =
      selectedRows.length === 1 ? selectedRows[0].athlete : '';
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.showNoRowsOverlay();
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 50);
  }

  ngOnInit(): void {
    this.schoolSv.loading.subscribe(loading => {
    });
    this.schoolSv.sideBar.subscribe(a => {
      this.a = a;// dong mo sidebar
    });
    this.loadCurrentYear();
    this.getAllDept();
    setTimeout(() => {
      this.value = '1001';
    }, 1000);

    setTimeout(this.removeStyle,3000);
  }

  onChange($event: string): void {
  }

  arrValue(arr: any) {
    return Array?.from(arr?.reduce((acc, {value, ...r}) => {
      const key = JSON.stringify(r);
      const current = acc.get(key) || {...r, value: 0};
      return acc.set(key, {...current, value: Number(current.value) + Number(value)});
      // tslint:disable-next-line:new-parens
    }, new Map).values());
  }

  searchData() {
    this.rowData = [];
    const objSearch: any = {
      year: this.schoolYear,
      depId: this.deptId,
      semester: this.semester,
      code: this.selectedClassId,
      gradeLevel: this.selectedGradeLevel,
    };
    if (!objSearch.year || !objSearch.semester || !objSearch.gradeLevel) {
      this.toatr.warning(this.translate.instant('REPORT_SCHOOL.MSG.INFOR_ABSURD'));
    } else {
      this.reportsService.reportSchool(objSearch).subscribe(res => {
        this.rowData = res;
        this.rowData?.forEach(item => {
          if(item?.reportSchoolObjDTOList !== null) {
            const value = this.arrValue(item?.reportSchoolObjDTOList);
            item.reportSchoolObjDTOList = value;
          }
          item?.reportSchoolObjDTOList?.forEach((e, i) => {
            const conduct = e.key;
            item[conduct] = e.value;
          });
          item?.children?.forEach(item1 => {
            item1?.reportSchoolObjDTOList?.forEach((e, i) => {
              const conduct = e.key;
              item1[conduct] = e.value;
            });
          })
        })

        if (this.rowData.length === 0) {
          const fakeServer = createFakeServer(this.rowData);
          const datasource = createServerSideDatasource(fakeServer);
          this.gridApi.setServerSideDatasource(datasource);
          this.gridApi.showNoRowsOverlay();
        } else {
          this.getGrid();
          const fakeServer = createFakeServer(this.rowData);
          const datasource = createServerSideDatasource(fakeServer);
          this.gridApi.setServerSideDatasource(datasource);
          this.changeDetectorRef.detectChanges();
          this.gridApi.sizeColumnsToFit();
        }
      });
    }
  }

  removeStyle() {
    var removeStyle:any = document.querySelector('.ag-center-cols-container');
    var currentValue =  removeStyle.style.getPropertyValue('width');
    var newCurrentValueFloat = currentValue.slice(0,-2);
    var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    var newValue = newCurrentValueInt + 16;
    removeStyle.style.width=`${newValue}px`;

  }

  exportTemplate() {
    this.deparmentService.exportTemplate();
  }

  exportData() {
    const objExport = {
      year: this.schoolYear,
      semester: this.semester,
      data: this.rowData,
      langKey: this.langKey
    }
    this.reportsService.exportData(objExport, this.schoolYear);
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  exportDataErrors() {
    if (this.resultImport === undefined) {
      this.toatr.error('Chưa có file data lỗi, cần import trước')
      return;
    }
    if (this.resultImport.listErrors.length > 0) {
      this.deparmentService.exportDataErrors(this.resultImport.listErrors);
    } else {
      this.toatr.warning('Không có data lỗi!')
    }
  }

}



function createFakeServer(fakeServerData) {
  function FakeServer(allData) {
    this.data = allData;
  }

  FakeServer.prototype.getData = function (request) {
    function extractRowsFromData(groupKeys, data) {
      if (groupKeys.length === 0) {
        // tslint:disable-next-line:only-arrow-functions
        return data.map(function (d) {
          const obj = {
            group: !!d.children,
            className: d.className,
            teachrName: d.teachrName,
            total: d.total,
            id: d.id,
            code: d.code,
          };
          d?.reportSchoolObjDTOList?.forEach((e, i) => {
            Object.assign(obj, {[e.key]: e.value});
          });
          return obj;
        });
      }
      const key = groupKeys[0];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < data.length; i++) {
        if (data[i].className === key) {
          return extractRowsFromData(
            groupKeys.slice(1),
            data[i].children.slice()
          );
        }
      }
    }

    return extractRowsFromData(request.groupKeys, this.data);
  };
  return new FakeServer(fakeServerData);
}


function createServerSideDatasource(fakeServer) {
  // tslint:disable-next-line:no-shadowed-variable
  function ServerSideDatasource(fakeServer) {
    this.fakeServer = fakeServer;
  }

  ServerSideDatasource.prototype.getRows = function (params) {
    const allRows = this.fakeServer.getData(params.request);
    const request = params.request;
    const doingInfinite = request.startRow != null && request.endRow != null;
    const result = doingInfinite
      ? {

        rowData: allRows.slice(request.startRow, request.endRow),
        rowCount: allRows.length,
      }
      : {rowData: allRows};
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      params.success(result);
    }, 200);
  };
  return new ServerSideDatasource(fakeServer);

}
