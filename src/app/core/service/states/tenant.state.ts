import {Injectable} from '@angular/core';
import {TenantModel} from '../model/tenant.model';
import {TenantService} from '../service-model/tenant.service';
import {Selector, StateContext, Action, State} from '@ngxs/store';
import {GetAllTenant} from '../actions/tenant.action';
import {tap} from 'rxjs/operators';
import {CommonResponseModel} from '../model/common-response.model';

@Injectable()
export class TenantStateModel {
  tenants : TenantModel[];
  common: CommonResponseModel[];
}

@State<TenantStateModel>({
  name: 'tenant',
  defaults: {
    tenants: [],
    common: []
  }
})

@Injectable()
export class TenantState{
  constructor(private tenantService: TenantService) {
  }

  @Selector()
  static getAllTenant(state: TenantStateModel) {
    return state.tenants;
  }

  @Action(GetAllTenant)
  getAllTenant({getState, setState} : StateContext<TenantStateModel>) {
    return this.tenantService.getAllTenants().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        tenants: result,
      })
    }))
  }
}
