import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import * as objectPath from 'object-path';
// Layout
import {LayoutConfigService, MenuAsideService, MenuOptions, OffcanvasOptions} from '../../../core/_base/layout';
import {HtmlClassService} from '../html-class.service';
import {SchoolServices} from '../../pages/system/school/school.service';
import {environment} from '../../../../environments/environment';
import {document} from 'ngx-bootstrap/utils';

@Component({
  selector: 'kt-aside-left',
  templateUrl: './aside-left.component.html',
  styleUrls: ['./aside-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideLeftComponent implements OnInit, AfterViewInit {
  @ViewChild('asideMenuOffcanvas', {static: true}) asideMenuOffcanvas: ElementRef;
  @ViewChild('asideMenu', {static: true}) asideMenu: ElementRef;
  private offcanvas: any;
  lStorage = JSON.parse(localStorage.getItem('currentUser'));

  isGv = !!(this.lStorage
            && this.lStorage.authorities
            && this.lStorage.authorities && this.lStorage.authorities.length > 1
            && (this.lStorage.authorities.includes(environment.ROLE.GV_CN) || this.lStorage.authorities.includes(environment.ROLE.HT)));

  asideLogo = '';
  asideClasses = '';
  currentRouteUrl = '';
  insideTm: any;
  outsideTm: any;
  brandClasses = '';
  a = false;
  checkTogle = false;


  menuCanvasOptions: OffcanvasOptions = {
    baseClass: 'aside',
    overlay: true,
    closeBy: 'kt_aside_close_btn',
    toggleBy: {
      target: 'kt_aside_mobile_toggle',
      state: 'mobile-toggle-active'
    }
  };

  menuOptions: MenuOptions = {
    // submenu setup
    submenu: {
      desktop: {
        // by default the menu mode set to accordion in desktop mode
        default: 'dropdown',
      },
      tablet: 'accordion', // menu set to accordion in tablet mode
      mobile: 'accordion' // menu set to accordion in mobile mode
    },

    // accordion setup
    accordion: {
      expandAll: false // allow having multiple expanded accordions in the menu
    }
  };

  /**
   * Component Constructor
   *
   * param htmlClassService: HtmlClassService
   * param menuAsideService
   * param layoutConfigService: LayoutConfigService
   * param router: Router
   * param render: Renderer2
   * param cdr: ChangeDetectorRef
   */

  constructor(
    public htmlClassService: HtmlClassService,
    public menuAsideService: MenuAsideService,
    public layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    private schoolSv: SchoolServices,
  ) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    // Set border radius
    const vuong = (document.querySelector('.vuong-wrapper') as HTMLElement);
    const inVuong = (document.querySelector('.in-vuong') as HTMLElement);
    vuong.style.left = `${document.querySelector('.aside-left').offsetWidth}px`
    inVuong.style.left = `${document.querySelector('.aside-left').offsetWidth}px`

    this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
        this.mobileMenuClose();
        this.cdr.markForCheck();
      });


    const config = this.layoutConfigService.getConfig();

    if (objectPath.get(config, 'aside.menu.dropdown')) {
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown', '1');
      // tslint:disable-next-line:max-line-length
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown-timeout', objectPath.get(config, 'aside.menu.submenu.dropdown.hover-timeout'));
    }
    if (document.body.classList.contains('aside-minimize') && KTUtil.isInResponsiveRange('desktop')) {
      this.checkTogle = true
      this.a = true;
      this.schoolSv.sideBar.next(this.a);
    }
    this.asideClasses = this.htmlClassService.getClasses('aside', true).toString();
    this.asideLogo = this.getAsideLogo();
    setTimeout(() => {
      this.offcanvas = new KTOffcanvas(this.asideMenuOffcanvas.nativeElement, this.menuCanvasOptions);
    });
    this.brandClasses = this.htmlClassService.getClasses('brand', true).toString();
  }

  getAsideLogo() {
    let result = 'logo-light.png';
    const brandSelfTheme = this.layoutConfigService.getConfig('brand.self.theme') || '';
    if (brandSelfTheme === 'light') {
      result = 'logo-dark.png';
    }
    return `./assets/media/logos/${result}`;
  }

  /**
   * Check Menu is active
   * @param item: any
   */
  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      if (item.root !== false) return this.isMenuRootItemIsActive(item);
      else return false;
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  /**
   * Check Menu Root Item is active
   * @param item: any
   */
  isMenuRootItemIsActive(item): boolean {
    let result = false;


    for (const subItem of item.submenu) {

      if (this.currentRouteUrl.indexOf(subItem.page) !== -1) return true

      if (subItem.submenu) {
        const a = subItem.submenu.find(value => this.currentRouteUrl.indexOf(value.page) !== -1)
        if (a) return true
      }
      result = this.isMenuItemIsActive(subItem);
      if (result) {
        return true;
      }
    }

    return false;
  }

  /**
   * Use for fixed left aside menu, to show menu on mouseenter event.
   * @param e Event
   */
  mouseEnter(e: Event) {
    // check if the left aside menu is fixed
    if (document.body.classList.contains('aside-fixed')) {
      if (this.outsideTm) {
        clearTimeout(this.outsideTm);
        this.outsideTm = null;
      }
      this.insideTm = setTimeout(() => {
        // if the left aside menu is minimized
        if (document.body.classList.contains('aside-minimize') && KTUtil.isInResponsiveRange('desktop')) {
          this.checkTogle = false;
          // show the left aside menu
          this.render.removeClass(document.body, 'aside-minimize');
          this.render.addClass(document.body, 'aside-minimize-hover');
          this.cdr.markForCheck();
        }
      }, 50);
    }
  }

  /**
   * Use for fixed left aside menu, to show menu on mouseenter event.
   * @param e Event
   */
  mouseLeave(e: Event) {
    if (document.body.classList.contains('aside-fixed')) {
      if (this.insideTm) {
        clearTimeout(this.insideTm);
        this.insideTm = null;
      }
      this.outsideTm = setTimeout(() => {
        // if the left aside menu is expand
        if (document.body.classList.contains('aside-minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
          this.checkTogle = true;
          // hide back the left aside menu
          this.render.removeClass(document.body, 'aside-minimize-hover');
          this.render.addClass(document.body, 'aside-minimize');
          this.cdr.markForCheck();
        }
      }, 50);
    }
  }

  /**
   * Returns Submenu CSS Class Name
   * @param item: any
   */
  getItemCssClasses(item) {
    let classes = 'menu-item';

    if (objectPath.get(item, 'submenu')) {
      classes += ' menu-item-submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-active menu-item-here';
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-open menu-item-here';
    }

    // custom class for menu item
    const customClass = objectPath.get(item, 'custom-class');
    if (customClass) {
      classes += ' ' + customClass;
    }

    if (objectPath.get(item, 'icon-only')) {
      classes += ' menu-item-icon-only';
    }

    return classes;
  }

  getItemAttrSubmenuToggle(item) {
    let toggle = 'hover';
    if (objectPath.get(item, 'toggle') === 'click') {
      toggle = 'click';
    } else if (objectPath.get(item, 'submenu.type') === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  toggleAsideClick() {
    const vuong = (document.querySelector('.vuong-wrapper') as HTMLElement);
    const inVuong = (document.querySelector('.in-vuong') as HTMLElement);
    vuong.style.left = `${document.querySelector('.aside-left').offsetWidth}px`
    inVuong.style.left = `${document.querySelector('.aside-left').offsetWidth}px`

    document.body.classList.toggle('aside-minimize');
    this.a = !this.a;
    this.checkTogle = this.a ? true : false;
    this.schoolSv.sideBar.next(this.a);

    vuong.style.left = `${document.querySelector('.aside-left').offsetWidth}px`
    inVuong.style.left = `${document.querySelector('.aside-left').offsetWidth}px`
  }

  mobileMenuClose() {
    if (KTUtil.isBreakpointDown('lg') && this.offcanvas) { // Tablet and mobile mode
      this.offcanvas.hide(); // Hide offcanvas after general link click
    }
  }
}
