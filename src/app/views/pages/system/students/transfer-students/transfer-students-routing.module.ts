import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TransferStudentsComponent} from './container/transfer-students.component';


const routes: Routes = [
  {
    path: '',
    component: TransferStudentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferStudentsRoutingModule {
}
