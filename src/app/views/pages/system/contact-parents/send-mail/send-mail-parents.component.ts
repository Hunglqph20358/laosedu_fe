import { forEach } from 'ag-grid-community/dist/lib/utils/array';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  HostListener,
  Renderer2,
  Inject
} from '@angular/core';

import {TreeviewItem} from 'ngx-treeview';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ListTeacherSendMailParentsComponent} from './list-teacher-send-mail-parents/list-teacher-send-mail-parents.component';
import {ContactGroupParentService} from '../../../../../core/service/service-model/contact-parent-group.service';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {Subject, forkJoin} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, FormArray, FormControl } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../../../environments/environment';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'kt-send-mail-parents',
  templateUrl: './send-mail-parents.component.html',
  styleUrls: ['./send-mail-parents.component.scss'],
})
export class SendMailParentsComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private classRoomService: ClassroomService,
    private fb: FormBuilder,
    private contactGroupParentService: ContactGroupParentService,
    private changeDetectorRef: ChangeDetectorRef,
    private toast: ToastrService,
    private matDialog: MatDialog,
    private translate: TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
    // private TreeViewComponent
  ) {
    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    this.loginCode = JSON.parse(localStorage.getItem('currentUser')).login;
    // check role gvcn
    if (this.currentRoles && this.currentRoles.length > 0) {
      this.currentRoles.forEach(e=>{
        if(e === this.GVCN){
          this.roleGVCN = 1;
          // List class cn
          this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
            this.classRoomService.getByTeacherCodeAndYear(this.loginCode, value).subscribe(res=>{
              this.listClass = res;
            })
          });
        }
      })
      if(this.roleGVCN === 1){
        this.currentRoles.forEach(e=>{
          if(e === this.ADMIN || e === this.HT || e === this.HP || e === this.TK){
            this.roleHT = 1;
          }
          if(e === this.HT || e === this.ADMIN){
            this.roleHTCheck = 1;
          }
        })
      }
    }
  }

  mailTypes: any = [
    {label: this.trans('TYPE_MESSAGE.NOTIFICATION'), value: '0'},
    {label: this.trans('TYPE_MESSAGE.RESULT'), value: '1'},
    {label: this.trans('TYPE_MESSAGE.DILIGENCE'), value: '2'}
  ];
  mailFormGroup = this.fb.group({
    title: [null],
    content: [null],
    files: [[]],
    send_type: [null],
    mailType: ['0'],
    smsContent: [null],
    allowUnicode: [true],
  });
  listTreeViewParentRaw: any = {};
  listGroupParentRaw: any = [];
  schoolInfo = JSON.parse(sessionStorage.getItem('schoolInfo'));
  private unsubscribe$ = new Subject();

  items1 = [];
  config1 : any = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 220,
    hasSelectByGroup: true,
    selectByGroupValue: false,
    showCheckbox: true,
    checkboxEnabled: true,
  }
  result1 = [];
  items2 = [];
  config2 = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 220,
    hasSelectByGroup: false,
    hasDivider: true,
    selectByGroupValue: true,
    showCheckbox: true,
    checkboxEnabled: true
  }
  result2 = [];
  loading = false;
  selectedLabel = this.mailTypes[0].label;
  currentRoles;
  roleGVCN = 0;
  roleHT = 0;
  roleHTCheck = 0;
  totalSMSGroup = 0;
  currenYear;
  GVCN = `${environment.ROLE.GV_CN}`;
  ADMIN = `${environment.ROLE.ADMIN}`;
  HT = `${environment.ROLE.HT}`;
  HP = `${environment.ROLE.HP}`;
  TK = `${environment.ROLE.TK}`;
  isView = false;
  isView2 = false;
  loginCode;
  listClass: any[];
  teacher;
  // On Change Value when typing
  isNotAllowUnicode = false;
  showMessage = false;

  listAllSchool;

  checkDisplayButtonSend = true;
  ngOnInit(): void {
    //this.addHiddenToElement();
    // this.mailFormGroup.get('mailType').setValue('0');
    this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      if (value) {
        this.getListTree(value)
      }
    });
    this.setSMSContent(this.mailFormGroup.value.mailType, this.mailFormGroup.value.allowUnicode);
    this.setTitle(this.mailFormGroup.value.mailType);
    this.setContent(this.mailFormGroup.value.mailType);
    this.mailFormGroup.get('mailType').valueChanges.subscribe(value => {
      this.setSMSContent(value, this.mailFormGroup.value.allowUnicode);
      this.setTitle(value);
      this.setContent(value);
    });
    this.mailFormGroup.get('allowUnicode').valueChanges.subscribe(value => {
      this.setSMSContent(this.mailFormGroup.value.mailType, value);
    })
    this.mailFormGroup.get('smsContent').setValidators([this.validateSmsContent()])
  }
  // On Change Label Detect
  onChangeLabel(value){
    this.mailTypes.forEach((item) =>{
      if(item.value === value){
        this.selectedLabel = item.label;
      }
    })

    this.onChangeValue();
  }
  getListParentTreeView(value): void {
    this.loading = true;
    this.contactGroupParentService.getListParentTreeView(value).subscribe(res => {
      this.loading = false;
      this.listTreeViewParentRaw = res.body.response;
      this.items1 = res.body.response?.gradeList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true, null, item)));
      this.changeDetectorRef.detectChanges();
    })
  }

  getListTree(year): void {
    this.loading = true;
    this.changeDetectorRef.detectChanges();
    forkJoin([
      this.contactGroupParentService.getListParentTreeView(year),
      this.contactGroupParentService.getListTreeView({currentYear: year})
    ]).subscribe(([res1, res2]) => {

      this.listTreeViewParentRaw = res1.body.response;
      this.items1 = res1.body.response?.gradeList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true, null, item)));

      this.listGroupParentRaw = res2.body.response;
      this.items2 = res2.body.response?.map(item => new TreeviewItem(this.transformListGroupToTreeViewItems(item, true)));

      const listGrade = [];
      const list: any ={};


      for(let i=0; i< res1?.body?.response?.gradeList?.length ; i++){
        listGrade.push(res1?.body?.response?.gradeList[i]?.id);
        if(i===res1?.body?.response?.gradeList?.length-1){
          list.listGradeId = listGrade;
          list.years = year;
          this.contactGroupParentService.findAllClassRoomOfGrade(list).subscribe(res=>{
            this.listAllSchool = res;
            this.loading = false;
            this.changeDetectorRef.detectChanges();
          })
        }
      }
    });
  }

  transformListGroupToTreeViewItems(data: any, isRoot: boolean): any {
    if (isRoot) data.level = 1
    else data.level = 2.6
    const children = data.groupParentsDetailsDTOList?.map(child => this.transformListGroupToTreeViewItems(child, false));
    const text =  data.name ?? data.studentCode+' - '+ data.fullName;
    // tslint:disable-next-line:max-line-length
    const groupName = data.parentGroupCode ? this.listGroupParentRaw.find(tree => tree.code === data.parentGroupCode)?.name : this.listGroupParentRaw.find(tree => tree.code === data.code)?.name;
    const groupCode =  data.parentGroupCode;
    const value = {
      groupName: groupName ?? '',
      groupCode: groupCode ?? '',
      isRoot,
      data,
      teacherId: data.studentId,
      teacherName: data.fullName,
      isTeacher: data.fullName && data.studentCode,
      totalTeachersOfUnit: data.totalStudents,
      text,
      level: data.level
    };
    return {...data, text, value, checked: false, collapsed: true, children};
  }

  transformToTreeViewItems(data: any, isRoot: boolean, parent?: any, grade?: any, selected?): any {
    if (isRoot) data.level = 1
    else data.level = parent.level + 1
    const children = (data.classRoomList ?? data.studentList)?.map(child => this.transformToTreeViewItems(child, false, data, grade, selected));
    const text = data.name ?? data.code + ' - ' + data.fullName ?? '';
    const isTeacher =  data.fullName && data.code;
    const groupName = isTeacher ? parent?.name : data.name;
    const groupCode = isTeacher ? parent?.code : data.code;
    const value = {
      groupName,
      groupCode,
      grade :grade ?? null,
      isRoot,
      data,
      isTeacher,
      parent,
      key: data.key,
      teacherId: data.id,
      teacherName: data.fullName,
      totalTeachersOfUnit: data.studentOfClassroomTotal ?? data.studentOfGradeTotal,
      text,
      level: data.level
    };
    return {...data, text, value, checked: typeof selected === 'boolean', collapsed: true, children};
  }

  onFileChange($event: any) {
    this.mailFormGroup.get('files').patchValue([...this.mailFormGroup.get('files').value, ...$event.target.files]);
  }

  removeFile(i: number) {
    const files = Array.from(this.mailFormGroup.value.files);
    files.splice(i, 1);
    this.mailFormGroup.get('files').patchValue(files);
  }
  // Check for Loading Icon

  isRequiredAndUnicode(){
    const element  = (document.getElementsByClassName('custom-class'))[0].textContent ?(document.getElementsByClassName('custom-class'))[0].textContent:'';
    console.log((document.getElementsByClassName('custom-class'))[0].textContent);
    const message  = this.mailFormGroup.get('smsContent').value;
    const title = this.mailFormGroup.get('title').value;
    this.loading = !(element === null || element === '' || message === null || message === '' || title === null || title === '' || this.showMessage === true);
  }

  sendMail() {
    // const recursive = (f: FormGroup | FormArray) => {
    //   for (const i in f.controls) {
    //     if (typeof f.controls[i].value === 'string') {
    //       if (!Boolean(f.controls[i].value)) {
    //         f.controls[i].value = null;
    //       } else {
    //         f.controls[i].value = f.controls[i].value.trim();
    //       }
    //     }
    //     if (f.controls[i] instanceof FormControl) {
    //       f.controls[i].markAsDirty();
    //       f.controls[i].updateValueAndValidity();
    //     } else {
    //       recursive(f.controls[i] as any);
    //     }
    //   }
    // };
    // recursive(this.mailFormGroup);
    // this.mailFormGroup.enable()
    //
    // debugger

    if(this.mailFormGroup.invalid || !this.checkDisplayButtonSend){
      return;
    }

    // this.loading = true;
    const message  = this.mailFormGroup.get('smsContent').value;
    const title = this.mailFormGroup.get('title').value;
    const formData = new FormData();
    const sendMessageDTO: any = {
      title: title?title.trim():'',
      contentWeb: this.mailFormGroup.value.content?this.mailFormGroup.value.content.trim():'',
      sendType: this.sendType(),
      contentSms: message,
      notAllowUnicode:this.mailFormGroup.value.allowUnicode,
      showMessage: this.showMessage,
      contentType: this.mailFormGroup.value.allowUnicode ? 1 : 0,
      type: this.mailFormGroup.value.mailType,
      currentYear: this.classRoomService.yearCurrent.getValue(),
      numberSMS: this.countSMS()
    };
    if (this.sendType() === '3' || this.sendType() === '2') {
      let listTeacher;
      if (this.result2.length > 0) listTeacher = this.result2.filter(r => r.isTeacher && r.teacherId);
      else listTeacher = this.result1.filter(r => r.isTeacher && r.teacherId);
      const listGroup = [... new Set(listTeacher.map(e => e.groupCode))];
      sendMessageDTO.receiverMessageDTOList = listGroup.map(group => {
        const result = {code: null, studentIdList: null};
        result.code = group;
        result.studentIdList = listTeacher.filter(r => r.groupCode === group).map(r => r.teacherId);
        return result;
      });
      if(this.sendType() === '3'){
        const arrStudentID = new Set();
        sendMessageDTO.receiverMessageDTOList.forEach(element => {
          element.studentIdList.forEach(studentId => {
            arrStudentID.add(studentId);
          });
          element.studentIdList = [];
        });
        sendMessageDTO.receiverMessageDTOList[0].studentIdList = Array.from(arrStudentID);
      }
    } else if (this.sendType() === '1') {

      const listTeacher = this.result1.filter(r => r.isTeacher && r.teacherId);
      const listGroup = [... new Set(listTeacher.map(e => e.grade.code))];

      sendMessageDTO.receiverMessageDTOList = listGroup.map(group => {
        const result = {code: null, studentIdList: null};
        result.code = group;
        result.studentIdList = listTeacher.filter(r => r.grade.code === group).map(r => r.teacherId);
        return result;
      });
    } else {
      sendMessageDTO.studentIdList = this.listRecipientStudentId();
    }

    if (this.mailFormGroup.value.files) {
      if (Array.from(this.mailFormGroup.value.files).some((file: any) => file.size > 5 * 1024 * 1024)) {
        this.toast.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.SIZE'));
        return;
      }
      Array.from(this.mailFormGroup.value.files).forEach((file: any) => {
        formData.append('file', file);
      })
    }

    formData.append('sendMessageDTO', new Blob([JSON.stringify(sendMessageDTO)], {type: 'application/json'}));
    this.isRequiredAndUnicode();
    this.contactGroupParentService.sendMail(formData).subscribe(res => {
          if (res.status === 'OK') {
            this.toast.success(res.message);
            this.resetPageData();
            this.mailFormGroup.get('allowUnicode').setValue(true);
            this.mailFormGroup.get('smsContent').setValue(null);
            this.loading = false;
            this.changeDetectorRef.detectChanges();
          } else {
          this.toast.error(res.message);
          this.loading = false;
          // Debugger
          console.log("Content SMS");
          console.log(sendMessageDTO.contentSms);
          this.mailFormGroup.controls.smsContent.setValue(sendMessageDTO.contentSms);
          this.changeDetectorRef.detectChanges();
        }
      }, err => {
        this.toast.error(err.message);
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },() =>{
        this.loading = false;
      });
   }








  listRecipientStudentId(): any {
    if (this.result2.length > 0) return this.result2.filter(r => r.isTeacher).map(r => r.teacherId);
    else return this.result1.filter(r => r.isTeacher).map(r => r.teacherId);
  }


  treeviewValueChange(e: any) {
    this.result1 = e;
    console.log(this.result1);
    if (this.result1.length)
      // this.countSMSGroup(this.result1[0].groupCode);

    if(this.result1[0].totalTeachersOfUnit !== 0)
      this.countSMSGroup(this.result1[0].groupCode);
    else
      this.countSMSGroup(this.result1[1].groupCode);
    this.config2.checkboxEnabled = this.result1.length === 0 && !this.config1.selectByGroupValue;
    if(this.result1.filter(item=>item?.isTeacher!==undefined).length > 1000){
      this.checkDisplayButtonSend = false;
      this.toast.error(this.translate.instant('PARENT_CONTACT.OVER_USER'));
    }else {
      this.checkDisplayButtonSend = true;
    }
    this.changeDetectorRef.detectChanges();
  }

  groupTeacherValueChange(e: any) {
    this.result2 = e;

    if(this.result2.filter(item=>item?.isTeacher!==undefined).length >1000){
      this.checkDisplayButtonSend = false;
      this.toast.error(this.translate.instant('PARENT_CONTACT.OVER_USER'));
    }else {
      this.checkDisplayButtonSend = true;
    }

    this.config1.checkboxEnabled = this.result2.length === 0;
    this.changeDetectorRef.detectChanges();
  }

  sendType(): any {
    if (this.result2.length > 0) return '3';
    else {
      if ( this.items1.length && this.items1.every(item => item.internalChecked && item.internalChildren.every(item1=> item1.value.data.studentOfClassroomTotal!==0) ) && this.roleHTCheck ===1){
        return '0';
      }
        else {
          if (this.config1.selectByGroupValue) {
            const listGrade = [];
            this.result1.forEach(item => {
              if (listGrade.every(i => i?.code !== item?.grade?.code)) listGrade.push(item?.grade);
            });
            const isClassPick = listGrade.some(item => {
              let count =0;

              if(item === null || item === undefined){
                return null;
              }

              const countClass = item?.classRoomList?.length;
              console.log('listAllSchool', this.listAllSchool);
              const gradeInfor = this.listAllSchool.data.filter(r => r.gradeCode===item.code);
              const totalClass = gradeInfor[0]?.classOfGrade;

              for(let i=0;i < item?.classRoomList?.length; i++){
                if(item.classRoomList[i].studentOfClassroomTotal===0){
                  count++;
                  break;
                }
              }
              console.log('count',count);
              console.log('countClass',countClass);
              console.log('totalClass',totalClass);
              console.log('return',count !==0 || countClass !== totalClass)

              return (this.result1.filter(i => i?.isTeacher && i?.grade?.code === item?.code)?.length !== item?.studentOfGradeTotal) || count !==0 || countClass !== totalClass
              // return (count !==0 || countClass !== totalClass);
            });



            if (isClassPick) {
              console.log('vao2');
              return '2';
            }
            else {
              console.log('vao1');
              return '1';
            }
          }
          else {
            return '4';
          }
        }
    }
  }

  listRecipientTeacher(): any {
    if (this.result2.length > 0) return [...new Set(this.result2.filter(r => r.isTeacher).map(r => r.text))];
    else return this.result1.filter(r => r.isTeacher).map(r => r.text);
  }

  listRecipientGroup(): any {
    if (this.result2.length > 0) {
      const listGroupCode = [];
      const resultReturn = [];
      for(let i=0; i< this.result2.length; i++){
        if(!listGroupCode.includes(this.result2[i].groupCode)){
          listGroupCode.push(this.result2[i].groupCode);
          resultReturn.push(this.result2[i]);
        }
      }
      return resultReturn;
    }
    const grades = [];
    let result = [];
    this.result1.forEach(r => {
      if (grades?.every(g => g?.code !== r?.grade?.code)) grades.push(r?.grade);
    });
    grades.forEach(g => {
      // const numberOfStudent = [... new Set(this.result1?.filter(r => r?.grade?.code === g?.code).map(r => r?.groupCode))]?.length;

      let count0 =0;
      let count1 =0;
      g?.classRoomList?.forEach(item=>{
        if(item?.studentOfClassroomTotal===0){
          count0++;
        }else {
          count1++;
        }
      })

      console.log('gradeCheck',g);
      // console.log('numberOfStudent',numberOfStudent);

      const gradeInfor = this.listAllSchool.data.filter(r => r.gradeCode===g?.code);
      const totalClass = gradeInfor[0]?.classOfGrade;

      console.log('totalClass',totalClass);

      // if(count0 ===0 && numberOfStudent === g?.classOfGradeTotal && g?.classOfGradeTotal===totalClass){
      if(count0 ===0 && g?.classOfGradeTotal===totalClass){
        const grade : any = g
        result.push(grade);
      }else {
        const classes0 = [...new Set(this.result1.filter(r => r?.grade?.code === g?.code && r?.totalTeachersOfUnit !== 0).map(r => r))];
        const classCode = [];
        const classes = [];
        for( let i =0; i< classes0.length; i++){
          if (!classCode.includes(classes0[i].groupCode)) {
            classCode.push(classes0[i].groupCode);
            classes.push(classes0[i]);
          }

          // result = result.concat(classes);
          // this.countSMSGroup(result[0]?.groupCode);
          // if(this.listClass?.find(e => e?.code === result[0]?.groupCode)){
          //   this.isView = true;
          // }
          // // result1 = result1.concat(classes1);
          // // result2 = result2.concat(classes2);

        }
        result = result.concat(classes);
      }
    });
    this.isView2 = this.isView && this.roleGVCN === 1 && result.length === 1 && ![undefined, null].includes(this.listClass.find(clazz => clazz.code == result[0].groupCode))
    return result
  }

  uncheckbox(item) {
    item?.internalChildren?.forEach( child => {
      child.internalChecked = false
      child.checked = false

      if (child.internalChildren) {
        this.uncheckbox(child)
      }
    })
  }

  removeGroup(text) {
    if(this.config1.treeviewAll.checked) this.config1.treeviewAll.checked = false;
    const result = this.result1.length ? this.result1 : this.result2;

    const items = this.result1.length ? this.items1 : this.items2;
    const listClass = result.filter(r =>
      text.code ? r.grade?.code === text.code : r.groupCode == text.groupCode
    );
    listClass.forEach(c => {
      // const data = this.findItemNested(items, c.isTeacher, c.groupCode);
      // data.internalChecked = false;
      // data.checked = false;
      const index = result.findIndex(r =>
        r.groupCode === c.groupCode
      );
      result.splice(index, 1);
    })
    const dataParents = this.findDeptByName(items, text.groupCode || text.code);
    dataParents.forEach(d => {
      d.internalChecked = false;
      d.checked = false;

      this.uncheckbox(d)


      this.items1.forEach(item=>{
        if(item.internalChildren){
          if (item.internalChildren.every(item1 => item1.internalChecked===true)) {
            item.internalChecked = true;
            return
          }else{
            item.internalChecked = false;
          }
        }else {
          item.internalChecked = false;
        }
      })


    })

    if(result.filter(item=>item?.isTeacher!==undefined).length >1000){
      this.checkDisplayButtonSend = false;
      this.toast.error(this.translate.instant('PARENT_CONTACT.OVER_USER'));
    }else {
      this.checkDisplayButtonSend = true;
    }

    // Kt list xoa
    // if(result.length === 1){
    //   // this.totalSMSGroup(result.gr)
    //   console.log(result[0]);
    // }
    console.log(result)
      console.log(result[0]);
    if(this.isView === true && result !== null){
      if(result[0].totalTeachersOfUnit !== 0)
        this.countSMSGroup(result[0].groupCode);
      else
        this.countSMSGroup(result[1].groupCode);
    }
    this.config1.checkboxEnabled = this.result2.length === 0;
    this.config2.checkboxEnabled = this.result1.length === 0 && !this.config1.selectByGroupValue;
    this.changeDetectorRef.detectChanges();
  }

  findDeptByName(arr, text?): any {
    if(!arr?.length) return;
    const result = arr.filter(elm => {
      return elm.value.data.code === text
    })
    return result && result.length > 0 ? result : this.findDeptByName(arr.flatMap(elm => elm.children || []), text)
  }


  shouldShowBtn(listTeacher: any) {
    return listTeacher.offsetWidth < listTeacher.scrollWidth;
  }

  listRecipientTeacherCode(): any {
    if (this.result2.length > 0) return this.result2.filter(r => r.isTeacher).map(r => r.isTeacher);
    else return this.result1.filter(r => r.isTeacher).map(r => r.isTeacher);
  }

  openDialog(): void {
    this.matDialog.open(ListTeacherSendMailParentsComponent, {
      data: this.result2.length > 0 ? this.result2.filter(r => r.isTeacher) : this.result1.filter(r => r.isTeacher),
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      width: '800px',
    }).afterClosed().subscribe(res => {
      if (!res) return;
      res.forEach(item => {
        const data = this.findItemNested(this.items1, item);
        data.checked = false;
        const index = this.result1.findIndex(r => r.isTeacher === data.value.isTeacher);
        this.result1.splice(index, 1);
      })
      this.config1.checkboxEnabled = this.result2.length === 0;
      this.config2.checkboxEnabled = this.result1.length === 0 && !this.config1.selectByGroupValue;
      this.changeDetectorRef.detectChanges();
    });
  }

  findItemNested(arr, itemId, parentCode?): any {
    if(!arr?.length) return;
    return arr.find(elm => {
    //   return parentName ? (elm.value.isTeacher === text && elm.value.grade.name === parentName) : elm.value.isTeacher === text;
    // }) ?? this.findItemNested(arr.flatMap(elm => elm.children || []), text, parentName);
      return parentCode ? (elm.value.groupCode === parentCode && elm.value.isTeacher === itemId) : (elm.value.isTeacher === itemId)
      // return elm.value.isTeacher == itemId && elm.value.groupCode == parentCode
    }) ?? this.findItemNested(arr.flatMap(elm => elm.children || []), itemId, parentCode);
  }

  navigateTo() {
    this.router.navigate(['system/contact-parents/contact-group'], { state: { openCreateDialog: true } });
  }

  log(text: string) {
    console.log(text)
  }

  resetPageData() {
    // this.mailFormGroup.reset();
    const value = '0';
    this.onReset(value);
    this.mailFormGroup.get('files').patchValue([]);
    // this.getListParentTreeView();
    this.items1 = this.listTreeViewParentRaw.gradeList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true)));
    // this.getListGroupParents(this.classRoomService.yearCurrent.getValue());
    this.items2 = this.listGroupParentRaw?.map(item => new TreeviewItem(this.transformListGroupToTreeViewItems(item, true)));
    this.config1.selectByGroupValue = false;
    this.changeDetectorRef.detectChanges();
  }
  onReset(value){
    this.mailTypes.forEach((item) =>{
      if(item.value.localeCompare(value)){
        this.mailFormGroup.get('mailType').patchValue(value);
      }
    });
  }

  selectByGroupValueChange($event: any) {
    this.isView = $event;
    this.items1 = this.listTreeViewParentRaw.gradeList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true, null, item)));
    this.config2.checkboxEnabled = this.result1.length === 0 && !this.config1.selectByGroupValue;
  }
  setSMSContent(mailType, allowUnicode) {
    let text = null;
    const currentLocationDomain = window.origin+'/';
    if (mailType === '1') {
      if (allowUnicode) {
        text = this.trans('SMS_CONTENT.SAMPLE_UNICODE1', {website: currentLocationDomain})
      } else {
        text = this.trans('SMS_CONTENT.SAMPLE_NON_UNICODE1', {website: currentLocationDomain})
      }
    }
    if (mailType === '2') {
      if (allowUnicode) {
        text = this.trans('SMS_CONTENT.SAMPLE_UNICODE2', {website: currentLocationDomain})
      } else {
        text = this.trans('SMS_CONTENT.SAMPLE_NON_UNICODE2', {website: currentLocationDomain})
      }
    }
    this.mailFormGroup.get('smsContent').patchValue(text);
  }
  // onChangeValue() {
  //   const regex = /^[a-zA-Z0-9\s]*$/;
  //   let value = this.mailFormGroup.get('smsContent').value;
  //   let isAllowUnicode = this.mailFormGroup.get('allowUnicode').value;
  //  console.log(value)
  //   if(!isAllowUnicode){
  //     if (!regex.test(value)) {
  //         this.mailFormGroup.controls['smsContent'].setValue(value.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  //     }
  //   }else{

  //   }
  onChangeValue() {
    const regex = /^[a-zA-Z0-9\s\/\:\-\[\]\\…………\.]*$/;
    // let value = this.mailFormGroup.get('smsContent').value;
    const isAllowUnicode = this.mailFormGroup.get('allowUnicode').value;
    const message  = this.mailFormGroup.get('smsContent').value;
    // console.log(message);
    // console.log(this.showMessage);
    if(!isAllowUnicode){
      if (!regex.test(message)) {
        this.showMessage = true;
        return true;
      }else{
        this.showMessage = false;
        return false;
      }
    }else{

    }
  }
  // }
  // Check ctrl+V
  @HostListener('window:keydown',['$event'])
  onKeyPress($event: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9\s\/\:\-\[\]\\…………\.]*$/;
    // let value = this.mailFormGroup.get('smsContent').value;
    // let isAllowUnicode = this.mailFormGroup.get('allowUnicode').value;
    // console.log(value);
    if(($event.ctrlKey || $event.metaKey) && $event.keyCode === 86){
      //   console.log('Ctrl + V');
      //   let value = this.mailFormGroup.get('smsContent').value;
      //   let isAllowUnicode = this.mailFormGroup.get('allowUnicode').value;
      // //  console.log(value)
      //   if(!isAllowUnicode){
      //     console.log(regex.test(value));
      //     if (!regex.test(value)) {
      //       this.showMessage = true;
      //       return true;
      //     }else{
      //       this.showMessage = false;
      //       return false;
      //     }
      //   }else{

      //   }
      // }else{
      // }
      this.onChangeValue();
    }
    if((($event.ctrlKey || $event.metaKey) && $event.keyCode === 67)){
      this.onChangeValue();
    }
  }


  countSMS() {
    const max = this.mailFormGroup.value.allowUnicode ? 70 : 160;
    return Math.ceil((this.mailFormGroup.value.smsContent?.length ?? 0) / max);
  }

  setTitle(mailType) {
    let text = null;
    const schoolName = {schoolName: this.schoolInfo?.name}
    if (mailType === '0') {
      // text = `[${this.schoolInfo?.name}] Thông báo ……`;
      text = this.trans('NOTIFICATION_TITLE.SAMPLE1', schoolName)
    }
    if (mailType === '1') {
      // text = `[${this.schoolInfo?.name}] Thông báo kết quả học tập`;
      text = this.trans('NOTIFICATION_TITLE.SAMPLE2', schoolName)
    }
    if (mailType === '2') {
      // text = this.schoolInfo?.name +  ` Thông báo thông tin chuyên cần tháng…`;
      text = this.trans('NOTIFICATION_TITLE.SAMPLE3', schoolName)
    }
    this.mailFormGroup.get('title').patchValue(text);
  }
  setContent(mailType) {
    let text = null;
    if (mailType === '1') {
      text =`<span>${this.trans('NOTIFICATION_CONTENT.SAMPLE1')} <strong>${this.trans('NOTIFICATION_CONTENT.SCORE')}</strong></span>`;
    }
    if (mailType === '2') {
      text = `<span>${this.trans('NOTIFICATION_CONTENT.SAMPLE2')} <strong>${this.trans('NOTIFICATION_CONTENT.DILIGENCE')}</strong></span>`;
    }
    this.mailFormGroup.get('content').patchValue(text);
  }

  keydown(event: KeyboardEvent) {
    if (event.key === '&') {
      if(event.keyCode !== 8){
        event.preventDefault()
      }
    }else{
      event.returnValue = true;
    }

  }

  validateSmsContent(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const value = (formGroup.value + '')?.trim().length

      const allowUnicode = this.mailFormGroup.get('allowUnicode').value
      if (allowUnicode && value > 355) {
        return {length: true}
      }

      if (!allowUnicode && value > 765) {
        return {length: true}
      }

      return null;
    }
  }

  trans(KEY: string, params?): string {
    return this.translate.instant(`PARENT_CONTACT.SEND_MAIL.${KEY}`, params)
  }

  onReloadData($event: boolean) {
    this.items1 = this.listTreeViewParentRaw?.gradeList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true, null, item, $event)));
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  countSMSGroup(code: string){
    this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.currenYear = value;
      this.contactGroupParentService.countMess(code, this.currenYear).subscribe(res=>{
        if(res !== null)
          this.totalSMSGroup = res;
        else
          this.totalSMSGroup = 0;
        this.changeDetectorRef.detectChanges();
      })
    });
    this.changeDetectorRef.detectChanges();
  }


  getYear(){
    this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.currenYear = value;
    });
  }
}
