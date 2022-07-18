import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from 'src/app/core/service/service-model/students.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { STUDENTS } from 'src/app/helpers/constants';
import { TranslateService } from '@ngx-translate/core';
import { URL_AVATAR_STUDENT } from '../../../../../helpers/constants';

@Component({
  selector: 'kt-teacher-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tabset', {static: false}) tabset: any;
  @ViewChild('container') divRef: ElementRef;
  unsubscribe$ = new Subject<void>();

  infoStudent: any;
  createdName: string;
  studentCode: number | string = null;
  year: string
  imageUrl = URL_AVATAR_STUDENT
  initTab;
  isLoading

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation() != null) {
      this.initTab = this.router.getCurrentNavigation().extras?.state?.tab;
    }
    this.createdName = JSON.parse(localStorage.getItem('currentUser')).fullName;
    this.route.params.subscribe(param => {
      this.studentCode = param.id;
      this.year = param.year
    });
    

  }

  ngOnInit() {
    const contaier = document.querySelector('.d-flex.flex-column-fluid > div') as HTMLElement
    contaier.style.height = '100vh'
    this.isLoading = true
    if (Boolean(this.studentCode)) {
      this.studentService.getStudentByIdOrCode(this.studentCode, this.year).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: res => {
          this.isLoading = false
          if (res) {
            this.imageUrl = res.avatar ?? URL_AVATAR_STUDENT
            this.infoStudent = res;
            this.infoStudent.status = (res.status || res.status == 0) ? STUDENTS.STATUS[res.status] : null;
            this.infoStudent.trainingSystem = (res.trainingSystem || res.trainingSystem == 0) ? STUDENTS.TRAINING_SYSTEM[res.trainingSystem-1].name : null;
            this.infoStudent.sex = (res.sex || res.sex == 0) ? STUDENTS.SEX[res.sex].name : null;
            this.infoStudent.electFormat = (res.electFormat || res.electFormat == 0) ? STUDENTS.ELECT_FORMAT[res.electFormat].name : null;
            this.infoStudent.graduationType = (res.graduationType || res.graduationType == 0) ? STUDENTS.GRADUATION_TYPE[res.graduationType-1].name : null;
            // this.infoStudent.relationship = (res.relationship || res.relationship == 0) ? STUDENTS.RELATIONSHIP[res.relationship].name : null;
            this.infoStudent.relationShip1 = (res.relationShip1 || res.relationShip1 == 0) ? STUDENTS.RELATIONSHIP[res.relationShip1].name : null;
            this.infoStudent.relationShip2 = (res.relationShip2 || res.relationShip2 == 0) ? STUDENTS.RELATIONSHIP[res.relationShip2].name : null;

            // if (res.avatarByte) {
            //   this.imageUrl = `data:iamge/png;base64,${res.avatarByte}`
            //   this.changeDetectorRef.detectChanges()
            // }
          }
        },
        error: res => {
          console.log(res);
        }
      })
    }
  }

  changeIsLoading(isLoading) {
    this.isLoading = isLoading
  }

  ngOnDestroy() {
    // const contaier = document.querySelector('.d-flex.flex-column-fluid > div') as HTMLElement
    // contaier.style.height = 'auto'
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(): void {
  }
}
