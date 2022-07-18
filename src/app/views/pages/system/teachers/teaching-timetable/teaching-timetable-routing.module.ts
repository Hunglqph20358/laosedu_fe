import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TeachingTimetableComponent} from './container/teaching-timetable.component';


const routes: Routes = [
  {
    path: '',
    component: TeachingTimetableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachingTimetableRoutingModule {
}
