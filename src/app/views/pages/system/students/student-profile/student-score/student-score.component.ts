import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { StudentsService } from 'src/app/core/service/service-model/students.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { AcademicAbilitiesService } from '../../../academic-abilities/academic-abilities.service';
import { NO_ROW_GRID_TEMPLATE } from 'src/app/helpers/constants';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-student-score',
  templateUrl: './student-score.component.html',
  styleUrls: ['./student-score.component.scss']
})
export class StudentScoreComponent implements OnInit, AfterViewInit {

  unsubscribe$ = new Subject<void>()

  @Input() studentCode: any;

  @Output() getIsLoadingChange = new EventEmitter<boolean>();

  columnDefs = []
  rowData = []

  rowHeight = 56
  headerHeight = 32

  columnDefsScore
  rowDataScore
  columnDefsRank
  rowDataRank

  semesters: []
  years
  currentClassId
  classRoomCode
  currentYear
  currentSemester

  dataRank 
  dataScore 
  dataSemesterGrid

  gridSemesterApi
  gridScoreApi
  gridRankApi

  hasChildColumn: boolean = false

  overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'))

  INVALID = [null, undefined, '', 'null', 'NaN']

  isLoadingSemester
  isLoadingScore
  isLoadingRank

  baseCss = {
    'font-family': 'Inter',
    'font-style': 'normal',
    'font-weight': '500',
    'font-size': '12px',
    'line-height': '20px',
    'color': '#101840',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }

  constructor(
    private studentService: StudentsService,
    private academicAbilitiesService: AcademicAbilitiesService,
    private changeDetector: ChangeDetectorRef,
    private translate: TranslateService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadYear()
  }

  generateHeaderSemester() {
    this.columnDefs = []
    this.rowData = []
    this.dataSemesterGrid.header.forEach( (value, index) => {
      const hasBg = index % 2 !== 0
      const header = {
        headerName: value.semester == 0 ? this.trans('ALL_YEARS') : `${this.translate.instant('STUDENT.SEMESTER2')} ${value.semester}`,
        headerClass: hasBg ? 'has-background grid-semester-custom-header' : 'grid-semester-custom-header',
        children: [
          {
            headerName: this.trans('AVERAGE'),
            headerClass: hasBg ?  'has-background grid-semester-custom-subheader' : 'grid-semester-custom-subheader',
            valueGetter: param => {
              const score = param.data[`score${value.semester}`]
              return this.INVALID.includes(score) ? '-' : score
            },
            minWidth: 80,
            maxWidth: 80,
            cellStyle: this.baseCss,
            tooltipValueGetter: param => {
              const score = param.data[`score${value.semester}`]
              return this.INVALID.includes(score) ? '-' : score
            }
          },
          {
            headerName: this.trans('ABILITY'),
            headerClass: hasBg ?  'has-background grid-semester-custom-subheader' : 'grid-semester-custom-subheader',
            valueGetter: param => {
              const ability = param.data[`ability${value.semester}`]
              return ability ? ability : '-'
            },
            minWidth: 80,
            maxWidth: 80,
            cellStyle: {
              ...this.baseCss,
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'text-align': 'center',
              'top': '16px',
              'display': 'block'
            },
            tooltipValueGetter: param => {
              const ability = param.data[`ability${value.semester}`]
              return ability ? ability : '-'
            }
          },
          {
            headerName: this.trans('CONDUCT'),
            headerClass: hasBg ?  'has-background grid-semester-custom-subheader' : 'grid-semester-custom-subheader',
            valueGetter: param => {
              const conduct = param.data[`conduct${value.semester}`]
              return conduct ? conduct : '-'
            },
            minWidth: 100,
            maxWidth: 100,
            cellStyle: {
              ...this.baseCss,
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'text-align': 'center',
              'top': '16px',
              'display': 'block'
            },
            tooltipValueGetter: param => {
              const conduct = param.data[`conduct${value.semester}`]
              return conduct ? conduct : '-'
            }
          },
          {
            headerName: this.trans('COMPETITION'),
            headerClass: hasBg ?  'has-background grid-semester-custom-subheader' : 'grid-semester-custom-subheader',
            valueGetter: param => {
              const competition = param.data[`competition${value.semester}`]
              return competition ? competition : '-'
            },
            minWidth: 120,
            cellStyle: {
              ...this.baseCss,
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'text-align': 'center',
              'top': '16px',
              'display': 'block'
            },
            tooltipValueGetter: param => {
              const competition = param.data[`competition${value.semester}`]
              return competition ? competition : '-'
            }
          }
        ]
      }
      this.columnDefs.push(header)
    })

    this.rowData.push(this.dataSemesterGrid.body)
  }

  generateHeaderScore() {
    this.hasChildColumn = false
    const length = this.dataScore.header.length
    if (length == 0) {
      this.columnDefsScore = []
      this.rowDataScore = []
      return
    }

    this.columnDefsScore = [
      {
        headerName: this.trans('NO'),
        lockPosition: true,
        minWidth: 60,
        maxWidth: 60,
        pinned: 'left',
        valueGetter: param => {
          return param.node.rowIndex + 1
        },
        cellStyle: this.baseCss,
      },
      {
        headerName: this.trans('SUBJECT_NAME'),
        headerClass: 'header-subject-name',
        minWidth: 200,
        pinned: 'left',
        field: 'name',
        tooltipField: 'name',
        cellStyle: {
          ...this.baseCss,
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'text-align': 'left',
          'top': '16px',
          'display': 'block'
        },
      }
    ]

    // this.gridScoreApi.setColumnDefs(this.columnDefsScore)

    let i = -1;
    this.dataScore.header.forEach( (value, index) => {
      const column: any = {
        headerName: value.name,
      }
      if (value.quantity > 1) {
        this.hasChildColumn = true
        column.headerClass= 'grid-score-header'
        column.children = Array(value.quantity).fill(0).map( (value, index) => {
          i++
          return {
            headerName: `Đ${index+1}`,
            headerClass: 'grid-score-subheader',
            headerTooltip: `Đ${index+1}`,
            tooltipField: `score${i}`,
            minWidth: 110,
            field: `score${i}`,
            cellStyle: this.baseCss
          }
        })
      } else {
        i++
        column.minWidth = 110
        column.headerClass = 'grid-score-header just-has-one-subject'
        column.cellStyle = this.baseCss,
        column.field = `score${i}`,
        column.tooltipField = `score${i}`,
        column.headerTooltip = value.name
      }
      
      this.columnDefsScore.push(column)
      this.gridScoreApi.setColumnDefs(this.columnDefsScore)
    })

    this.columnDefsScore.push({
      headerName: this.trans('AVERAGE'),
      minWidth: 110,
      maxWidth: 110,
      pinned: 'right',
      cellStyle: this.baseCss,
      field: 'avgScore',
      tooltipField: 'avaScore'
    })
    // this.gridScoreApi.setColumnDefs()

    this.columnDefsScore.push({
      headerName: this.trans('EVALUATE'),
      headerTooltip: this.trans('EVALUATE'),
      headerClass: 'header-evaluate',
      minWidth: 250,
      maxWidth: 250,
      pinned: 'right',
      cellStyle: {
        ...this.baseCss,
        'white-space': 'pre-line',
        'overflow': 'auto',
        'height':'56px',
        'line-height': '17px',
        'justify-content': 'left',
        'padding-left': '12px'
      },
      cellRendererFramework: EvaluateComponent
    })

    this.gridScoreApi.setColumnDefs()

    this.rowDataScore = this.dataScore.body.map( value => {
      const a = {
        avgScore: this.INVALID.includes(value.avgScore) ? '-' : value.avgScore,
        name: value.name,
        evaluate: value.evaluate
      }
      value.gradebookScoreDetailsDTOS.map( (v, index) => {
        a[`score${index}`] = this.INVALID.includes(v.value) ? '-' : v.value
      })
      return a
    })
  }

  generateHeaderRank() {
    const length = this.dataRank.header.length 

    if (length == 0) {
      this.rowDataRank = []
      this.columnDefsRank = [] 
      return
    }

    this.columnDefsRank = [
      {
        headerName: this.trans('NO'),
        lockPosition: true,
        pinned: 'left',
        minWidth: 60,
        maxWidth: 60,
        valueGetter: param => {
          return param.node.rowIndex + 1
        },
        cellStyle: {
          ...this.baseCss
        }
      },
      {
        headerName: this.trans('SUBJECT_NAME'),
        headerClass: 'header-subject-name',
        pinned: 'left',
        minWidth: 200,
        field: 'name',
        tooltipField: 'name',
        cellStyle: {
          ...this.baseCss,
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'text-align': 'left',
          'top': '16px',
          'display': 'block',
          'padding-left': '12px'
        }
      }
    ]

    this.dataRank.header.forEach( (value, index) => {
      const column = {
        headerName: value.name,
        headerClass: 'header-subject-name',
        headerTooltip: value.name,
        minWidth: 120,
        tooltipValueGetter: param => {
          return param.data.gradebookScoreDetailsDTOS[index]?.value
        },
        valueGetter: param => {
          return !this.INVALID.includes(param.data.gradebookScoreDetailsDTOS[index]?.value) ? param.data.gradebookScoreDetailsDTOS[index]?.value : '-'
        },
        cellStyle: {
          ...this.baseCss,
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'text-align': 'left',
          'top': '16px',
          'display': 'block',
          'padding-left': '12px'
        }
      }
      this.columnDefsRank.push(column)
    })
    this.columnDefsRank.push({
      headerName: this.trans('EVALUATE'),
      headerTooltip: this.trans('EVALUATE'),
      headerClass: 'header-evaluate',
      lockPosition: true,
      minWidth: 250,
      maxWidth: 250,
      pinned: 'right',
      valueGetter: param => {
        const {evaluate} =param.data
        return this.INVALID.includes(evaluate) ? '-' : evaluate
      },
      cellStyle: {
        ...this.baseCss,
        'white-space': 'pre-line',
        'overflow': 'auto',
        'height':'56px',
        'line-height': '17px',
        'justify-content': 'left',
        'padding-left': '12px'
      },
      cellRendererFramework: EvaluateComponent
      
    })
    this.rowDataRank = this.dataRank.body
  }
  
  loadYear(): void {
    this.studentService.getAllClassRoomByStudentCode(this.studentCode).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) {
          this.years = res
          const defaultValue = res.find(v => v.currentYear == true)
          this.currentClassId = defaultValue?.id || res[this.years.length - 1].id
          this.classRoomCode = defaultValue?.code ||  res[this.years.length - 1].code
          this.loadSemester(defaultValue || res[this.years.length - 1])
        }
      },
      error: res => {
        console.log(res)
      }
    })
  }

  loadSemester(data): void {
    this.isLoadingSemester = true
    this.getIsLoadingChange.emit(true)

    this.currentYear = data.years
    this.currentClassId = data.id
    this.classRoomCode = data.code
    
    const obj = {
      code: this.studentCode,
      years: this.currentYear,
      classRoomCode: this.classRoomCode
    }

    this.studentService.getSemesterGrid(obj).pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: resp => {
        this.isLoadingSemester = false
        this.closeLoading()
        this.dataSemesterGrid = resp
        this.generateHeaderSemester()
        this.changeDetector.detectChanges()
        this.autoColumnFit(this.gridSemesterApi)
      },
      error: resp => {
        console.log(resp)
      }
    })

    this.academicAbilitiesService.getSemesterByYear(this.currentYear, false).pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: resp => {
        this.semesters = resp.map(semester => {
          semester.name = this.translate.instant(`GRADEBOOK.SEMESTER${semester.value}`)
          return semester
        }).slice(0, resp.length-1)
        const defaultValue: any = this.semesters.find( (value: any) => value.defaultValue == true);
        this.loadGridScore(defaultValue?.value || resp[0].value)
        this.changeDetector.detectChanges()
      },
      error: resp => {
        console.log(resp)
      }
    })
  }

  
  loadGridScore(semester): void {
    this.isLoadingRank = true
    this.isLoadingScore = true

    this.getIsLoadingChange.emit(true)

    this.currentSemester = semester
    const obj = {
      semester: semester,
      classId: this.currentClassId,
      studentCode: this.studentCode,
    }

    this.studentService.getScoreGrid({...obj, typeSubject: 0}).pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: resp => {
        this.isLoadingScore = false
        this.closeLoading()

        this.dataScore = resp
        this.generateHeaderScore()
        this.changeDetector.detectChanges()
        this.autoColumnFit(this.gridScoreApi)
        this.resizeTwoLastColumns('.grid-score')
      },
      error: resp => {
        console.log(resp)
      }
    })

    this.studentService.getRankGrid({...obj, typeSubject: 1}).pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: resp => {
        this.isLoadingRank = false
        this.closeLoading()
        this.dataRank = resp
        this.generateHeaderRank()
        this.changeDetector.detectChanges()
        this.autoColumnFit(this.gridRankApi)
        this.resizeTwoLastColumns('.grid-rank')
      },
      error: resp => {
        console.log(resp)
      }
    })
  }

  resizeTwoLastColumns(parentClassName: string): void {
    // ag-body-horizontal-scroll-container

    setTimeout( () => {
      const parent = document.querySelector(parentClassName)
      const header = (parent.querySelector('.ag-body-horizontal-scroll-container') as HTMLElement)
      header.style.width = `${header.offsetWidth - 13}px`
      this.resize(parentClassName)
    }, 1000)
  }

  gridSemesterReady(param) {
    this.gridSemesterApi = param.api
    this.autoColumnFit(param.api)
  }

  gridSemesterSizeChanged(param) {
    
    param.api.sizeColumnsToFit()
  }

  gridScoreReady(param) {
    console.log('grid score ready')
    this.gridScoreApi = param.api
    this.autoColumnFit(param.api)
  }

  gridScoreSizeChanged(param) {
    console.log('score')
    this.resize('.grid-score')
    param.api.sizeColumnsToFit()
  }

  gridRankReady(param) {
    this.gridRankApi = param.api
    this.autoColumnFit(param.api)
  }

  gridRankSizeChanged(param) {
    this.resize('.grid-rank')
    param.api.sizeColumnsToFit()
  }
 
  ngAfterViewInit(): void {
    // this.unsubscribe$.next()
    // this.unsubscribe$.complete()
  }

  autoColumnFit(gridApi) {
    setTimeout( () => {
      gridApi?.sizeColumnsToFit()
    }, 100)
  }

  trans(key): string {
    return this.translate.instant(`STUDENT.SCORE.${key}`)
  }

  resize(parentName) {
    const parent = document.querySelector(parentName)
    const header = (parent.querySelector('.ag-pinned-right-header') as HTMLElement)
    const body = (parent.querySelector('.ag-pinned-right-cols-container') as HTMLElement)
    console.log(body)
    console.log(header)
    body.style.minWidth = `${header.offsetWidth}px`
  }

  closeLoading() {
    if (!this.isLoadingRank && !this.isLoadingScore && !this.isLoadingSemester) {
      this.getIsLoadingChange.emit(false)
    }
  }
}
