import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {Subscription} from "rxjs";
import {ClassroomService} from "../../../../../core/service/service-model/classroom.service";
import {SchoolYearService} from "../../school-year/school-year.service";

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
    selector: 'app-ag-grid-checkbox',
    templateUrl: './ag-grid-checkbox.component.html',
    styleUrls: ['./ag-grid-checkbox.component.css']
})
export class AgGridCheckboxComponent implements AgRendererComponent {

    params: any;
    subscription: Subscription;
    semesterAmount;
    currentYear;

    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
    }

    // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    // }

    refresh(params: any): boolean {
        if (params.colDef.field == 'status') {
            if (params.value == true) {
                params.data.status = 1;
            } else {
                params.data.status = 0;
            }
        }
        if (params.colDef.field == 'flgSemester1') {
            if (params.value == true) {
                params.data.flgSemester1 = 1;
            } else {
                params.data.flgSemester1 = 0;
            }
        }
        if (params.colDef.field == 'flgSemester2') {
            if (params.value == true) {
                params.data.flgSemester2 = 1;
            } else {
                params.data.flgSemester2 = 0;
            }
        }
        if (params.colDef.field == 'flgSemester3') {
            if (params.value == true) {
                params.data.flgSemester3 = 1;
            } else {
                params.data.flgSemester3 = 0;
            }
        }
        if (params.colDef.field == 'flgSemester4') {
            if (params.value == true) {
                params.data.flgSemester4 = 1;
            } else {
                params.data.flgSemester4 = 0;
            }
        }
        if (params.colDef.field == 'allYear') {
            if (params.value == true) {
                if (params.api.semesterAmount > 0) {
                    params.data.flgSemester1 = 1;
                }
                if (params.api.semesterAmount > 1) {
                    params.data.flgSemester2 = 1;
                }
                if (params.api.semesterAmount > 2) {
                    params.data.flgSemester3 = 1;
                }
                if (params.api.semesterAmount > 3) {
                    params.data.flgSemester4 = 1;
                }
            }
            if (params.api.semesterAmount == 3) {
                if (params.data.flgSemester1 == '1' && params.data.flgSemester2 == '1' && params.data.flgSemester3 == '1' && params.value == 0) {
                    params.data.flgSemester1 = 0;
                    params.data.flgSemester2 = 0;
                    params.data.flgSemester3 = 0;
                }
            }
            if (params.api.semesterAmount == 1) {
                if (params.data.flgSemester1 == '1' && params.value == 0) {
                    params.data.flgSemester1 = 0;
                }
            }
            if (params.api.semesterAmount == 2) {
                if (params.data.flgSemester1 == '1' && params.data.flgSemester2 == '1' && params.value == 0) {
                    params.data.flgSemester1 = 0;
                    params.data.flgSemester2 = 0;
                }
            }
            if (params.api.semesterAmount == 4) {
                if (params.data.flgSemester1 == '1' && params.data.flgSemester2 == '1' && params.data.flgSemester3 == '1' && params.data.flgSemester3 == '4' && params.value == 0) {
                    params.data.flgSemester1 = 0;
                    params.data.flgSemester2 = 0;
                    params.data.flgSemester3 = 0;
                    params.data.flgSemester4 = 0;
                }
            }
        }

        if (params.api.semesterAmount == 1) {
            if (params.data.flgSemester1 !== '1') {
                params.data.allYear = 0;
            }
        }
        if (params.api.semesterAmount == 2) {
            if (params.data.flgSemester1 !== '1' || params.data.flgSemester2 !== '1') {
                params.data.allYear = 0;
            }
        }
        if (params.api.semesterAmount == 3) {
            if (params.data.flgSemester1 !== '1' || params.data.flgSemester2 !== '1' || params.data.flgSemester3 !== '1') {
                params.data.allYear = 0;
            }
        }
        if (params.api.semesterAmount == 3) {
            if (params.data.flgSemester1 !== '1' || params.data.flgSemester2 !== '1' || params.data.flgSemester3 !== '1') {
                params.data.allYear = 0;
            }
        }
        if (params.api.semesterAmount == 4) {
            if (params.data.flgSemester1 !== '1' || params.data.flgSemester2 !== '1' || params.data.flgSemester4 !== '1') {
                params.data.allYear = 0;
            }
        }


        if (params.api.semesterAmount == 1) {
            if (params.data.flgSemester1 == '1') {
                params.data.allYear = 1;
            }
        }
        if (params.api.semesterAmount == 2) {
            if (params.data.flgSemester1 == '1' && params.data.flgSemester2 == '1') {
                params.data.allYear = 1;
            }
        }
        if (params.api.semesterAmount == 3) {
            if (params.data.flgSemester1 == '1' && params.data.flgSemester2 == '1' && params.data.flgSemester3 == '1') {
                params.data.allYear = 1;
            }
        }
        if (params.api.semesterAmount == 4) {
            if (params.data.flgSemester1 == '1' && params.data.flgSemester2 == '1' && params.data.flgSemester3 == '1' && params.data.flgSemester4 == '1') {
                params.data.allYear = 1;
            }
        }
        params.api.refreshCells(params);
        return false;
    }
}
