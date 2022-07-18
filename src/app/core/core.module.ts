// Anglar
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// Layout Directives
// Services
import {
  ContentAnimateDirective,
  FirstLetterPipe,
  GetObjectPipe,
  HeaderDirective,
  JoinPipe,
  MenuDirective,
  OffcanvasDirective,
  SafePipe,
  ScrollTopDirective,
  SparklineChartDirective,
  StickyDirective,
  TabClickEventDirective,
  TimeElapsedPipe,
  ToggleDirective, TooltipDirective
} from './_base/layout';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {SchoolInformationState} from './service/states/school-information-state';
import {environment} from '../../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {GeneralInformationState} from './service/states/general-information.state';
import {ProvinceState} from './service/states/province.state';
import {DistrictState} from './service/states/district.state';
import {IdentityUserState} from './service/states/identityUser.state';
import {CatalogState} from './service/states/catalog.state';
import {ClassroomState} from './service/states/classroom.state';
import {WardsState} from './service/states/wards.state';
import {FieldFocusDirective} from './_base/layout/directives/field-focus.directive';
import {MatTooltipModule} from "@angular/material/tooltip";
// import {FocusFormGroupDirective} from './_base/layout/directives/focus-form-group.directive';


@NgModule({
  imports: [CommonModule,
    NgxsModule.forRoot([
      SchoolInformationState,
      GeneralInformationState,
      ClassroomState,
      ProvinceState,
      DistrictState,
      CatalogState,
      WardsState,
      IdentityUserState
    ], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    HttpClientModule,
    MatTooltipModule
  ],
  declarations: [
    // directives
    ScrollTopDirective,
    HeaderDirective,
    OffcanvasDirective,
    ToggleDirective,
    MenuDirective,
    TabClickEventDirective,
    SparklineChartDirective,
    ContentAnimateDirective,
    StickyDirective,
    // pipes
    TimeElapsedPipe,
    JoinPipe,
    GetObjectPipe,
    SafePipe,
    FirstLetterPipe,
    FieldFocusDirective,
    TooltipDirective,
    // FocusFormGroupDirective
  ],
  exports: [
    // directives
    ScrollTopDirective,
    HeaderDirective,
    OffcanvasDirective,
    ToggleDirective,
    MenuDirective,
    TabClickEventDirective,
    SparklineChartDirective,
    ContentAnimateDirective,
    StickyDirective,
    // pipes
    TimeElapsedPipe,
    JoinPipe,
    GetObjectPipe,
    SafePipe,
    FirstLetterPipe,
    FieldFocusDirective,
    TooltipDirective,
    // FocusFormGroupDirective
  ],
  providers: []
})
export class CoreModule {
}
