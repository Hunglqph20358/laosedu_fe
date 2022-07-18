import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import {NgbButtonsModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import {UpdateScoreboardComponent} from './update-scoreboard/update-scoreboard.component';
import {ScoreboardComponent} from './scoreboard.component';
import {CreateScoreboardComponent} from './create-scoreboard/create-scoreboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipComponent } from './tooltip/tooltip.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ScoreboardComponent
  },
  {
    path: 'scoreboard/update-score',
    component:UpdateScoreboardComponent
  },{
    path: 'scoreboard/create-score',
    component:CreateScoreboardComponent
  }
]

@NgModule({
  declarations: [
    UpdateScoreboardComponent,
    CreateScoreboardComponent,
    TooltipComponent
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([]),
    MatDialogModule,
    NgbButtonsModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    MatTooltipModule,
    TranslateModule
  ],
  entryComponents: [
    UpdateScoreboardComponent,
    TooltipComponent
  ]
})
export class ScoreboardModule {}
