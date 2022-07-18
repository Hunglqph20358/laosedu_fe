// Angular
import {AfterViewInit, Directive, ElementRef, Input, OnInit} from '@angular/core';

export interface ScrollTopOptions {
  offset: number;
  speed: number;
}

/**
 * Scroll to top
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[indexFocus]'
})
export class FieldFocusDirective implements OnInit {
  // Public properties
  @Input() indexFocus;

  /**
   * Directive Constructor
   * @param el: ElementRef
   */
  constructor() {
  }

  ngOnInit(): void {
    const interval = setInterval(() => {
      if (this.indexFocus) {
        this.indexFocus.focus();
        clearInterval(interval);
      }
    }, 200);
  }
}
