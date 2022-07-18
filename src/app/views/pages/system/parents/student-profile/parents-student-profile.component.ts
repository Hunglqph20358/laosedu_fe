import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClassroomService } from '../../../../../core/service/service-model/classroom.service';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'kt-student-profile',
    template: '',
    styleUrls: []
})
export class ParentsStudentProfileComponent implements OnInit, OnDestroy {

    studentCode
    subscription: Subscription

    constructor(
        private classRoomService: ClassroomService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.studentCode = JSON.parse(localStorage.getItem('currentUser')).login
        this.subscription = this.classRoomService.yearCurrent$.subscribe(year => {
            this.router.navigate([`/system/parents/student-profile/${this.studentCode}/${year}`])
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
