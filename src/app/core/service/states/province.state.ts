import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {NotiService} from '../service-model/notification.service';
import {ProvinceModel} from '../model/province.model';
import {ProvinceData, ProvinceService} from '../service-model/province.service';
import {GetAllProvince} from '../actions/province-action';

@Injectable()
export class ProvinceStateModel{
  data: ProvinceModel[];
  selectedData: ProvinceModel;
}

@State<ProvinceStateModel>({
  name: 'ProvinceState',
  defaults: {
    data: null,
    selectedData: null
  }
})

@Injectable()
export class ProvinceState {
  constructor(private provinceService: ProvinceService,
              private notiService: NotiService) {
  }

  @Selector()
  static getList(state: ProvinceStateModel): ProvinceModel[]{
    return state.data;
  }

  @Action(GetAllProvince)
  getData({getState , setState}: StateContext<ProvinceStateModel>){
    return this.provinceService.apiGetAllProvince().pipe(tap((result) => {
      const state = getState();
      // @ts-ignore
      setState({
        ...state,
        data: result.items
      });
    }));
  }
}
