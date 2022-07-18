import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {NotiService} from '../service-model/notification.service';
import {IdentityUser} from '../model/identityUser';
import {IdentityUserService} from '../service-model/identityUser.service';
import {GetAllIdentityUserByTenantId} from '../actions/identityUser.action';

@Injectable()
export class IdentityUserStateModel{
  data: IdentityUser[];
  selectedData: IdentityUser;
}

@State<IdentityUserStateModel>({
  name: 'IdentityUserState',
  defaults: {
    data: [],
    selectedData: null
  }
})

@Injectable()
export class IdentityUserState {
  constructor(private identityUserService: IdentityUserService,
              private notiService: NotiService) {
  }

  @Selector()
  static getList(state: IdentityUserStateModel): IdentityUser[]{
    console.log('state data',state.data)
    return state.data;
  }

  @Action(GetAllIdentityUserByTenantId)
  getData({getState , setState}: StateContext<IdentityUserStateModel>, {tenantId}: GetAllIdentityUserByTenantId){
    return this.identityUserService.apiGetAllIdentityUserByTenantId(tenantId).pipe(tap((result) => {
      const state = getState();
      console.log('result list',result);
      setState({
        ...state,
        data: result
      });
    }));
  }
}
