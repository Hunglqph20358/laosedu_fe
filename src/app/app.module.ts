import {CommonModule, DatePipe} from '@angular/common';
// Angular
import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayModule} from '@angular/cdk/overlay';
// Angular in memory
// Perfect Scroll bar
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
// SVG inline
import {InlineSVGModule} from 'ng-inline-svg';
// Env
// Hammer JS
import 'hammerjs';
// NGX Permissions
import {NgxPermissionsModule} from 'ngx-permissions';
// NGRX
// Components
import {AppComponent} from './app.component';
// Modules
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {ThemeModule} from './views/theme/theme.module';
// Partials
import {PartialsModule} from './views/partials/partials.module';
// Layout Services
import {
  DataTableService,
  KtDialogService,
  LayoutConfigService,
  LayoutRefService,
  MenuAsideService,
  MenuConfigService,
  MenuHorizontalService,
  PageConfigService,
  SplashScreenService,
  SubheaderService
} from './core/_base/layout';
// Auth
import {AuthGuard, AuthNoticeService, AuthService} from './core/auth';
// CRUD
import {HttpUtilsService, InterceptService, TypesUtilsService} from './core/_base/crud';
// Config
import {LayoutConfig} from './core/_config/layout.config';
// Highlight JS
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import {GridModule} from '@progress/kendo-angular-grid';
import {OAuthModule} from 'angular-oauth2-oidc';
import {TreeViewModule} from '@progress/kendo-angular-treeview';
import {NotificationModule} from '@progress/kendo-angular-notification';
import {InputsModule} from '@progress/kendo-angular-inputs';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import {ToastrModule} from 'ngx-toastr';
import {SecurityService} from './core/auth/_services/security.service';
import {MatTooltipModule} from "@angular/material/tooltip";

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelSpeed: 0.5,
  swipeEasing: true,
  minScrollbarLength: 40,
  maxScrollbarLength: 300
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
  // initialize app by loading default demo layout config
  return () => {
    if (appConfig.getConfig() === null) {
      appConfig.loadConfigs(new LayoutConfig().configs);
    }
  };
}

/**
 * Import specific languages to avoid importing everything
 * The following will lazy load highlight.js core script (~9.6KB) + the selected languages bundle (each lang. ~1kb)
 */
export function getHighlightLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'scss', func: scss},
    {name: 'xml', func: xml},
    {name: 'json', func: json}
  ];
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AngularFileUploaderModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPermissionsModule.forRoot(),
    HighlightModule,
    PartialsModule,
    CoreModule,
    OverlayModule,
    TranslateModule.forRoot(),
    InlineSVGModule.forRoot(),
    ThemeModule,
    GridModule,
    OAuthModule.forRoot(),
    TreeViewModule,
    NotificationModule,
    InputsModule,
    MatTooltipModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 2000
    }),
  ],
  exports: [],
  providers: [
    AuthService,
    LayoutConfigService,
    LayoutRefService,
    MenuConfigService,
    PageConfigService,
    KtDialogService,
    DataTableService,
    SplashScreenService,
    AuthGuard,
    SecurityService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      // layout config initializer
      provide: APP_INITIALIZER,
      useFactory: initializeLayoutConfig,
      deps: [LayoutConfigService],
      multi: true
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true,
    },
    // template services
    SubheaderService,
    MenuHorizontalService,
    MenuAsideService,
    HttpUtilsService,
    TypesUtilsService,
    AuthNoticeService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
