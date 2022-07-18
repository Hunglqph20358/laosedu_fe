import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ForeignLanguage, JobTransferHistoryOut, SpecializeLevel, Teacher} from '../../../../../core/service/model/teacher.model'
import { TeacherService } from 'src/app/core/service/service-model/teacher.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import {environment} from './../../../../../../environments/environment';
import {ApParamService} from '../../../../../core/service/service-model/ap-param.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {ViewFileComponent} from './view-file/view-file.component';
import {NO_ROW_GRID_TEMPLATE, STUDENTS, TABLE_CELL_STYLE, TEACHER} from '../../../../../helpers/constants';
import {DepartmentService} from '../../../../../core/service/service-model/unit.service';
import {SchoolServices} from '../../school/school.service';
import {TooltipTeacherComponent} from './tooltip-teacher/tooltip-teacher.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {

  constructor(private teacherService: TeacherService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              private dom: DomSanitizer,
              private matDialog: MatDialog,
              private departmentService: DepartmentService,
              private schoolServices: SchoolServices,
              private changeDetectorRef: ChangeDetectorRef,
              private translate: TranslateService) {
    // Tab quá trình công tác
    this.columnDefsJobTransfer = [
      {
        headerName: this.tran('TEACHER.GRID.NO'),
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        lockPosition: true,
        suppressMovable: true,
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: this.tran('TEACHER.JOB_TRANSFER.TIME'),
        field: 'timeDisplay',
        height: 56,
        // resizable: true,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        },
        tooltipField: 'timeDisplay',
        // minWidth: 250,
        // maxWidth: 300,
      },
      {
        headerName: this.tran('TEACHER.JOB_TRANSFER.DEPT'),
        field: 'dvct',
        height: 56,
        // minWidth: 350,
        // maxWidth: 400,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'dvct',
        // cellRendererFramework: TooltipTeacherComponent,
      },
      {
        headerName: this.tran('TEACHER.JOB_TRANSFER.DEPARTMENT'),
        field: 'departmentDisplay',
        height: 56,
        // minWidth: 300,
        // maxWidth: 350,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'departmentDisplay',
      },
      {
        headerName: this.tran('TEACHER.JOB_TRANSFER.POSITION'),
        field: 'position',
        height: 56,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        // minWidth: 350,
        // maxWidth: 400,
        tooltipField: 'position',
      },
    ];

    // table khen thưởng
    this.columnDefsRewardBonus = [
      {
        headerName: this.tran('TEACHER.GRID.NO'),
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        height: 56,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'block',
        }
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.TIME_REWARD'),
        cellRenderer: param => {
          return `${moment(param.data.rdDate).format('DD/MM/YYYY')}`
        },
        tooltipValueGetter: param => {
          return `${moment(param.data.rdDate).format('DD/MM/YYYY')}`
        },
        minWidth: 150,
        maxWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'block',
        }
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.YEAR'),
        field: 'rdYear',
        height: 56,
        minWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        maxWidth: 150,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'block',
        },
        tooltipField: 'rdYear',
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.TYPE_REWARD'),
        field: 'rdType',
        height: 56,
        // minWidth: 300,
        lockPosition: true,
        suppressMovable: true,
        // maxWidth: 300,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'block',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdType',
        // cellRendererFramework: TooltipTeacherComponent,
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.ADDRESS_REWARD'),
        field: 'rdAddress',
        height: 56,
        // minWidth: 300,
        // maxWidth: 300,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'block',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdAddress',
        // cellRendererFramework: TooltipTeacherComponent,
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.CONTENT_REWARD'),
        field: 'rdContent',
        // minWidth: 140,
        // maxWidth: 140,
        height: 56,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'block',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdContent',
      }
    ];

    // Table ky luật
    this.columnDefsRewardPunish = [
      {
        headerName: this.tran('TEACHER.GRID.NO'),
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        lockPosition: true,
        suppressMovable: true,
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box'
        }
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.TIME_DISCIPLINE'),
        cellRenderer: param => {
          return `${moment(param.data.rdDate).format('DD/MM/YYYY')}`
        },
        tooltipValueGetter: param => {
          return `${moment(param.data.rdDate).format('DD/MM/YYYY')}`
        },
        height: 56,
        minWidth: 150,
        maxWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box'
        }
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.YEAR'),
        field: 'rdYear',
        height: 56,
        minWidth: 150,
        maxWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box'
        },
        tooltipField: 'rdYear',
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.TYPE_DISCIPLINE'),
        field: 'rdType',
        height: 56,
        // minWidth: 300,
        // maxWidth: 300,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdType',
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.ADDRESS_DISCIPLINE'),
        field: 'rdAddress',
        height: 56,
        // minWidth: 300,
        // maxWidth: 300,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdAddress',
      },
      {
        headerName: this.tran('TEACHER.REWARD_DISCIPLINE.CONTENT_DISCIPLINE'),
        field: 'rdContent',
        // minWidth: 150,
        // maxWidth: 150,
        height: 56,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdContent',
      }
    ];

    // Table lương
    // @ts-ignore
    this.columnDefsSalary = [
      {
        headerName: this.tran('TEACHER.GRID.NO'),
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: this.tran('TEACHER.SALARY.DATE_SALARY'),
        cellRenderer: param => {
          return `${moment(param.data.payDay).format('DD/MM/YYYY')}`
        },
        tooltipValueGetter: param => {
          return `${moment(param.data.payDay).format('DD/MM/YYYY')}`
        },
        minWidth: 150,
        maxWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: this.tran('TEACHER.SALARY.SALARY_LEVEL'),
        field: 'salaryLevelName',
        minWidth: 200,
        maxWidth: 200,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        },
        tooltipField: 'salaryLevelName',
      },
      {
        headerName: this.tran('TEACHER.SALARY.RANK_NAME'),
        field: 'rankName',
        minWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        },
        tooltipField: 'rankName',
      },
      {
        headerName: this.tran('TEACHER.SALARY.COEFFICIENT'),
        field: 'coefficient',
        minWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        maxWidth: 150,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        },
        tooltipField: 'coefficient',
      },
      {
        headerName: this.tran('TEACHER.SALARY.EXCEED_FRAME'),
        field: 'exceedFrame',
        minWidth: 150,
        maxWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        },
        tooltipField: 'exceedFrame',
      },
      {
        headerName: this.tran('TEACHER.SALARY.NOTE'),
        field: 'description',
        // minWidth: 250,
        // maxWidth: 250,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#8F95B2',
          top: '12px',
          display: 'webkit-box',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
      tooltipField: 'description',
      //   cellRendererFramework: TooltipTeacherComponent,
      }
    ];

    this.columnDefsAllowances = [
      {
        headerName: this.tran('TEACHER.GRID.NO'),
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex'
        }
      },
      {
        headerName: 'Thời gian',
        field: 'timeDisplay',
        minWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          display: 'flex'
        },
        tooltipField: 'timeDisplay',
      },
      {
        headerName: 'Bộ phận công tác',
        field: 'departmentDisplay',
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex'
        },
        tooltipField: 'departmentDisplay',
        // cellRendererFramework: TooltipTeacherComponent,
      },
      {
        headerName: 'Chức vụ đảm nhận',
        field: 'position',
        lockPosition: true,
        suppressMovable: true,
        minWidth: 150,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex'
        },
        tooltipField: 'position',
        // cellRendererFramework: TooltipTeacherComponent,
      },
      {
        headerName: 'Môn học giảng dạy',
        field: 'subjectName',
        minWidth: 150,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          display: 'flex'
        },
        tooltipField: 'subjectName',
      },
    ];

    this.columnAllowancesMode = [
      {
        headerName: this.tran('TEACHER.SALARY.ALLOWANCES_MODE'),
        field: 'allowanceMode',
        minWidth: 400,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'allowanceMode',
        // cellRendererFramework: TooltipTeacherComponent,
      },
    ];
    this.overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
    this.teacher.createdName = JSON.parse(localStorage.getItem('currentUser')).fullName;
    this.route.params.subscribe(param => {
      this.teacher.id = param.id;
    });
  }
  @ViewChild('showPdf') public showPdf: ModalDirective;
  columnDefsJobTransfer;
  columnDefsSalary;
  columnAllowancesMode;
  columnDefsAllowances;
  columnDefsRewardBonus;
  columnDefsRewardPunish;
  rowData;
  gridApi;
  gridApiKT;
  gridApiKL;
  gridApiPC;
  gridApiTTPC;
  gridColumnApi;
  gridColumnApiKT;
  gridColumnApiKL;
  gridColumnApiPC;
  gridColumnApiTTPC;
  headerHeight = 56;
  rowHeight = 50;
  defaultColDef;
  selectDemo;
  university = {
    sysEdu: '',
    graduationYear: '',
    trainingPlaces: '',
    levelType: '',
    tranningCountry: '',
    degreePath: '',
    specialized: '',
    diplomaByte: '',
    name: '',
    fileName: '',
  };
  listMaster: any[];
  listDoctor: any[];
  certificatePath: any [];
  avatar;
  diploma;
  pdfFile = {
    name: '',
    byte: [],
    path: '',
  }

  certificates: any [];

  schoolName;
  schoolInfo: any;

  rowDataJobTransfer;

  teacher: Teacher = new Teacher();
  jobTransferHistoryOutList: any[];

  cellValue: string;
  listSalaryAllowances: any[];
  modalRef: BsModalRef;
  dataPdfUrl;
  titleFile;
  color: any;
  listStatusTeacher = TEACHER.STATUS;
  trinhdo;
  fileNameMaster;
  fileNameDoctor;
  overlayNoRowsTemplate;
  listSpecial: any;
  public itemForeignLanguage: ForeignLanguage;
  public itemSpecializeLevel: SpecializeLevel;
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridApi.setRowData(this.rowDataJobTransfer);
  }

  onGridReadyKT(params){
    this.gridApiKT = params.api;
    this.gridColumnApiKT = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  onGridReadyKL(params){
    this.gridApiKL = params.api;
    this.gridColumnApiKL = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  onGridReadyPC(params){
    this.gridApiPC = params.api;
    this.gridColumnApiPC = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  onGridReadyTTPC(params){
    this.gridApiTTPC = params.api;
    this.gridColumnApiTTPC = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  // gets called once before the renderer is used
  agInit(params): void {
    this.cellValue = params
  }

  ngOnInit() {
    this.schoolInfo = this.schoolServices.schoolInfo;
    this.schoolName = this.schoolInfo != null ? this.schoolInfo.name : `${environment.SCHOOL_NAME}`;
    this.teacherService.getInforById(this.teacher.id).then((res: any) => {
      this.rowDataJobTransfer = [];
      this.changeDetectorRef.detectChanges();
      this.teacher = res;
      this.changeDetectorRef.detectChanges();
      const positionArr = res.positionName.split(',').filter(word => word !== '');
      const positionStr = positionArr.length === 1 ? positionArr[0] : positionArr.concat([]);
      // Trình độ đào tạo
      if(this.teacher.specializeLevel === 1)
        this.trinhdo = this.tran('TEACHER.LEVEL.UNIVERSITY');
      else if(this.teacher.specializeLevel === 2)
        this.trinhdo = this.tran('TEACHER.LEVEL.MASTER');
      else
        this.trinhdo = this.tran('TEACHER.LEVEL.DOCTOR');
      // ===============================tab qua trinh cong tac==========================================
      this.teacher.jobTransferHistories.map(item => {
        item.dvct = this.schoolName;
        item.position = positionStr;
        item.timeDisplay = (item.endDate === null || item.endDate === undefined) ?
          // tslint:disable-next-line:max-line-length
          (this.formatDate(item.fromDate) + ' - ' + this.tran('TEACHER.TODAY')) : (this.formatDate(item.fromDate) + ' - ' + this.formatDate(item.endDate));
        return item;
      });

      this.jobTransferHistoryOutList = res.jobTransferHistoryOutList;
      this.jobTransferHistoryOutList.map(item => {
        item.position = item.oldPosition;
        item.dvct = item.oldDept;
 		if (item.endDate === null && item.startDate !== null) {
          item.timeDisplay = this.formatDate(item.startDate) + ' - ...';
        }else if (item.endDate !== null && item.startDate !== null){
          item.timeDisplay = this.formatDate(item.startDate) + ' - ' + this.formatDate(item.endDate);
        }else if (item.endDate !== null && item.startDate == null){
          item.timeDisplay = '... - ' +this.formatDate(item.endDate);
        }        return item;
      });
      this.rowDataJobTransfer = [...this.teacher.jobTransferHistories, ...this.jobTransferHistoryOutList];
      console.log(this.rowDataJobTransfer);
      console.log(this.teacher);
      // =====================================tab =======================================================
      this.teacher.startDate = this.teacher.startDate == null ? '' : moment(this.teacher.startDate).format('DD/MM/YYYY')
      this.teacher.birthDay = this.teacher.birthDay == null ? '' : moment(this.teacher.birthDay).format('DD/MM/YYYY')
      this.teacher.issuedDate = this.teacher.issuedDate == null ? '' : moment(this.teacher.issuedDate).format('DD/MM/YYYY')
      this.teacher.dateOfUnionMember = this.teacher.dateOfUnionMember == null ? '' : moment(this.teacher.dateOfUnionMember).format('DD/MM/YYYY')
      this.teacher.dateOfPartyMember = this.teacher.dateOfPartyMember == null ? '' : moment(this.teacher.dateOfPartyMember).format('DD/MM/YYYY')

      // Chức vụ
      const positionArr1 = res.positionName.split(',').filter(word => word !== '');
      // this.teacher.positionName = positionArr1.length === 1 ? positionArr1[0] : positionArr1.concat([]);
      // Xl chức vụ
      let strPosition = '';
      res.position.forEach(e=>{
        if(e === 'ROLE_HT')
          strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.PRINCIPAL') + ', ';
        else if(e === 'ROLE_HP')
          strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.ASSISTANT_PRINCIPAL') + ', ';
        else if(e === 'ROLE_TK')
          strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.LEADER_DEPARTMENT') + ', ';
        else if(e === 'ROLE_GVBM')
          strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.TEACHER_SUBJECT') + ', ';
        else
          strPosition = strPosition + this.tran('TEACHER.POSITION_LIST.TEACHER_HOMEROOM') + ', ';
      })
      // const positionArr2 = strPosition.split(',').filter(word => word !== '');
      this.teacher.positionName = strPosition.slice(0, -2);
      // ------------ Ngoại ngữ ---------
      if(this.teacher.foreignLanguageDTOList.length === 0 || this.teacher.foreignLanguageDTOList === null){
        this.itemForeignLanguage = new ForeignLanguage();
        // @ts-ignore
        this.teacher.foreignLanguageDTOList.push(this.itemForeignLanguage);
      }

      if (this.teacher.avatar != null) {
        this.avatar = 'data:image/jpeg;base64,' + this.teacher.avatarByte;
      }
      // Chứng chỉ
      if (this.teacher.certificatePath != null) {
        const i = 1;
        this.certificates = [];
        let listData2 = [];
        this.teacher.certificatePathList.forEach(item => {
          let a = {};
          const pathFile:string = item;
          const nameFile = pathFile.slice(pathFile.lastIndexOf('saved') + 6, pathFile.length);
          console.log(nameFile);
          a = {...this.pdfFile, name: nameFile, path: item};
          // this.certificates.push(this.pdfFile);
          listData2 = [...listData2, a];
        })
        this.certificates = listData2;
        console.log(this.certificates);
      }
      if (this.teacher.specializeLevels.length > 0 || this.teacher.specializeLevels !== null) {
        // tslint:disable-next-line:triple-equals
        const obj = this.teacher.specializeLevelsDtos.filter(i => i.levelType == 1);
        this.listMaster = this.teacher.specializeLevelsDtos.filter(i => i.levelType === 2);
        this.listDoctor = this.teacher.specializeLevelsDtos.filter(i => i.levelType === 3);
        console.log(this.listMaster)
        if (obj.length > 0) {
          this.university.sysEdu = obj[0].sysEdu === 1 ? this.tran('TEACHER.LEVEL.FORMAL') : this.tran('TEACHER.LEVEL.IN_OFFICE');
          this.university.trainingPlaces = obj[0].trainingPlaces;
          this.university.tranningCountry = obj[0].tranningCountry;
          this.university.graduationYear = obj[0].graduationYear;
          this.university.specialized = obj[0].specialized;
          this.university.diplomaByte = obj[0].diplomaByte[0];
          this.university.degreePath = obj[0].degreePath;
          if(obj[0].degreePath !== null){
            const nameFile = obj[0].degreePath.slice(obj[0].degreePath.lastIndexOf('saved') + 6, obj[0].degreePath.length);
            this.university.name = nameFile;
          }
        }
      }
      // ----- Thạc sỹ, Tiến sỹ ------
      if(this.listMaster.length === 0){
        this.itemSpecializeLevel = new SpecializeLevel();
        this.listMaster.push(this.itemSpecializeLevel);
        console.log(this.listMaster);
      }else if(this.listMaster[0].degreePath != null){
        // tslint:disable-next-line:max-line-length
        const nameFile = this.listMaster[0].degreePath.slice(this.listMaster[0].degreePath.lastIndexOf('saved') + 6, this.listMaster[0].degreePath.length);
        this.fileNameMaster = nameFile;
      }
      if(this.listDoctor.length === 0){
        this.itemSpecializeLevel = new SpecializeLevel();
        this.listDoctor.push(this.itemSpecializeLevel);
      }else if(this.listDoctor[0].degreePath !== null){
        // tslint:disable-next-line:max-line-length
        const nameFile = this.listDoctor[0].degreePath.slice(this.listDoctor[0].degreePath.lastIndexOf('saved') + 6, this.listDoctor[0].degreePath.length);
        this.fileNameDoctor = nameFile;
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  openModal(template: TemplateRef<any>) {
    const file3 = new Blob([this.teacher.certificatePath], {type: 'application/pdf'});
    this.dataPdfUrl = this.dom.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file3));
    this.titleFile = this.university.name;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'addnew-unit-md modal-dialog-custom'})
    );
    console.log(this.dataPdfUrl)
  }

  formatDate(originalDate: string): string {
    const date = new Date(originalDate)
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`
  }

  // View File
  viewFile(item: any){
    console.log(item);
    const data: any = {};
      this.teacherService.viewFile(item.path).subscribe(res=> {
        const file =(item.path.indexOf('.pdf') !== -1) ?
          new Blob([res], {type: 'application/pdf'}) :
          new Blob([res], {type: 'image/jpg'}) ;
        data.fileURL = URL.createObjectURL(file);
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
      });
    }
    viewFileDH(item: any){
    const data: any = {};
      this.teacherService.viewFile(item.degreePath).subscribe(res=> {
        const file =(item.degreePath.indexOf('.pdf') !== -1) ?
          new Blob([res], {type: 'application/pdf'}) :
          new Blob([res], {type: 'image/jpg'}) ;
        data.fileURL = URL.createObjectURL(file);
        data.check = 1;
        this.matDialog.open(ViewFileComponent, {
          width: '80vw',
          height: '80vh',
          hasBackdrop: true,
          data,
          disableClose: true,
        }).afterClosed().subscribe(dataRes => {
          console.log(dataRes);
        });
      });
    }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    this.resizeWidthScroll();
  }

  resizeWidthScroll(): void {
    const scroll = (document.querySelector('.ag-body-horizontal-scroll-container') as HTMLElement)
    const allSemesterColumns = (document.querySelector('.ag-header-container') as HTMLElement)
    scroll.style.width = `${allSemesterColumns.offsetWidth}px`
  }
  tran(key): string {
    return this.translate.instant(key)
  }
}
