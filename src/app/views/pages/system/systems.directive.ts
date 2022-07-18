import { Directive, Input } from '@angular/core'
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms'
import * as _ from 'lodash';
import { template } from 'lodash';
import { TeacherService } from 'src/app/core/service/service-model/teacher.service';


@Directive({
  selector: '[ktSystems]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SystemsDirective, multi: true }]

})
export class SystemsDirective implements Validators {
  @Input() ktSystems: number;
  @Input() update;
  @Input() listAllTeacher: any [];
  errorCB;
  test;



  constructor( private teacherService: TeacherService) {

  }
  validate(control: AbstractControl): Validators {
    //check số lượng ký tự của 1 input


    if (control.value && this.ktSystems > 0) {

      if (control.value.length > this.ktSystems) {
        return { ktSystems: 'error' };//ktSystems la key error
      }
        if(_.size(this.listAllTeacher)){
              this.test = this.listAllTeacher.filter(item=>item.code === control.value)[0];
        }
       if(this.test && !this.update){
        return { errorCB: 'error' };//ktSystems la key error
       }
    }
    return null;
  }






}
