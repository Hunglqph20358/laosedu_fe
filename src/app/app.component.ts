import { Subscription } from 'rxjs';
// Angular
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// Layout
import { LayoutConfigService, SplashScreenService, TranslationService } from './core/_base/layout';
// language list
import { locale as laLang } from './core/_config/i18n/la';
import { locale as enLang } from './core/_config/i18n/en';
import { locale as vnLang } from './core/_config/i18n/vn';
// import { locale as jpLang } from './core/_config/i18n/jp';
// import { locale as deLang } from './core/_config/i18n/de';
// import { locale as frLang } from './core/_config/i18n/fr';

import { ConfigurationService } from './core/auth/_services/configuration.service';
import { AuthService } from './core/auth/_services/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[kt-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  // Public properties
  title = 'SMAS';
  loader: boolean;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   *
   * @param translationService: TranslationService
   * @param router: Router
   * @param layoutConfigService: LayoutConfigService
   * @param splashScreenService: SplashScreenService
   */
  constructor(
    private translationService: TranslationService,
    private router: Router,
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService,
    private configurationService: ConfigurationService,
    private authService: AuthService,
    ) {

    // register translations
    this.translationService.loadTranslations(laLang,enLang, vnLang);
    // Get configuration from server environment variables:
    // this.configurationService.load();
    // this.configurationService.settingsLoaded$.subscribe(_ => this.authService.initConfigOauth());
    // this.authService.initConfigOauth();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    document.querySelector('html').lang = this.translationService.getSelectedLanguage()
    // enable/disable loader
    this.loader = this.layoutConfigService.getConfig('page-loader.type');

    const routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
