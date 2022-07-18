import {Component, OnDestroy, OnInit} from '@angular/core';
import {StudentsService} from '../../../../../../core/service/service-model/students.service';
import {DatePipe} from '@angular/common';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {ICellRendererParams} from "ag-grid-community";

interface ToolTipParams extends ICellRendererParams {
  lineBreak?: boolean;
  toolTipArray?: string[];
  toolTip?: string;
}

@Component({
  selector: 'kt-input-rank',
  templateUrl: './input-rank.component.html',
  styleUrls: ['./input-rank.component.scss']
})
export class InputRankComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  rankValue;
  listSelect;

  rowSelect;
  rowIndex;
  scoreName;
  isUpdate;
  showDropDown;
  params;
  disableScore
  nextScore

  placeholder;
  placeholderSelect;

  public paramsTooltip: ToolTipParams;
  public toolTip: string;
  constructor(private studentService: StudentsService, private translate: TranslateService) {
    this.placeholder = this.translate.instant('GRADEBOOK.EVALUATE.FILL_EVALUATE');
    this.placeholderSelect = this.translate.instant('TRANSFER_STUDENTS.SELECT_PLACEHOLDER')
  }

  ngOnInit(): void {
    this.listenUpdate();
  }

  // gets called once before the renderer is used
  agInit(params ): void {

    // Set tooltip params
    this.paramsTooltip = params;
    if (params.lineBreak === true) {
      this.toolTip = params.toolTipArray.join('\n');
    } else if (params.lineBreak === false) {
      this.toolTip = params.toolTip;
    } else {
      this.toolTip = params.value;
    }

    this.params = params;
    this.rowSelect = params.data;
    this.scoreName = params.colDef.field;
    this.rankValue = this.rowSelect[this.scoreName] === '' ? null : this.rowSelect[this.scoreName];
    this.rowIndex = +params.rowIndex + 1;

    const listScoreName = 'selectList' + this.scoreName.replace('ranks', '');
    this.listSelect = this.rowSelect[listScoreName];
    if (this.listSelect !== null) {
      this.listSelect = this.listSelect.map(e => {
        return {name: e}
      });
      this.showDropDown = true;
    } else {
      this.showDropDown = false;
    }

    // Check date lock
    const scoreIndex = this.scoreName.replace('ranks', '');
    const statusLock = this.rowSelect.listScore[scoreIndex].statusLock;
    if (statusLock !== undefined && statusLock !== null) {
      if (statusLock === 0) {
        this.disableScore = true;
      } else {
        this.disableScore = false;
      }
    } else {
      this.disableScore = false;
    }

    // Nhập theo hàng
    if (!params.api.checkedColumn) {
      if (+scoreIndex < this.rowSelect.listScore.length) {
        this.nextScore = this.rowIndex + 'ranks' + (+scoreIndex + 1);
      } else {
        if (this.rowIndex < params.api.rowCount) {
          this.nextScore = (+this.rowIndex + 1) + 'ranks1';
        } else {
          this.nextScore = '1ranks1';
        }
      }
    } else {
      // Nhập theo cột
      if (this.rowIndex < params.api.rowCount) {
        this.nextScore = (+this.rowIndex + 1) + 'ranks' + scoreIndex;
      } else {
        if (+scoreIndex < this.rowSelect.listScore.length) {
          this.nextScore = (1) + 'ranks' + (+scoreIndex + 1);
        } else {
          this.nextScore = (1) + 'ranks' + (1);
        }
      }
    }
  }

  changeValue(key: string) {
    this.rowSelect[this.scoreName] = this.rankValue?.trim();
    this.refresh(this.params, key);
  }

  refresh(params: any, key: string): boolean {
    this.formatRow(params.data);
    this.studentService.changeCheckStatusBox('rank');
    this.studentService.changeValueScoreRank(
      {
              checked: params.data.checked,
              rowIndex: this.rowIndex,
              studentCode: params.data.studentCode
          }
      );
    if (key === 'enter') {
      this.focusToNextScore();
    }
    return false;
  }

  listenUpdate() {
    this.studentService.changeIsShowUpdate$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      console.log('isUpdate', value)
      this.isUpdate = value;
    })
  }

  formatRow(element) {
    const newList = element.listScore.map((e, i) => {
      if (element[`ranks${i}`] === undefined || element[`ranks${i}`] === null) {
        element[`ranks${i}`] = '';
      }
      return {
        ...e,
        value: element[`ranks${i}`]
      };
    })
    element.listScore = newList;
    if (this.isCheckedRankScore(element)) {
      element.checked = true;
    } else {
      element.checked = false;
    }
  }

  isCheckedRankScore(item) {
    let checked = true;
    item.listScore.forEach(e => {
      if (e.value === '') {
        checked = false;
      }
    });
    return checked;
  }

  focusToNextScore() {
    if (document.getElementById(`${this.nextScore}`) !== null &&
      document.getElementById(`${this.nextScore}`) !== undefined
    ) {
      document.getElementById(`${this.nextScore}`).focus();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
