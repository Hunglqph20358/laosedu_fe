// import {Directive, ElementRef, HostListener, Input} from '@angular/core';
// import {NgForm} from '@angular/forms';
//
// @Directive({
//   selector: '[ktAppFocus]'
// })
// export class FocusFormGroupDirective {
//
//   constructor(private el: ElementRef) {
//   }
//
//   @Input() formGroup: NgForm;
//
//   @HostListener('submit', ['$event'])
//   public onSubmit(event): void {
//     if ('INVALID' === this.formGroup.status) {
//       event.preventDefault();
//
//       const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid');
//       (<HTMLInputElement>formGroupInvalid[0]).focus();
//     }
//   }
// }
