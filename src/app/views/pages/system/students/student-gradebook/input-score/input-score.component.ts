import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StudentsService} from '../../../../../../core/service/service-model/students.service';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'kt-input-score',
  templateUrl: './input-score.component.html',
  styleUrls: ['./input-score.component.scss']
})
export class InputScoreComponent implements OnInit {

  params;
  scoreValue;
  rowSelect;
  scoreName;
  isUpdate;
  decimals = 2;
  disableScore;
  rowIndex;

  nextScore;
  constructor(private studentService: StudentsService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.listenUpdate();
  }

  listenUpdate() {
    this.studentService.changeIsShowUpdate$.subscribe(value => {
      this.isUpdate = value;
    })
  }

  // gets called once before the renderer is used
  agInit(params ): void {
    this.params = params;
    this.rowSelect = params.data;
    this.scoreName = params.colDef.field;
    this.scoreValue = this.rowSelect[this.scoreName];
    this.rowIndex = +params.rowIndex + 1;

    // Check date lock
    const scoreIndex = params.colDef.tooltipField.replace('score', '');
    const statusLock = this.rowSelect.listScore[scoreIndex - 1].statusLock;
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
        this.nextScore = this.rowIndex + 'score' + (+scoreIndex + 1);
      } else {
        if (this.rowIndex < params.api.rowCount) {
          this.nextScore = (+this.rowIndex + 1) + 'score1';
        } else {
          this.nextScore = '1score1';
        }
      }
    } else {
      // Nhập theo cột
      if (this.rowIndex < params.api.rowCount) {
        this.nextScore = (+this.rowIndex + 1) + 'score' + scoreIndex;
      } else {
        if (+scoreIndex < this.rowSelect.listScore.length) {
          this.nextScore = (1) + 'score' + (+scoreIndex + 1);
        } else {
          this.nextScore = (1) + 'score' + (1);
        }
      }
    }

  }

  changeAvgScore(key:string) {
    if (this.scoreValue && this.scoreValue.trim() !== '') {
      for (let i = 0; i <= 10; i++) {
        if (+(this.scoreValue) === i) {
          this.scoreValue = `${i}`;
        }
      }
    }
    this.rowSelect[this.scoreName] = this.scoreValue?.trim();
    this.params.data = this.rowSelect;
    this.refresh(this.params, key);
  }

  refresh(params: any, key): boolean {
    this.formatRow(params.data);
    this.studentService.changeCheckStatusBox('score');
    this.studentService.changeScoreGradeBookValue({
      rowIndex: this.rowIndex,
      checked: params.data.checked,
      avgScore: params.data.avgScore,
      studentCode: params.data.studentCode
    });

    if (key === 'enter') {
      this.focusToNextScore();
    }
    return false;
  }

  formatRow(row) {
    const newRow = row.listScore.map((e, i) => {
      const score = 'score' + (i + 1);
      return {
        ...e,
        value: row[score],
      };
    })
    const scores = newRow.map(e => {
      return {
        score: e.value,
        coeficient: e.coeficient
      };
    });

    row.listScore = newRow;
    const avg = this.checkCalcAvgScore(row) ? Math.round(this.sumAvg(scores) * 100) / 100 : null;
    if (isNaN(avg)) {
      row.avgScore = null;
    } else {
      row.avgScore = avg;
    }
    if (row.avgScore !== null) {
      row.checked = true;
    } else {
      row.checked = false;
    }
  }

  sumAvg(score) {
    let avg = 0;
    let totalCoe = 0;
    score.forEach(item => {
      if (item.score !== '' && item.score !== null && item.score !== undefined) {
        totalCoe += +item.coeficient;
        avg +=Math.round((+item.score * +item.coeficient) * 100) / 100 ;
      }
    });
    if (totalCoe !== 0) {
      return avg / totalCoe;
    } else {
      return null;
    }
  }

  // Check calc avgScore
  checkCalcAvgScore(element) {
    let calcSum = true;
    element.confScoreDetailsList.forEach(item => {
      let i = 0;
      element.listScore.forEach(e => {
        if (item.code === e.scoreCode && e.value !== null && e.value !== '' && e.value !== undefined) {
          i++;
        }
      });
      if (i < item.minimumScore) calcSum = false;
    });
    return calcSum;
  }

  focusToNextScore() {
    if (document.getElementById(`${this.nextScore}`) !== null &&
      document.getElementById(`${this.nextScore}`) !== undefined
    ) {
      document.getElementById(`${this.nextScore}`).focus();
    }
  }
}
