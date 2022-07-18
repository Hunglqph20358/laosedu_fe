import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TreeviewConfig, TreeviewItem, TreeviewModule} from "ngx-treeview";
import {FormBuilder, Validators} from "@angular/forms";
import {ContactGroupService} from "../../../../../core/service/service-model/contact-group.service";
import {ToastrService} from "ngx-toastr";
import {CreateGroupComponent} from "../contact-group/create-group/create-group.component";
import {MatDialog} from "@angular/material/dialog";
import {ListTeacherSendMailComponent} from "./list-teacher-send-mail/list-teacher-send-mail.component";
import {Router} from "@angular/router";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss']
})
export class SendMailComponent implements OnInit {
  mailFormGroup = this.fb.group({
    title: [null,[Validators.required]],
    content: [null, [Validators.required]],
    files: [[]],
    send_type: [null],
  });
  listTreeViewTeacherRaw: any = {};
  listGroupTeacherRaw: any = [];
  hide;

  listRecipientGroupName = [];
  listReceiverStore = []

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private contactGroupService: ContactGroupService, 
    private changeDetectorRef: ChangeDetectorRef, 
    private toast: ToastrService, 
    private matDialog: MatDialog,
    private translate: TranslateService) {}

  items1 = [];
  config1 = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 220,
    hasSelectByGroup: true,
    selectByGroupValue: false,
    // customFilter: true,
    showCheckbox: true,
    checkboxEnabled: true
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
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '300px',
    maxHeight: '300px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Nhập nội dung tin nhắn',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  ngOnInit(): void {
    this.getListTeacherTreeView();
    this.getListGroupTeacher();
  }

  getListTeacherTreeView(searchText?: string): void {
    this.hide = searchText === undefined ? false : true;
    const selected = this.result1.filter(r => r.isTeacher).map(r => r.isTeacher);
    this.contactGroupService.getListTeacherTreeView(searchText).subscribe(res => {
      this.hide = true;
      this.listTreeViewTeacherRaw = res.body.response;
      this.items1 = res.body.response?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true, null, selected)));
      this.changeDetectorRef.detectChanges();
    })
  }

  getListGroupTeacher(): void {
    this.contactGroupService.getListTreeView().subscribe(res => {
      this.listGroupTeacherRaw = res.body.response;
      this.items2 = res.body.response?.map(item => new TreeviewItem(this.transformListGroupToTreeViewItems(item, true)));
      this.changeDetectorRef.detectChanges();
    })
  }

  transformListGroupToTreeViewItems(data: any, isRoot: boolean): any {
    if (isRoot) data.level = 1
    else data.level = 2.6
    const children = data.groupTeacherDetailsDTOList?.map(child => this.transformListGroupToTreeViewItems(child, false));
    const text = data.name ?? data.teacherCode + ' - ' + data.fullName ?? '';
    // tslint:disable-next-line:max-line-length
    const group = data.parentGroupCode ? this.listGroupTeacherRaw.find(tree => tree.code === data.parentGroupCode) : this.listGroupTeacherRaw.find(tree => tree.code === data.code);
    const value = {
      groupName: group?.name ?? '',
      groupCode: group?.code ?? '',
      isRoot,
      isTeacher: data.fullName && data.teacherCode,
      teacherId: data.teacherId,
      teacherName: data.fullName,
      totalTeachersOfUnit: isRoot ? data.totalTeacherDetails : null,
      text,
      level: data.level
    };
    return {...data, text, value, checked: false, collapsed: true, children};
  }

  transformToTreeViewItems(data: any, isRoot: boolean, parent?: any, selected?: any): any {
    if (isRoot) {
      data.level = 1
    } else data.level = parent.level + 1
    const children = ([...(data.children ?? []),  ...(data.teacherDTOList ?? [])])?.map(child => {
      return this.transformToTreeViewItems(child, false, data, selected)
    });

    const deptChild = [...(data.children ?? [])]?.map(deptChild => {
      return this.transformToTreeViewItems(deptChild, false, data, selected)
    })

    const text = data.departmentName ?? data.code + ' - ' + data.fullName ?? '';
    const groupName = data.deptName ?? data.departmentName;
    const groupCode = data.deptCode ?? data.departmentCode;
    const value: any = {
      groupName: groupName ?? '',
      groupCode: groupCode ?? '',
      isRoot,
      parentKey: parent?.key,
      parentName: parent?.departmentName,
      parentCode: parent?.departmentCode,
      key: data?.key,
      isTeacher: data.fullName && data.code,
      teacherId: data.id,
      teacherName: data.fullName,
      totalTeachersOfUnit: data.totalTeachersOfUnit != null && data.totalTeachersOfUnit !== undefined ? data.totalTeachersOfUnit : null,
      text,
      deptChild,
      level: data.level
    };
    return {...data, text, value, checked: typeof selected === 'boolean' ? selected : selected?.includes(value.isTeacher) ?? false ,collapsed: true, children};
  }

  onFileChange($event: any) {
    this.mailFormGroup.get('files').patchValue([...this.mailFormGroup.get('files').value, ...$event.target.files]);
  }

  removeFile(i: number) {
    const files = Array.from(this.mailFormGroup.value.files);
    files.splice(i, 1);
    this.mailFormGroup.get('files').patchValue(files);
  }

  sendMail() {
    const formData = new FormData();
    const sendMessageDTO: any = {
      title: this.mailFormGroup.value.title?.trim(),
      content: this.mailFormGroup.value.content?.trim(),
      sendType: this.sendType(),
    };
    if (this.sendType() === '2' || this.sendType() === '1') {
      let listTeacher;
      if (this.result2.length > 0) listTeacher = this.result2.filter(r => r.teacherId);
      else listTeacher = this.result1.filter(r => r.teacherId);
      let listGroup = [... new Set(listTeacher.map(e => e.groupCode))];

      if (this.sendType() === '1') {
        debugger
        const listGroupFake = []
        this.listReceiverStore.forEach(name => {
          const dept = this.findDeptByName(this.items1, name)
          listGroupFake.push(dept[0])
        })
        if (listGroupFake.length) listGroup = listGroupFake

        sendMessageDTO.receiverMessageDTOList = listGroup.map((group: any) => {
          const children = this.findChildren(group, 'departmentCode')
          console.log(listTeacher)
          const result = {code: null, teacherIdList: null};
          result.code = group.value.groupCode;
          result.teacherIdList = listTeacher.filter(r => r.groupCode === group.value.groupCode || children.includes(r.parentCode)).map(r => r.teacherId);
         
          return result;
        });        
      }
     
      if(this.sendType() === '2'){
        sendMessageDTO.receiverMessageDTOList = listGroup.map(group => {
          const result = {code: null, teacherIdList: null};
          result.code = group;
          result.teacherIdList = listTeacher.filter(r => r.groupCode === group).map(r => r.teacherId);
          return result;
        });
        let arrTeacherId = new Set();
        sendMessageDTO.receiverMessageDTOList.forEach(element => {
          element.teacherIdList.forEach(teacherId => {
            arrTeacherId.add(teacherId);
          });
          element.teacherIdList = [];
        });
        sendMessageDTO.receiverMessageDTOList[0].teacherIdList = Array.from(arrTeacherId);
      }
    } else {
      // sendMessageDTO.teacherCodeList = this.listRecipientTeacherCode();
      sendMessageDTO.teacherIdList = this.listRecipientTeacherId();
    }
    console.log(sendMessageDTO);
    if (this.mailFormGroup.value.files) {
      if (Array.from(this.mailFormGroup.value.files).some((file: any) => file.size > 5 * 1024 * 1024)) {
        this.toast.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.SIZE'));
        this.hide = true;
        return;
      }
      Array.from(this.mailFormGroup.value.files).forEach((file: any) => {
        formData.append('file', file);
      })
    }

    formData.append('sendMessageDTO', new Blob([JSON.stringify(sendMessageDTO)], {type: 'application/json'}));
    if (!this.mailFormGroup.invalid) {
      this.hide = false;
    }
    this.contactGroupService.sendMail(formData).subscribe(res => {
      this.hide = true;
      if (res.status === 'OK') {
        this.toast.success(res.message);
        this.resetPageData();
        this.changeDetectorRef.detectChanges();
      } else {
        this.toast.error(res.message);
        this.changeDetectorRef.detectChanges();
      }
    }, err => {
      this.hide = true;
      this.toast.error(err.message);
      this.changeDetectorRef.detectChanges();
    })
  }

  treeviewValueChange(e: any) {
    this.result1 = e;
    this.config2.checkboxEnabled = this.result1.length === 0 && !this.config1.selectByGroupValue;
    this.changeDetectorRef.detectChanges();
  }

  groupTeacherValueChange(e: any) {
    console.log(e);
    this.result2 = e;
    console.log(this.config1);
    this.config1.checkboxEnabled = this.result2.length === 0;
    this.changeDetectorRef.detectChanges();
  }

  sendType(): any {
    if (this.result2.length > 0) return '2';
    else {
        const isSelectedAll = this.items1.length ? this.items1.every(item => item.internalChecked) : false
        if (isSelectedAll) return '0';
        else {
          if (this.config1.selectByGroupValue) return '1';
          else return '3';
        }
    }
  }

  listRecipientTeacher(): any {
    if (this.result2.length > 0) {
      const result = [];
      this.result2.filter(r => r.isTeacher).forEach(r => result.every(r2 => r2.isTeacher !== r.isTeacher) && result.push(r))
      return result.map(r => r.text);
    }
    else return this.result1.filter(r => r.isTeacher).map(r => r.text);
  }

  listRecipientGroup(): any {
    if (this.result2.length > 0) {
      this.listRecipientGroupName = [...new Set(this.result2.map(r => r.groupName))];
      return this.listRecipientGroupName;
    }
    // this.listRecipientGroupName = []

    // const groupNameSet = new Set(this.result1.map(r => r.rootParentName +'[??&&&&&&??]'+r.groupName))
    // const parentNameSet = new Set(this.result1.map(r => r.rootParentName))

    // const groupNameArray = [...groupNameSet]
    // const parentNameArray = [...parentNameSet]

    // // find roots from tree
    // const roots = this.items1.filter(i => parentNameArray.includes(i.text))

    // roots?.forEach( (r, index) => {
    //   const currentParentName = parentNameArray[index]
    //   if (this.countCheckedbox(r) == this.sumDeptChildren(r)) {
    //     this.listRecipientGroupName.push(currentParentName)
    //   } else {
    //     const list = groupNameArray.filter(name => name.startsWith(currentParentName)).map(name => name.split('[??&&&&&&??]')[1])
    //     this.listRecipientGroupName.push(...list)
    //   }
    // })
    return this.listReceiverStore
  }

  shouldShowBtn(listTeacher: any) {
    return listTeacher.offsetWidth < listTeacher.scrollWidth;
  }

  listRecipientTeacherCode(): any {
    if (this.result2.length > 0) return this.result2.filter(r => r.isTeacher).map(r => r.isTeacher);
    else return this.result1.filter(r => r.isTeacher).map(r => r.isTeacher);
  }

  listRecipientTeacherId(): any {
    if (this.result2.length > 0) return this.result2.filter(r => r.teacherId).map(r => r.teacherId);
    else return this.result1.filter(r => r.teacherId).map(r => r.teacherId);
  }

  openDialog(): void {
    this.matDialog.open(ListTeacherSendMailComponent, {
      data: this.result2.length > 0 ? this.result2.filter(r => r.isTeacher) : this.result1.filter(r => r.isTeacher),
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      width: '760px'
    }).afterClosed().subscribe(res => {
      console.log(res);
      if (!res) return;
      res.forEach(item => {
        const data = this.findItemNested(this.items1, item);
        data.checked = false;
        const index = this.result1.findIndex(r => r.isTeacher === data.value.isTeacher);
        this.result1.splice(index, 1);
      })
      this.config1.checkboxEnabled = this.result2.length === 0
      this.config2.checkboxEnabled = this.result1.length === 0 && !this.config1.selectByGroupValue
      this.changeDetectorRef.detectChanges();
    });
  }

  /**
   * @deprecated
   * @description count all checkboxes are checked from root
   */
  countCheckedbox(root) {
    if (root?.value?.isRoot && root?.value?.deptChild?.length == 0)
      return 1

    const total = root?.value.deptChild.reduce( (n,o,i) => {
      const internalChild = root.internalChildren[i]
      if (internalChild.internalChecked) {
        n++
      }
      return n + this.countCheckedbox(internalChild)
    }, 0)
    return total
  }

  findItemNested(arr, itemId, parentCode?): any {
    if(!arr?.length) return;
    return arr.find(elm => {
      return parentCode ? elm.value.isTeacher === itemId && elm.value.groupCode === parentCode : elm.value.isTeacher === itemId;
    }) ?? this.findItemNested(arr.flatMap(elm => elm.children || []), itemId, parentCode);
  }

  findDeptByName(arr, deptName): any {
    if(!arr?.length) return;

    const result = arr.filter(elm => {
      return elm.text === deptName
    })

    return result.length ? result : this.findDeptByName(arr.flatMap(elm => elm.children || []), deptName);
  }

  navigateTo() {
    this.router.navigate(['system/contact/contact-group'], { state: { openCreateDialog: true } });
  }

  removeGroupDept(text: any) {
    const result = this.result1.length ? this.result1 : this.result2;
    const items = this.result1.length ? this.items1 : this.items2;
    const dept = this.findDeptByName(items, text)
    const children = this.findChildren(dept[0])
    const listTeacher = result.filter(r => r.groupName === text || children.includes(r.groupName));
    listTeacher.forEach(teacher => {
      // const data = this.findItemNested(items, teacher.isTeacher, teacher.groupCode);
      // data.internalChecked = false;
      // data.checked = false;
      const index = result.findIndex(r => {
        return (r.groupName === teacher.groupName)
      });
      result.splice(index, 1);
    })
    this.listReceiverStore = this.listReceiverStore.filter( name => name != text)
    const dataParents = this.findDeptByName(items, text);
    dataParents.forEach(d => {
      d.internalChecked = false;
      d.checked = false;
      this.uncheckboxFromItem(d)
    })
    this.config1.checkboxEnabled = this.result2.length === 0
    this.config2.checkboxEnabled = this.result1.length === 0 && !this.config1.selectByGroupValue
    this.changeDetectorRef.detectChanges();
  }

  findChildren(item, valueReturn = 'text') {
    const listChildren = []
    item.value?.deptChild?.forEach( child => {
      listChildren.push(child[valueReturn])
      if (child.value.deptChild.length) listChildren.push(...(this.findChildren(child, valueReturn) || []))
    })
    return listChildren
  }

  // uncheckbox from root
  uncheckboxFromItem(root) {
    root.internalChildren.forEach( x => {
      x.internalChecked = false
      x.checked = false

      if (x.internalChildren?.length > 0) {
        this.uncheckboxFromItem(x)
      }
    })
  }

  resetPageData() {
    this.mailFormGroup.reset();
    this.mailFormGroup.get('files').patchValue([]);
    this.items1 = this.listTreeViewTeacherRaw?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true)));
    this.items2 = this.listGroupTeacherRaw?.map(item => new TreeviewItem(this.transformListGroupToTreeViewItems(item, true)));
    this.config1.selectByGroupValue = false;
    this.changeDetectorRef.detectChanges();
  }

  selectByGroupValueChange($event: any) {
    this.items1 = this.listTreeViewTeacherRaw?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true)));
    this.config2.checkboxEnabled = this.result1.length === 0 && !this.config1.selectByGroupValue;
    this.listReceiverStore = []
  }

  /**
   * @deprecated
   */
  sumDeptChildren(items) {
    if (!(items?.value?.deptChild.length > 0)) {
      const length = items?.value?.deptChild.length
      if (items?.value?.isRoot) return length + 1
      return length
    }

    const total = items?.value?.deptChild.reduce( (n,o,i) => {
      return n + this.sumDeptChildren(items?.internalChildren[i])
    }, 0)

    return items?.value?.deptChild.length + total
  }

  checkboxItemChange(item) {
    if (item.checked) {
     let nameWillView = item.text 
     this.listReceiverStore.push(nameWillView)
 
     const isInclude = item.value.deptChild.some(i => this.listReceiverStore.includes(i.departmentName))
     if (isInclude) {
       this.listReceiverStore = this.listReceiverStore.filter( name => {
         return !item.value.deptChild.map(child => child.departmentName).includes(name) && name != item.text
       })
       this.listReceiverStore = [item.text, ...this.listReceiverStore]
     }
 
     this.tickCheckboxParent(item)
 
   } else {
     const listName = []
     this.items1.forEach( root => {
       listName.push(...(this.findCheckboxTicked(root) || []))
     })
     this.listReceiverStore = listName
    }
 
  }

  findCheckboxTicked(item) {
    let listName = []

    if (item.checked) {
      listName = [item.text]
      return listName
    }

    item?.children?.forEach( child => {
      if (!child.value.isTeacher && child.checked) {
        listName.push(child.text)
      }

      if (!child.checked) listName.push(...(this.findCheckboxTicked(child) || []))
    })
    return listName
  }

  tickCheckboxParent(item) {
    const dept = this.findDeptByName(this.items1, item.value.parentName ?? item.text)
    const deptChildName = dept[0].value.deptChild.map(child => child.departmentName)
    
    const include = deptChildName.length ? deptChildName.every( name => this.listReceiverStore.includes(name)) : false
    if (include) {
      this.listReceiverStore = this.listReceiverStore.filter(name => {
        return !deptChildName.map(x => x).includes(name)
      })
      this.listReceiverStore = [item.value.parentName, ...this.listReceiverStore]
    }

    if (!item.value.isRoot) {
      this.tickCheckboxParent(dept)
    }
  }

  onCustomFilter($event: string) {
    this.getListTeacherTreeView($event);
  }

  onReloadData($event: boolean) {
    this.items1 = this.listTreeViewTeacherRaw?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true, null, $event)));
    this.changeDetectorRef.detectChanges();
  }
}
