import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CheckboxColumnComponent, SelectableSettings} from '@progress/kendo-angular-grid';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ActionShoolComponent} from '../school/action-shool/action-shool.component';
import {SubjectDeclarationService} from './subject-declaration.service';
import {AgGridCheckboxComponent} from './ag-grid-checkbox/ag-grid-checkbox.component';
import {ConfirmSaveComponent} from './confirm-save/confirm-save.component';
import {ToastrService} from 'ngx-toastr';
import {AgGridSelectComponent} from './ag-grid-select/ag-grid-select.component';
import {placeholdersToParams} from '@angular/compiler/src/render3/view/i18n/util';
import {CommonServiceService} from '../../../../core/service/utils/common-service.service';
import {Subscription} from 'rxjs';
import {SchoolYearService} from '../school-year/school-year.service';
import {Location} from '@angular/common';
import {AgGridCheckboxHeaderComponent} from './ag-grid-checkbox-header/ag-grid-checkbox-header.component';
import row from 'ag-grid-enterprise/dist/lib/excelExport/files/xml/row';
import {NO_ROW_GRID_TEMPLATE} from '../../../../helpers/constants';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'subject-declaration',
    templateUrl: './subject-declaration.component.html',
    styleUrls: ['./subject-declaration.component.scss']
})
export class SubjectDeclarationComponent implements OnInit, AfterViewInit {
    constructor(private subjectDeService: SubjectDeclarationService,
                private fb: FormBuilder,
                private matDialog: MatDialog,
                private toast: ToastrService,
                private commonService: CommonServiceService,
                private classRoomService: ClassroomService,
                private changeDetectorRef: ChangeDetectorRef,
                private getYear: SchoolYearService,
                private location: Location,
                private translateService: TranslateService) {
        this.setColumn = [];
      this.dataFromClassroom = this.location.getState();
        this.loadCurrentYear();
    }
    rowData;
    gradeData;
    departmentData;
    classRoomData
    deptId;
    subject = '';
    className;
    idClass;
    showSave = false;
    showCancel = false;
    disableStatus = true;
    disableSearch = false;
    showUpdate = true;
    gradeLevel;
    classRoom;
    gridApi;
    firstSearch = true;
    saveAllGrade = 0;
    saveAllDept = 0;
    gridColumnApi;
    headerHeight = 56;
    rowHeight = 50;
    subscription: Subscription;
    formSearch: any = {};
    noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translateService.instant('PARENTS.NO_INFO'));
    schoolYear;
    cacheBlockSize = 10;
    name;
    perPage = 10;
    currentPage = 1;
    semesterAmount;
    first = 1;
    last = 10;
    total = 0;
    totalPage = 0;
    countPage = [];
    setColumn;
    setColumn1;
    rowDataChange = [];
    rangeWithDots = [];
    dataFromClassroom;
    loading = false;
    beforData =[];
    checkAll = 0;
    checkSemester1 = 0;
    checkSemester2 = 0;
    checkSemester3 = 0;
    checkSemester4 = 0;
    canSubmit = true;
    inputInfoSearchTrans = this.translateService.instant('CLASSROOM.PLACEHOLDER_CLASS')

    columnDefs = [
        {
            headerName: this.translateService.instant('TRANSFER_STUDENTS.NO'),
            field: 'no',
            valueGetter: param => {
                param.api.dataAll = [];
                param.api.dataAll = this.rowData;
                param.api.semesterAmount = this.semesterAmount;
                param.api.stas = this.disableStatus;
                param.api.checkAll = this.checkAll;
                param.api.checkSemester1 = this.checkSemester1;
                param.api.checkSemester2 = this.checkSemester2;
                param.api.checkSemester3 = this.checkSemester3;
                param.api.checkSemester4 = this.checkSemester4;
                return param.node.rowIndex + (((this.currentPage - 1) * this.perPage) + 1)
            },
            minWidth: 90,
            maxWidth:90,
            cellStyle: {
                'font-weight': '500',
                'font-size': '12px',
                'align-items': 'center',
                color: '#101840',
                top: '12px',
                'margin-left': '31px',
                'justify-content' : 'center',
            },
            suppressMovable: true,
            pinned: 'left',
            lockPosition: true,
        },
        {
            headerName: this.translateService.instant('DECLARE_SUBJECT.SUBJECT_NAME'),
            field: 'subjectName',
            minWidth: 230,
            cellStyle: {
                'font-weight': '500',
                'font-size': '12px',
                'align-items': 'center',
                color: '#101840',
                // display: 'flex',
                top: '12px',
                'white-space': 'nowrap',
                overflow: 'hidden',
                'border-right': 'none',
                'text-overflow': 'ellipsis',
                'margin-left': '30px'
            },
            tooltipField: 'subjectName',
            suppressMovable: true,
            lockPosition: true,
            pinned: 'left',
            lockPinned: true,
        },
        {
            headerName: this.translateService.instant('DECLARE_SUBJECT.LEARN'), field: 'status',
            cellRendererFramework: AgGridCheckboxComponent,
            minWidth: 150,
            cellStyle: params =>
                params.column.colId === 'status' && this.disableStatus !== true ?
                    {
                        top: '12px',
                        'align-items': 'center',
                        'pointer-events': 'auto',
                        'margin-left': '25px',
                        'white-space': 'nowrap',
                        'text-overflow': 'ellipsis',
                        overflow: 'hidden',
                    }
                    : {
                        top: '12px',
                        'align-items': 'center',
                        'pointer-events': 'none',
                        'margin-left': '25px',
                        'white-space': 'nowrap',
                        'text-overflow': 'ellipsis',
                        overflow: 'hidden',
                    },
            suppressMovable: true,
        },
        {
            headerName: this.translateService.instant('SCOREBOARD.GRID.COEFRICIENT'), field: 'coefficient',
            minWidth: 150,
            cellRendererFramework: AgGridSelectComponent,
            cellStyle: params =>
                params.column.colId === 'coefficient' && this.disableStatus !== true ?
                    {
                        'align-items': 'center',
                        'pointer-events': 'auto',
                        'white-space': 'nowrap',
                        'text-overflow': 'ellipsis',
                        overflow: 'hidden',
                    } :
                    {
                        'align-items': 'center',
                        'pointer-events': 'none',
                        'white-space': 'nowrap',
                        'text-overflow': 'ellipsis',
                        overflow: 'hidden',
                    },
            suppressMovable: true,
        },
        {
            headerName: this.translateService.instant('GRADEBOOK.FULL_YEAR'),
            field: 'allYear',
            minWidth: 150,
            cellRendererFramework: AgGridCheckboxComponent,
            headerComponentFramework: AgGridCheckboxHeaderComponent,
            cellStyle: params =>
                params.column.colId === 'allYear' && this.disableStatus !== true ?
                    {
                        'align-items': 'center',
                        'pointer-events': 'auto',
                        'margin-left': '37px',
                        'white-space': 'nowrap',
                        'text-overflow': 'ellipsis',
                        overflow: 'hidden',
                        top: '12px',
                    } :
                    {
                        'align-items': 'center',
                        'pointer-events': 'none',
                        'margin-left': '37px',
                        'white-space': 'nowrap',
                        'text-overflow': 'ellipsis',
                        overflow: 'hidden',
                        top: '12px',
                    },
            suppressMovable: true,
        },
    ];
    ngOnInit(): void {
        // this.dataFromClassroom = this.location.getState();
        this.getGrade();
    }
    loadCurrentYear(): void {
        this.subscription = this.classRoomService.yearCurrent$.subscribe(
            (currentYear) => {
              this.schoolYear = currentYear;
              if (this.schoolYear !== '' && this.schoolYear != null) {
                  this.getYear.getInfoYear(this.schoolYear).subscribe(res => {
                      this.semesterAmount = res[0].semesterAmount;
                  });
              }
              this.classRoom = null;
              this.className = null;
              this.classRoomData = null;
              if (this.dataFromClassroom.id !== null && this.dataFromClassroom.id !== undefined) {
                this.gradeLevel = this.dataFromClassroom.gradeLevel;
                this.deptId = this.dataFromClassroom.deptId;
              }
              console.log(this.dataFromClassroom);
              this.getClassRoom(this.gradeLevel, this.deptId);
            }
        );

    }

    ngAfterViewInit() {

    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridApi.hideOverlay();
        this.gridColumnApi = params.columnApi;
        setTimeout(() => {
            this.resizeTwoLastColumns();
            params.api.sizeColumnsToFit();
        }, 500);

    }
    gridSizeChanged(params) {
        setTimeout( () => {
            params.api.sizeColumnsToFit();
            this.removeStyle();
            this.resizeTwoLastColumns();
        }, 500)
    }
    gridColumnsChanged(param) {
        setTimeout( () => {
            this.resizeTwoLastColumns();
            this.removeStyle();
            param.api.sizeColumnsToFit()
        }, 500)
    }
    resizeTwoLastColumns(): void {
        const header = (document.querySelector('.ag-pinned-right-header') as HTMLElement)
        const body = (document.querySelector('.ag-pinned-right-cols-container') as HTMLElement)
        // const header1 = (document.querySelector('.ag-header') as HTMLElement)
        // const body1 = (document.querySelector('.ag-body-viewport') as HTMLElement)
        body.style.minWidth = `${header.offsetWidth}px`
        // body1.style.minWidth = `${header1.offsetWidth}px`
    }

    removeStyle() {
        const removeStyle = document.querySelector('.ag-center-cols-container') as HTMLElement;
        const currentValue =  removeStyle.style.getPropertyValue('width');
        const newCurrentValueFloat = currentValue.slice(0,-2);
        const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
        const newValue = newCurrentValueInt + 14;
      removeStyle.style.width=`${newValue}px`;

    }
    checkRowChange(obj: any){
        if(this.rowDataChange.length>0) {
            for (let i = 0; i < this.rowDataChange.length; i++) {
                if (obj.subjectCode == this.rowDataChange[i].subjectCode) {
                    this.rowDataChange.splice(i,1);
                    this.rowDataChange.push(...obj);
                }
                if(i == this.rowDataChange.length-1 && obj.subjectCode !== this.rowDataChange[i].subjectCode)
                    this.rowDataChange.push(...obj);
            }
        }
        else{
            this.rowDataChange.push(...obj);
        }
    }

    goToPage(page: number) {
        for(let i = 0;i< this.beforData.length;i++){
            for(let j = 0; j< this.rowData.length;j++){
                if(this.rowData[j].subjectCode === this.beforData[i].subjectCode){
                    if(this.rowData[j].status !== this.beforData[i].status || this.rowData[j].coefficient !== this.beforData[i].coefficient
                        || this.rowData[j].flgSemester1 !== this.beforData[i].flgSemester1 || this.rowData[j].flgSemester2 !== this.beforData[i].flgSemester2
                        || this.rowData[j].flgSemester3 !== this.beforData[i].flgSemester3 || this.rowData[j].flgSemester4 !== this.beforData[i].flgSemester4){
                        this.checkRowChange(this.rowData[j]);
                    }
                }
            }
        }
        if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
            this.currentPage = page;
            this.search(page);
        }
    }


    search(page: number) {
        this.currentPage = page;
        this.formSearch.deptId = this.deptId;
        this.formSearch.gradeLevel = this.gradeLevel;
        this.formSearch.classId = this.classRoom;
        this.formSearch.subjectName = this.subject.trim();
        this.formSearch.years = this.schoolYear;
        this.loading = true;
        this.subjectDeService.getData(this.formSearch, this.currentPage, this.perPage).subscribe(res => {
            this.loading = false;
            this.rowData = res.content;
            this.getColumn();
            for (let i = 0; i < this.rowDataChange.length; i++) {
                for (let j = 0; j < this.rowData.length; j++) {
                    if (this.rowDataChange[i].subjectName === this.rowData[j].subjectName) {
                        this.rowData[j] = this.rowDataChange[i];
                    }
                }
            }
            if (res.totalElements > 0) {
                this.total = res.totalElements;
                this.totalPage = Math.ceil(this.total / this.perPage);
                this.rangeWithDots = this.commonService.pagination(
                    this.currentPage,
                    this.totalPage
                );
                this.first = this.perPage * (this.currentPage - 1) + 1;
                this.last = this.first + res.content.length - 1;
                // this.gridApi.setRowData(this.rowData);

            } else {
                this.total = 0;
                this.rangeWithDots = [];
                this.first = 0;
                this.last = 0;
            }

            this.idClass = this.classRoom;
            this.gridApi.setRowData(this.rowData);

            this.changeDetectorRef.detectChanges();
            this.firstSearch = false;
        })
        this.subjectDeService.getData(this.formSearch, this.currentPage, this.perPage).subscribe(res => {
            this.beforData = res.content;
        });
    }
 getColumn(){
     this.setColumn = null;
     this.setColumn = [...this.columnDefs];
     for (let i = 0; i < this.semesterAmount; i++) {
         this.setColumn.push({
             headerName: this.mappingSemester[i+1], field: `flgSemester${i + 1}`,
             minWidth: 150,
             cellRendererFramework: AgGridCheckboxComponent,
             headerComponentFramework: AgGridCheckboxHeaderComponent,
             cellStyle: params =>
                 params.column.colId === `flgSemester${i + 1}` && this.disableStatus !== true ?
                     {
                         top: '12px',
                         'align-items': 'center',
                         'pointer-events': 'auto',
                         'margin-left': '37px',
                         'white-space': 'nowrap',
                         'text-overflow': 'ellipsis',
                         overflow: 'hidden',
                     } :
                     {
                         top: '12px',
                         'align-items': 'center',
                         'pointer-events': 'none',
                         'margin-left': '37px',
                         'white-space': 'nowrap',
                         'text-overflow': 'ellipsis',
                         overflow: 'hidden',
                     },
             suppressMovable: true,
         });
         this.gridApi.setColumnDefs(this.setColumn);
     }
     for (let i = 0; i < this.semesterAmount; i++) {
         this.setColumn.push({
             headerName: this.mappingTeacherSemester[i+1], field: `nameTeacherSemester${i + 1}`,
             minWidth: 230,
             maxWidth: 230,
             cellStyle: {
                 'font-weight': '500',
                 'font-size': '12px',
                 'align-items': 'center',
                 color: '#101840',
                 // display: 'flex',
                 top: '12px',
                 'white-space': 'nowrap',
                 'text-overflow': 'ellipsis',
                 overflow: 'hidden',
                 'margin-left': '30px',
             },
             suppressMovable: true,
             tooltipField: `nameTeacherSemester${i + 1}`
         });
         this.gridApi.setColumnDefs(this.setColumn);
     }
 }

    clickUpdate() {
        // this.beforData = this.rowData;
        this.canSubmit = true;
        this.showUpdate = false;
        this.showSave = true;
        this.showCancel = true;
        this.disableStatus = false;
        this.disableSearch = true;
        this.gridApi.setRowData(this.rowData);
    }

    clickCancel() {
        this.showSave = false;
        this.showCancel = false;
        this.showUpdate = true;
        this.disableStatus = true;
        this.disableSearch = false;
        this.saveAllGrade = 0;
        this.saveAllDept = 0;
        this.rowDataChange = [];
        this.checkAll = 0;
        this.checkSemester1 = 0;
        this.checkSemester2 = 0;
        this.checkSemester3 = 0;
        this.checkSemester4 = 0;
        this.search(1);
        this.gridApi.setRowData(this.rowData);
    }
    updateData() {
        this.canSubmit = true;
        for(let i = 0;i< this.beforData.length;i++){
            for(let j = 0; j< this.rowData.length;j++){
                if(this.rowData[j].subjectCode === this.beforData[i].subjectCode){
                    if(this.rowData[j].status !== this.beforData[i].status || this.rowData[j].coefficient !== this.beforData[i].coefficient
                        || this.rowData[j].flgSemester1 !== this.beforData[i].flgSemester1 || this.rowData[j].flgSemester2 !== this.beforData[i].flgSemester2
                        || this.rowData[j].flgSemester3 !== this.beforData[i].flgSemester3 || this.rowData[j].flgSemester4 !== this.beforData[i].flgSemester4){
                        this.checkRowChange(this.rowData[j]);
                    }
                }
            }
        }
        const lst = this.rowDataChange;
        for (let i = 0; i < lst.length; i++) {
            this.rowDataChange[i].classId = this.idClass;
        }
        const confirm = {
            title: this.translateService.instant('CONDUCT_ASSESSMENT.CONFIRM_TITLE'),
            message: this.translateService.instant('CONDUCT_ASSESSMENT.CONFIRM_MESSAGE')
        };
        for(let i = 0; i < this.rowDataChange.length; i++){
            if(this.rowDataChange[i].status === 1){
                if(!this.rowDataChange[i].coefficient || this.rowDataChange[i].coefficient === 0){
                    this.toast.error(this.translateService.instant('DECLARE_SUBJECT.NOT_SELECT_COEF'));
                    this.canSubmit = false;
                    break;
                }else
                if(this.rowDataChange[i].flgSemester1 === 0 && this.rowDataChange[i].flgSemester2 === 0 && this.rowDataChange[i].flgSemester3 === 0
                     && this.rowDataChange[i].flgSemester4 === 0 && this.rowDataChange[i].allYear ===0){
                    this.toast.error(this.translateService.instant('DECLARE_SUBJECT.NOT_SELECT_SEMESTER'));
                    this.canSubmit = false;
                    break;
                }else{
                    this.canSubmit = true;
                }
            }
        }
        console.log(this.canSubmit);
        if(!this.canSubmit){
            return;
        }
        this.matDialog.open(ConfirmSaveComponent, {
            data: confirm,
            disableClose: true,
            hasBackdrop: true,
            width: '420px'
        }).afterClosed().subscribe(res => {
            if (res.event === 'confirm') {
                this.loading = true;
                if(this.classRoom == null){
                    this.toast.error(this.translateService.instant('DECLARE_SUBJECT.NOT_SELECT_CLASS'));
                    this.loading = false;
                    return;
                }
                this.subjectDeService.updateData(this.rowDataChange, this.saveAllGrade, this.saveAllDept, this.gradeLevel, this.deptId).subscribe(rs => {
                    this.loading = false;
                    this.canSubmit = true;
                    if (rs.status === 'OK') {
                        this.toast.success(this.translateService.instant('DECLARE_SUBJECT.SAVE_DONE'));
                    } else if (rs.status === 'BAD_REQUEST') {
                        this.toast.error(rs.message,null,{timeOut: 3000});
                    } else {
                        this.toast.error(this.translateService.instant('DECLARE_SUBJECT.SAVE_FAIL'));
                    }
                    this.search(1);
                    this.saveAllDept = 0;
                    this.saveAllGrade = 0;
                    this.rowDataChange = [];
                });
                this.showSave = false;
                this.showCancel = false;
                this.showUpdate = true;
                this.disableStatus = true;
                this.disableSearch = false;
            }
            this.changeDetectorRef.detectChanges();
        })

    }

    getGrade() {
        this.subjectDeService.getGrade().subscribe(res => {
            this.gradeData = res;
            if (this.dataFromClassroom.id !== null && this.dataFromClassroom.id !== undefined) {
                this.gradeLevel = this.dataFromClassroom.gradeLevel;
                console.log(this.dataFromClassroom);
                this.getDept(this.gradeLevel);
            } else {
                this.gradeLevel = res[0].id;
                this.getDept(this.gradeLevel);
            }
        });
    }

    getAllGrade(event) {
        this.saveAllGrade = 0;
        if (event) {
            this.saveAllGrade = 1;
        }
    }

    getAllDept(event) {
        this.saveAllDept = 0;
        if (event) {
            this.saveAllDept = 1;
        }

    }

    getDept(grade) {
        this.subjectDeService.getDepartment().subscribe(res => {
            this.departmentData = res;
            if (this.dataFromClassroom.id !== null && this.dataFromClassroom.id !== undefined) {
                this.deptId = this.dataFromClassroom.deptId;
            } else {
                this.deptId = res[0].id;
            }
            console.log(this.deptId)
            this.getClassRoom(grade, this.deptId);
            this.changeDetectorRef.detectChanges();
        });
    }

    exportFile() {
        this.formSearch.classId = this.classRoom;
        this.formSearch.subjectName = this.subject;
        this.formSearch.className = this.name;
        this.subjectDeService.exportFile(this.formSearch).subscribe((responseMessage) => {
            const file = new Blob([responseMessage], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const fileURL = URL.createObjectURL(file);
            const anchor = document.createElement('a');
            anchor.download = `${this.translateService.instant('DECLARE_SUBJECT.EXPORT_FILE_NAME')}${this.name}.xlsx`;
            anchor.href = fileURL;
            anchor.click();
        });

    }

    public getClassRoom(grade, dept) {
        this.className = null;
        this.classRoomData = null;
        this.classRoom = null;
        this.subjectDeService.getClassRoom(this.deptId, this.gradeLevel, this.schoolYear).subscribe(res => {
            if (res.length > 0) {
              if (this.dataFromClassroom.id !== null && this.dataFromClassroom.id !== undefined) {
                res[0] = this.dataFromClassroom;
              }
              this.classRoomData = res.map((_class) => ({
                  id: _class.id,
                  name:_class.name,
                  nameCode: `${_class.code} - ${_class.name}`,
                  code: _class.code,
              }));
              this.classRoom = res[0].id;
              if (res[0].name != null && res[0].name !== '') {
                  this.className = res[0].name + ` (${this.translateService.instant('COMMON.YEARS')} ` + this.schoolYear + `)`;
                  this.name = res[0].name;
              }
            }
            this.search(1);
            this.changeDetectorRef.detectChanges();
        });
    }
    selectGrade(event) {
        this.classRoom = null;
        this.gradeLevel = event.id;
        this.getClassRoom(this.gradeLevel, this.deptId);
    }
    selectDept(event) {
        this.classRoom = null;
        this.deptId = event.id;
        this.getClassRoom(this.gradeLevel, this.deptId);
    }

    selectClass(event) {
        this.classRoom = event.id;
        this.className = `${this.translateService.instant('TEACHING_TIMETABLE.CLASS')} ` + event.name;
        this.name = event.name;
    }

    configCheckboxHeader(params){

        if(params.column.colId === 'allYear') {
            if(params.api.checkAll === true){
                this.checkAll = 1;
                this.checkSemester1 = 1;
                this.checkSemester2 = 1;
                this.checkSemester3 = 1;
                this.checkSemester4 = 1;
            }
            if(params.api.checkAll === false){
                this.checkAll = 0;
                this.checkSemester1 = 0;
                this.checkSemester2 = 0;
                this.checkSemester3 = 0;
                this.checkSemester4 = 0;
            }
        }
        if(params.column.colId === 'flgSemester1') {
            if(params.api.checkSemester1 === true){
                this.checkSemester1 = 1;
            }
            if (params.api.semesterAmount === 4) {
                if (params.api.checkSemester1 === true && this.checkSemester2 === 1 && this.checkSemester3 === 1
                    && this.checkSemester4 === 1) {
                    this.checkAll = 1;
                }
            }
            if (params.api.semesterAmount === 3) {
                if (params.api.checkSemester1 === true && this.checkSemester2 === 1 && this.checkSemester3 === 1) {
                    this.checkAll = 1;
                }
            }
            if (params.api.semesterAmount === 2) {
                if (params.api.checkSemester1 === true && this.checkSemester2 === 1 && this.checkSemester3 === 1) {
                    this.checkAll = 1;
                }
            }
            if (params.api.semesterAmount === 1) {
                if (params.api.checkSemester1 === true) {
                    this.checkAll = 1;
                }
            }
            if(params.api.checkSemester1 === false){
                this.checkAll = 0;
                this.checkSemester1 = 0;
            }
        }
        if(params.column.colId === 'flgSemester2') {
            if(params.api.checkSemester2 === true){
                this.checkSemester2 = 1;
            }
            if (params.api.semesterAmount === 4) {
                if (this.checkSemester1 === 1 && params.api.checkSemester2 === true && this.checkSemester3 === 1
                    && this.checkSemester4 === 1) {
                    this.checkAll = 1;
                    this.checkSemester2 = 1;
                }
            }
            if (params.api.semesterAmount === 3) {
                if (this.checkSemester1 === 1 && params.api.checkSemester2 === true && this.checkSemester3 === 1) {
                    this.checkAll = 1;
                    this.checkSemester2 = 1;
                }
            }
            if (params.api.semesterAmount === 2) {
                if (this.checkSemester1 === 1 && params.api.checkSemester2 === true) {
                    this.checkAll = 1;
                    this.checkSemester2 = 1;
                }
            }
            if (params.api.checkSemester2 === false) {
                this.checkAll = 0;
                this.checkSemester2 = 0;
            }
        }
        if(params.column.colId === 'flgSemester3') {
            if(params.api.checkSemester3 === true){
                this.checkSemester3 = 1;
            }
            if(params.api.semesterAmount === 4) {
                if (this.checkSemester1 === 1 && this.checkSemester2 === 1 && params.api.checkSemester3 === true
                    && this.checkSemester4 === 1) {
                    this.checkAll = 1;
                }
            }
            if(params.api.semesterAmount === 3) {
                if (this.checkSemester1 === 1 && this.checkSemester2 === 1 && params.api.checkSemester3 === true) {
                    this.checkAll = 1;
                }
            }
            if(params.api.checkSemester3 === false){
                this.checkAll = 0;
                this.checkSemester3 = 0;
            }
        }
        if(params.column.colId === 'flgSemester4') {
            if(params.api.checkSemester4 === true){
                this.checkSemester4 = 1;
            }
            if(this.checkSemester1 === 1 && this.checkSemester2 === 1 && this.checkSemester3 === 1
                && params.api.checkSemester4 === true){
                this.checkAll = 1;
                this.checkSemester4 = 1;
            }
            if(params.api.checkSemester4 === false){
                this.checkAll = 0;
                this.checkSemester4 = 0;
            }
        }
        this.gridApi.setRowData(this.rowData);
        this.changeDetectorRef.detectChanges();
    }


    mappingTeacherSemester = {
        0: '-',
        1: this.translateService.instant(`DECLARE_SUBJECT.TEACHER_SEMESTER`)+' I',
        2: this.translateService.instant(`DECLARE_SUBJECT.TEACHER_SEMESTER`)+' II',
        3: this.translateService.instant(`DECLARE_SUBJECT.TEACHER_SEMESTER`)+' III',
        4: this.translateService.instant(`DECLARE_SUBJECT.TEACHER_SEMESTER`)+' IV',
      };

      mappingSemester = {
        0: '-',
        1: this.translateService.instant(`COMMON.SEMESTER`)+' I',
        2: this.translateService.instant(`COMMON.SEMESTER`)+' II',
        3: this.translateService.instant(`COMMON.SEMESTER`)+' III',
        4: this.translateService.instant(`COMMON.SEMESTER`)+' IV',
      };

}
