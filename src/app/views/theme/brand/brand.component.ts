// Angular
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../core/_base/layout';
import { SchoolServices } from '../../pages/system/school/school.service';
import { HtmlClassService } from '../html-class.service';

@Component({
  selector: 'kt-brand',
  templateUrl: './brand.component.html',
})
export class BrandComponent implements OnInit, AfterViewInit {
  // Public properties
  headerLogo = '';
  brandClasses = '';
  asideSelfMinimizeToggle = true;
  a=false;
  toggleOptions: ToggleOptions = {
    target: 'kt_body',
    targetState: 'aside-minimize',
    toggleState: 'active'
  };

  @Input() hideLogo;

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   * @param htmlClassService: HtmlClassService
   */
  constructor(private layoutConfigService: LayoutConfigService, public htmlClassService: HtmlClassService, private schoolSv: SchoolServices) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.headerLogo = this.getAsideLogo();
    this.brandClasses = this.htmlClassService.getClasses('brand', true).toString();
    this.asideSelfMinimizeToggle = this.layoutConfigService.getConfig('aside.self.minimize.toggle');
  }

  /**
   * On after view init
   */
  ngAfterViewInit(): void {
  }

  getAsideLogo() {
    let result = 'logo-light.png';
    const brandSelfTheme = this.layoutConfigService.getConfig('brand.self.theme') || '';
    if (brandSelfTheme === 'light') {
      result = 'logo-dark.png';
    }
    return `./assets/media/logos/${result}`;
  }

  // toggleAsideClick() {
  //   document.body.classList.toggle('aside-minimize');
  //   this.a = !this.a;
  //   this.schoolSv.sideBar.next(this.a);
  //   if (document.getElementById('logo_brand').classList.contains('d-none').valueOf()) {
  //     document.getElementById('logo_brand').classList.remove('d-none');
  //   } else {
  //     document.getElementById('logo_brand').classList.add('d-none');
  //   }
  //
  // }
}
