import { Component, Inject } from "@angular/core";
import { SchoolYearModel } from '../school-year.model';
import { SchoolYearService } from '../school-year.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotiService } from "../../../../../core/service/service-model/notification.service";
import { SCHOOL_YEAR, KEYCODE_0, KEYCODE_9 } from '../../../../../helpers/constants'
import { TranslateService } from "@ngx-translate/core";
@Component({
    selector: 'kt-create-school-year',
    templateUrl: './create-school-year.component.html',
    styleUrls: ['./create-school-year.component.scss']
})
export class CreateSchoolYearComponent {

    

    schoolYears: SchoolYearModel[]
    schoolYearsStored: SchoolYearModel[]
    start: any;
    end: any;
    semesterAmount: string = '1'
    title: string;

    // checkbox extend
    isExtends = false

    // disable button submit
    isDisabled = false

    // just use when update
    year: string

    // field checkValidate is used to check date valid or not
    // ex: 31/02
    errTime = [
        {
            from: {
                error: false,
                message: '',
                checkValidate: false
            },
            to: {
                error: false,
                message: '',
                checkValidate: false
            }
        },
        {
            from: {
                error: false,
                message: '',
                checkValidate: false
            },
            to: {
                error: false,
                message: '',
                checkValidate: false
            }
        },
        {
            from: {
                error: false,
                message: '',
                checkValidate: false
            },
            to: {
                error: false,
                message: '',
                checkValidate: false
            }
        },
        {
            from: {
                error: false,
                message: '',
                checkValidate: false
            },
            to: {
                error: false,
                message: '',
                checkValidate: false
            }
        }
    ]

    errYear = {
        error: false,
        message: ''
    }

    constructor(
        private service: SchoolYearService,
        private matDialogRef: MatDialogRef<CreateSchoolYearComponent>,
        private notiService: NotiService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) data: any
    ) {

        this.isDisabled = false
        if (data && data.schoolYear) {
            this.title = this.trans('TITLE_UPDATE')
            const { year, semesterAmount, semesters } = data.schoolYear
            const [start, end] = year.split("-")

            this.year = year
            this.start = start
            this.end = end
            this.semesterAmount = semesterAmount
            this.schoolYears = semesters.map(v => {
                const sy = new SchoolYearModel()
                    sy.createdName = ''
                    sy.updateName = ''
                    sy.id = v.id
                    sy.years = `${this.start}-${this.end}`
                    sy.semester = v.semester
                    sy.semesterAmount = this.semesterAmount
                    sy.fromDate = this.formatDate(v.from_date)
                    sy.toDate = this.formatDate(v.to_date)
                    sy.createdTime = ''
                    sy.updateTime = ''
                return sy
            })
        } else {
            this.title = this.trans('TITLE_CREATE')
            const sy = new SchoolYearModel()
                sy.createdName = ''
                sy.updateName = ''
                sy.id = ''
                sy.years = `${this.start}-${this.end}`
                sy.semester = '1'
                sy.semesterAmount = this.semesterAmount
                sy.fromDate = ''
                sy.toDate = ''
                sy.createdTime = ''
                sy.updateTime = ''
            this.schoolYears = [
                sy
            ]
            this.checkExistYear()
        }

        this.schoolYearsStored = this.schoolYears
    }

    save(): void {
        this.validateYear()

        if (this.errYear.error) {
            this.notiService.showNoti(this.errYear.message, 'error')
            return
        }

        this.validateSchoolYear()
        let error = false
        this.errTime.every((value, index) => {

            if (value.from.error) {
                this.notiService.showNoti(`${this.trans('SEMESTER')} ${this.convertToRoman(index+1)}: ${value.from.message}`, 'error')
                error = true
                return false
            }

            if (value.to.error) {
                this.notiService.showNoti(`${this.trans('SEMESTER')} ${this.convertToRoman(index+1)}: ${value.to.message}`, 'error')
                error = true
                return false
            }

            return true
        })

        if (error) {
            return
        }

        this.isDisabled = true
        this.service.findByYear({years: `${this.start-1}-${this.start}`})
        .subscribe({
            next: resp => {
                if (resp.status !== 'OK') {
                    this.isDisabled = false
                    return
                }

                if (resp.data.length > 0)  {

                    const schoolYear = resp.data[resp.data.length - 1]

                    const schoolYearModel = new SchoolYearModel()
                    schoolYearModel.fromDate = this.formatDate(schoolYear.toDate)
                    schoolYearModel.toDate = this.schoolYears[0].fromDate

                    if ( !this.isSemesterTime(schoolYearModel) ) {
                        this.isDisabled = false
                        this.errTime[0].from.error = true
                        this.errTime[0].from.message = `${this.trans('NOTIFY.START_DATE')} ${this.start-1}-${this.start}`
                        this.notiService.showNoti(this.errTime[0].from.message, 'error')
                        return
                    }
                }

                this.service.findByYear({years: `${this.end}-${parseInt(this.end)+1}`})
                    .subscribe({
                        next: (resp) => {
                            if (resp.data.length > 0) {
                                const schoolYear = resp.data[0]

                                const schoolYearModel = new SchoolYearModel()
                                schoolYearModel.fromDate = this.schoolYears[this.schoolYears.length-1].toDate
                                schoolYearModel.toDate = this.formatDate(schoolYear.fromDate)

                                if ( !this.isSemesterTime(schoolYearModel) ) {
                                    this.isDisabled = false
                                    this.errTime[this.schoolYears.length-1].to.error = true
                                    this.errTime[this.schoolYears.length-1].to.message = `${this.trans('NOTIFY.END_DATE')} ${this.end}-${parseInt(this.end)+1}`
                                    this.notiService.showNoti(this.errTime[this.schoolYears.length-1].to.message, 'error')
                                    return
                                }
                            }
                            this.callApiSave()
                        },
                        error: (resp) => {
                            this.notiService.showNoti(resp, 'error')
                        }
                    })
            },
            error: resp => {
                this.notiService.showNoti(resp, 'error')
            }
        })


    }

    callApiSave(): void {
        this.schoolYears.forEach(value => value.years = `${this.start}-${this.end}`)

        // call api to save
        this.service.createSchoolYear(this.schoolYears)
        .subscribe({
            next: (resp) => {
                if (resp.status !== 'OK') {
                    this.isDisabled = false
                    this.notiService.showNoti(resp.message, 'error')
                    return
                }

                if (this.isUpdateMode()) {
                    this.notiService.showNoti(this.trans('NOTIFY.UPDATE_SUCCESS'), 'success')
                } else {
                    this.notiService.showNoti(this.trans('NOTIFY.CREATE_SUCCESS'), 'success')
                }

                this.matDialogRef.close()
                this.isDisabled = false
            },
            error: (resp) => {
                this.notiService.showNoti(resp.message, 'error')
                this.isDisabled = false
            }
        })
    }

    extends(): void {
        this.isExtends = !this.isExtends
        if (this.isExtends) {
            // call api to extend
            this.service.extends({years: `${this.start}-${this.end}`}).subscribe(resp => {
                this.semesterAmount = resp.data.length
                this.schoolYears = resp.data.map((value) => {
                    value.id = ""
                    const [first, last] = value.years.split("-")

                    const f = new Date(value.fromDate)
                    const t = new Date(value.toDate)

                    if (f.getFullYear() == first) {
                        f.setFullYear(this.start)
                    } else {
                        f.setFullYear(this.end)
                    }

                    if (t.getFullYear() == first) {
                        t.setFullYear(this.start)
                    } else {
                        t.setFullYear(this.end)
                    }

                    value.fromDate = `${f.getFullYear()}-${("0"+(f.getMonth()+1)).slice(-2)}-${("0"+f.getDate()).slice(-2)}`
                    value.toDate = `${t.getFullYear()}-${("0"+(t.getMonth()+1)).slice(-2)}-${("0"+t.getDate()).slice(-2)}`
                    return value
                })
            })
        } else {
            this.schoolYears = this.schoolYearsStored
            this.semesterAmount = this.schoolYears.length+""
        }
    }

    renderSemesters(): void {

        const amount = parseInt(this.semesterAmount)

        if (amount < this.schoolYears.length) {
            this.schoolYears = this.schoolYears.slice(0, amount)
            this.errTime.forEach((value, index) => {
                value.from.error = false
                value.to.error = false
            })
        } else {

            const newValue = Array(amount - this.schoolYears.length).fill(0).map((value, index) => {
                const sy = new SchoolYearModel()
                    sy.years = `${this.start}-${this.end}`
                    sy.semester = `${this.schoolYears.length + index + 1}`
                    sy.semesterAmount = this.semesterAmount
                    sy.createdName = ''
                    sy.updateName = ''
                    sy.id = ''
                    sy.fromDate = ''
                    sy.toDate = ''
                    sy.createdTime = ''
                    sy.updateTime = ''
                return sy
            })

            this.schoolYears.forEach(value => value.semesterAmount = this.semesterAmount)

            this.schoolYears = [...this.schoolYears, ...newValue]
        }
    }

    validateYear(): void {

        if ( this.isEmpty(this.start) ) {
            this.errYear.error = true
            this.errYear.message = this.trans('NOTIFY.YEAR_BLANK')
            return
        }

        const startNumber = parseInt(this.start)

        if (startNumber < SCHOOL_YEAR.MINIMUM_YEAR) {
            this.errYear.error = true
            this.errYear.message = this.trans('NOTIFY.YEAR_INVALID')
            return
        }

        if ( this.isEmpty(this.end) ) {
            this.errYear.error = true
            this.errYear.message = this.trans('NOTIFY.YEAR_BLANK2')
            return
        }

        const endNumber = parseInt(this.end)

        if (endNumber < SCHOOL_YEAR.MINIMUM_YEAR) {
            this.errYear.error = true
            this.errYear.message = this.trans('NOTIFY.YEAR_INVALID2')
            return
        }

        if (startNumber > endNumber) {
            this.errYear.error = true
            this.errYear.message = this.trans('NOTIFY.YEAR_INVALID3')
            return
        }

        if ((endNumber - startNumber) != 1) {
            this.errYear.error = true
            this.errYear.message = this.trans('NOTIFY.YEAR_INVALID4')
            return
        }

        this.errYear.error = this.errYear.message === this.trans('NOTIFY.YEAR_EXIST')

        if (!this.errYear.error)
            this.checkExistYear()

    }

    keyUpStartTime(schoolYear: SchoolYearModel, index: number,event): void {
        const keyCode = event.keyCode
        const isEmpty = this.isEmpty( schoolYear.fromDate )
        if ( (keyCode >= KEYCODE_0 && keyCode <= KEYCODE_9) ) {

            if (isEmpty) {
                this.errTime[index].from.checkValidate = true
                this.errTime[index].from.error = true
                this.errTime[index].from.message = this.trans('NOTIFY.START_DATE_INVALID')
                return
            }
            this.errTime[index].from.checkValidate = false

        }
    }

    keyUpEndTime(schoolYear: SchoolYearModel, index: number, event): void {
        const keyCode = event.keyCode
        if ( (keyCode >= KEYCODE_0 && keyCode <= KEYCODE_9) ) {
            if (this.isEmpty(schoolYear.toDate)) {
                this.errTime[index].to.checkValidate = true
                this.errTime[index].to.error = true
                this.errTime[index].to.message = this.trans('NOTIFY.END_DATE_INVALID')
                return
            }
            this.errTime[index].to.checkValidate = false
        }
    }


    validateStartTime(schoolYear: SchoolYearModel, index: number): void {

        if (this.errTime[index].from.checkValidate) {
            if (this.isEmpty(schoolYear.fromDate)) {
                this.errTime[index].from.error = true
                this.errTime[index].from.message = this.trans('NOTIFY.START_DATE_INVALID')
                return
            }
            this.errTime[index].from.error = false
        }
        this.errTime[index].from.checkValidate = false

        if (this.isEmpty(schoolYear.fromDate)) {
            this.errTime[index].from.error = true
            this.errTime[index].from.message = this.trans('NOTIFY.START_DATE_BLANK')
            return
        }
        this.errTime[index].from.error = false

        if (this.isOutScope(schoolYear.fromDate)) {
            this.errTime[index].from.error = true
            this.errTime[index].from.message = this.trans('NOTIFY.START_DATE_INVALID2')
            return
        }
        this.errTime[index].from.error = false

        if (index > 0) {
            const d1 = new Date(this.schoolYears[index-1].toDate)
            const d2 = new Date(schoolYear.fromDate)

            if (d2.getTime() <= d1.getTime()) {
                this.errTime[index].from.error = true
                this.errTime[index].from.message = `${this.trans('NOTIFY.START_DATE_INVALID3')} ${index}`
                return
            }
            this.errTime[index].from.error = false
        }

        if (!this.isSemesterTime(schoolYear)) {
            this.errTime[index].to.error = true
            this.errTime[index].to.message = this.trans('NOTIFY.END_DATE_INVALID2')
            return
        }
        this.errTime[index].to.error = false

        // if (this.errTime[index].to.message === 'Ngày kết thúc phải lớn hơn ngày bắt đầu' &&
        //     this.errTime[index].to.error === true) {
        //     this.errTime[index].to.error = false
        // }
        // this.errTime[index].from.error = false
    }

    validateEndTime(schoolYear: SchoolYearModel, index: number): void {

        if (this.errTime[index].to.checkValidate) {
            if (this.isEmpty(schoolYear.toDate)) {
                this.errTime[index].to.error = true
                this.errTime[index].to.message = this.trans('NOTIFY.END_DATE_INVALID')
                return
            }
            this.errTime[index].to.error = false
        }
        this.errTime[index].to.checkValidate = false

        if (this.isEmpty(schoolYear.toDate)) {
            this.errTime[index].to.error = true
            this.errTime[index].to.message = this.trans('NOTIFY.END_DATE_BLANK')
            return
        }
        this.errTime[index].to.error = false

        if (this.isOutScope(schoolYear.toDate)) {
            this.errTime[index].to.error = true
            this.errTime[index].to.message = this.trans('NOTIFY.END_DATE_INVALID3')
            return
        }
        this.errTime[index].to.error = false

        if (index < this.schoolYears.length-1) {
            const d1 = new Date(schoolYear.toDate)
            const d2 = new Date(this.schoolYears[index+1].fromDate)

            if (!this.isEmpty(this.schoolYears[index+1].fromDate)) {
                if (d2.getTime() <= d1.getTime()) {
                    this.errTime[index+1].from.error = true
                    this.errTime[index+1].from.message = `${this.trans('NOTIFY.END_DATE_INVALID4')} ${index+2}`
                    return
                }
                this.errTime[index+1].from.error = false
            }
        }

        if (!this.isSemesterTime(schoolYear)) {
            this.errTime[index].to.error = true
            this.errTime[index].to.message = this.trans('NOTIFY.END_DATE_INVALID2')
            return
        }

        // if (this.errTime[index].from.message === 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc' &&
        //     this.errTime[index].from.error === true) {
        //     this.errTime[index].from.error = false
        // }
        this.errTime[index].to.error = false
    }

    validateSchoolYear(): void {
        this.schoolYears.forEach((value, index) => {

            this.validateStartTime(value, index)
            this.validateEndTime(value, index)

        })
    }

    isOutScope(data: string): boolean {
        const d = new Date(data)
        return d.getFullYear() < this.start || d.getFullYear() > this.end
    }

    isSemesterTime(schoolYear: SchoolYearModel): boolean {

        if ( this.isEmpty(schoolYear.toDate) || this.isEmpty(schoolYear.fromDate)) {
            return true
        }

        const start = new Date(schoolYear.fromDate)
        const end = new Date(schoolYear.toDate)

        return end.getTime() > start.getTime()
    }

    isEmpty(data: any): boolean {
        return data == null || data == undefined || data === ''
    }

    checkExistYear(): void {

        if (`${this.start}-${this.end}` === this.year) return

        this.service.findByYear({years: `${this.start}-${this.end}`})
        .subscribe({
            next: resp => {
                if (resp.data.length > 0) {
                    this.errYear.error = true
                    this.errYear.message = this.trans('NOTIFY.YEAR_EXIST')
                }
            }
        })
    }

    formatDate(date: string): string {
        const a = new Date(date);
        return `${a.getFullYear()}-${("0"+(a.getMonth()+1)).slice(-2)}-${("0"+a.getDate()).slice(-2)}`
    }

    convertToRoman(n: number): string {
        if (n == 4) {
            return "IV"
        }
        return "I".repeat(n)
    }

    trans(key): string {
        return this.translate.instant(`SCHOOL_YEAR.CREATE_UPDATE.${key}`)
    }

    isUpdateMode(): boolean {
        return this.year !== '' && this.year !== null && this.year !== undefined
    }
}
