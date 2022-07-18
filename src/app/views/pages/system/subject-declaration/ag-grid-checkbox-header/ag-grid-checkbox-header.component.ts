import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {Subscription} from "rxjs";
import {ClassroomService} from "../../../../../core/service/service-model/classroom.service";
import {SchoolYearService} from "../../school-year/school-year.service";
import {SubjectDeclarationComponent} from "../subject-declaration.component";

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
    selector: 'app-ag-grid-checkbox-header',
    templateUrl: './ag-grid-checkbox-header.component.html',
    styleUrls: ['./ag-grid-checkbox-header.component.css']
})
export class AgGridCheckboxHeaderComponent implements AgRendererComponent {

    params: any;
    subscription: Subscription;
    semesterAmount;
    currentYear;
    checkAll;
    checkSemester1 = false;
    checkSemester2 = false;
    checkSemester3 = false;
    checkSemester4 = false;
    constructor(private subjectDeclarationComponent: SubjectDeclarationComponent) {
    }

    agInit(params: any): void {
        this.params = params;
    }

    // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    // }

    refresh(params: any): boolean {
        // debugger;
        if(params.api.dataAll == undefined){
            return false;
        }
        if(params.column.colId == 'allYear') {
            if (params.api.checkAll === true) {
                this.checkAll = true;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].allYear = 1;
                    }
                }
            }
            if (params.api.checkAll === false) {
                this.checkAll = false;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].allYear = 0;
                    }
                }
            }
        }
        if(params.column.colId == 'flgSemester1') {
            if (params.api.checkSemester1 === true) {
                this.checkSemester1 = true;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester1 = 1;
                    }
                }
            }
            if (params.api.checkSemester1 === false) {
                this.checkSemester1 = false;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester1 = 0;
                    }
                }
            }
        }
        if(params.column.colId == 'flgSemester2') {
            if (params.api.checkSemester2 === true) {
                this.checkSemester2 = true;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester2 = 1;
                    }
                }
            }
            if (params.api.checkSemester2 === false) {
                this.checkSemester2 = false;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester2 = 0;
                    }
                }
            }
        }
        if(params.column.colId == 'flgSemester3') {
            if (params.api.checkSemester3 === true) {
                this.checkSemester3 = true;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester3 = 1;
                    }
                }
            }
            if (params.api.checkSemester3 === false) {
                this.checkSemester3 = false;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester3 = 0;
                    }
                }
            }
        }
        if(params.column.colId == 'flgSemester4') {
            for (let i = 0; i < params.api.dataAll.length; i++) {

            }
            if (params.api.checkSemester4 === true) {
                this.checkSemester4 = true;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester4 = 1;
                    }
                }
            }
            if (params.api.checkSemester4 === false) {
                this.checkSemester4 = false;
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester4 = 0;
                    }
                }
            }
        }
        params.api.refreshCells(params);
        params.api.checkAll = this.checkAll;
        params.api.checkSemester1 = this.checkSemester1;
        params.api.checkSemester2 = this.checkSemester2;
        params.api.checkSemester3 = this.checkSemester3;
        params.api.checkSemester4 = this.checkSemester4;
        this.subjectDeclarationComponent.configCheckboxHeader(params);
        //
        return false;
    }
}
