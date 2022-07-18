import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {NotiService} from '../service-model/notification.service';
import {DistrictService} from '../service-model/district.service';
import {DistrictModel} from '../model/district.model';
import {GetAllDistrict} from '../actions/district-action';
import {DeleteMultiple} from '../actions/school-information-action';

@Injectable()
export class DistrictStateModel{
  data: DistrictModel[];
  selectedData: DistrictModel;
}

@State<DistrictStateModel>({
  name: 'DistrictState',
  defaults: {
    data: null,
    selectedData: null
  }
})

@Injectable()
export class DistrictState {
  constructor(private districtService: DistrictService,
              private notiService: NotiService) {
  }

  @Selector()
  static getList(state: DistrictStateModel): DistrictModel[]{
    return state.data;
  }

  @Action(GetAllDistrict)
  getData({getState , setState}: StateContext<DistrictStateModel>, {idProvince}: GetAllDistrict){
    return this.districtService.apiGetAllDistrictByIdProvince(idProvince).pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        data: result.items
      });
    }));
  }
}
