import {WardsModel} from '../model/wards.model';
import {WardsAction} from '../actions/wards.action';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {WardsService} from '../service-model/wards.service';
import {tap} from 'rxjs/operators';
import {Observable} from "rxjs";

export interface WardsStateModel {
  wards: WardsModel[];
}

@State<WardsStateModel>({
  name: 'wards',
  defaults:{
  wards: []
  }
})
@Injectable()
export class WardsState{
  constructor(private wardsService: WardsService) {
  }
  @Selector()
  static getWards(state: WardsStateModel) {
    return state.wards;
  }
  @Action(WardsAction)
  getWards(ctx: StateContext<WardsStateModel>, {maHuyen}: WardsAction) {
return this.wardsService.getWardsInDistrict(maHuyen).pipe(tap(result =>{
  const state = ctx.getState();
  console.log(result)
  ctx.setState({
    ...state,
    wards: result.items
  })
}));
  }
}
