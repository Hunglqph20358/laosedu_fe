import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Select} from '../../shared/models/select';
import {TransferStudentPayload} from '../../shared/models/transfer-student-payload';

@Component({
  selector: 'kt-transfer-student-search',
  templateUrl: './transfer-student-search.component.html',
  styleUrls: ['./transfer-student-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferStudentSearchComponent implements OnInit, OnDestroy {

  grades: any[];
  classes: any[];
  statuses: any[];

  @Input() set schoolYear(schoolYear) {
    this.form.patchValue({schoolYear});
  }

  @Input() set gradeSelect(select: Select) {
    console.log(select)
    this.grades = select.items;
    this.form.patchValue({gradeLevel: select.defaultValue});
  }

  @Input() set classSelect(select: Select) {
    console.log(select)
    this.classes = select.items;
    this.form.patchValue({classCode: select.defaultValue});
    this.form.patchValue({
      gradeLevel: this.form.value.gradeLevel,
      classCode: select.defaultValue,
    });
    this.onSearch();
  }

  @Input() set transferStatusSelect(select: Select) {
    this.statuses = select.items;
    this.form.patchValue({transferStatus: select.defaultValue});
  }

  @Output() gradeChanged = new EventEmitter();
  @Output() search = new EventEmitter<TransferStudentPayload>();

  form = this.fb.group({
    schoolYear: this.fb.control(undefined),
    gradeLevel: this.fb.control(undefined),
    classCode: this.fb.control(undefined),
    transferStatus: this.fb.control(undefined),
    studentSearch: this.fb.control(undefined)
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  isGradeEqual(a, b) {
    return a.id === b.id;
  }

  isClassEqual(a, b) {
    return a.id === b.id;
  }

  isStatusEqual(a, b) {
    return a.id === b.id;
  }

  onSearch() {
    const value = this.form.value;

    const payload: TransferStudentPayload = {
      schoolYear: value.schoolYear,
      gradeLevel: this.getField(value.gradeLevel, 'id'),
      classCode: this.getField(value.classCode, 'code'),
      transferStatus: this.getField(value.transferStatus, 'id'),
      studentSearch: value.studentSearch
    }

    this.search.emit(payload);
  }

  getField(object, field) {
    if (object && object.hasOwnProperty(field)) {
      return object[field];
    }

    return object;
  }

  get studentSearch() {
    return this.form.get('studentSearch');
  }

  trim() {
    this.studentSearch.setValue(this.studentSearch.value.trim())
  }

  ngOnDestroy() {
  }
}
