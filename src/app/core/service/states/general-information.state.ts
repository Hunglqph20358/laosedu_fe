import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {GeneralInformationAction, GeneralInformationUpdate} from '../actions/general-information-action';
import {tap} from 'rxjs/operators';
import {TenantModel} from '../model/tenant.model';
import {GeneralInformationService} from '../service-model/general-information.service';
import {NotiService} from "../service-model/notification.service";


export interface GeneralInformationStateModel {
  generalInformation: TenantModel;
  tenants: TenantModel[];
}

@State<GeneralInformationStateModel>({
  name:'tenants',
  defaults: {
    tenants:[],
    generalInformation:null
  }
})

@Injectable()
export class GeneralInformationState {
  constructor(private generalInformationService: GeneralInformationService, private notiService: NotiService) {
  }

  @Selector()
  static general(state: GeneralInformationStateModel){
   return state.generalInformation;
  }

  @Action(GeneralInformationAction)
  getGeneralInformation(ctx: StateContext<GeneralInformationStateModel>, {schoolId}: GeneralInformationAction){
    return this.generalInformationService.getOneGeneralInformation(schoolId).pipe(tap((result)=>{
      const state = ctx.getState();

      ctx.setState({
        ...state,
        generalInformation: result
      })
    }));
  }

  @Action(GeneralInformationUpdate)
  updateGeneralInformation(ctx: StateContext<GeneralInformationStateModel>, {schoolId, payload}: GeneralInformationUpdate){
    return this.generalInformationService.updateGeneralInformation(schoolId, payload).pipe(tap((data) =>{
      const state = ctx.getState();
      const generalInformationList = [...state.tenants]
      const index = generalInformationList.findIndex(item => item.maDinhdanh === payload.maDinhdanh)
      generalInformationList[index] = data;
      ctx.setState({
        ...state,
        tenants: generalInformationList,
      });
      this.notiService.showNoti('Cập nhật thành thành công', 'success')
    }))
  }
}
