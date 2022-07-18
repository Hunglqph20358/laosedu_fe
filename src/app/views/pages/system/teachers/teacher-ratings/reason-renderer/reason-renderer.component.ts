import { Component, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'kt-reason-renderer',
    templateUrl: 'reason-renderer.component.html',
    styleUrls: ['reason-renderer.component.scss']
})
export class ReasonRendererComponent implements ICellRendererAngularComp {

    isShow
    cellValue
    value
    isApprove = true
    modalRef: BsModalRef
    person
    reason
    textShowReason

    constructor(
        private modalService: BsModalService,
        private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
    }

    agInit(params): void {
        this.cellValue = params.api;
        const {reasonForNotApprove, reasonForNotRating, appover, assessor, assessorName, approverName, statusCode} = params.data
        // this.isShow = status.toLowerCase() === 'Không phê duyệt'.toLowerCase() || status.toLowerCase() === 'Từ chối đánh giá'.toLowerCase()
        // this.isApprove = status.toLowerCase() === 'Không phê duyệt'.toLowerCase()

        this.isShow = ['NotApprove', 'NotRate'].includes(statusCode)
        this.isApprove = statusCode == 'NotApprove'

        this.value = params.data[`statusName${this.translate.currentLang.toUpperCase()}`]
        this.person = this.isApprove ? `${appover} - ${approverName}` : `${assessor} - ${assessorName}`
        this.reason = this.isApprove ? reasonForNotApprove : reasonForNotRating
        this.textShowReason = this.isApprove ? this.translate.instant('TEACHER_RATING.SHOW_REASON_APPROVE_TEXT') : this.translate.instant('TEACHER_RATING.SHOW_REASON_RATE_TEXT')
    }

    refresh(param): boolean {
        return false
    }

    showPopup(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(
            template,
            {class: 'modal-center'}
        )
    }

}