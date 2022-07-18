import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'kt-date2',
  templateUrl: './date2.component.html',
  styleUrls: ['./date2.component.scss']
})
export class Date2Component implements OnInit {

  @Input() dateValue;
  @Input() messageIllegal;
  @Output() dateOutput:any = new EventEmitter<any>();

  constructor() {
    // console.log(this.dateValueIn);
  }

  // dateValue;
  showErrDate = false;
  messageErrDate;

  ngOnInit(): void {
    // console.log(this.dateValueIn);
    // this.dateValue = this.convert(this.dateValueIn);
  }

  // convert(date:any){
  //   // tslint:disable-next-line:only-arrow-functions
  //   const values = date.split('-').map(function(v) {
  //     return v.replace(/\D/g, '')
  //   });
  //   console.log('values',values);
  //   return {
  //     // tslint:disable-next-line:radix
  //     year: parseInt(values[0]),
  //     // tslint:disable-next-line:radix
  //     month: parseInt(values[1]),
  //     // tslint:disable-next-line:radix
  //     day : parseInt(values[2])
  //   }
  // }

  checkDate(){
    console.log('this.dateTo',this.dateValue);
    this.showErrDate = false;
    if(this.dateValue===null || typeof this.dateValue === 'object'){
      this.dateOutput.emit(this.dateValue);
      return;
    }

    this.showErrDate = true;
    this.messageErrDate = this.messageIllegal;
    this.dateOutput.emit('error');
  }

}
