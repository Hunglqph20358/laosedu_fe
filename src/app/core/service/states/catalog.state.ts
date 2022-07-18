import {CatalogModel} from "../model/catalog.model";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {CatalogService} from "../service-model/catalog.service";
import {GeneralInformationAction} from "../actions/general-information-action";
import {tap} from "rxjs/operators";
import {GeneralInformationStateModel} from "./general-information.state";
import {GetCatalog} from "../actions/catalog.action";
import {Injectable} from "@angular/core";

export interface CatalogStateModel {
  catalogs: CatalogModel[];
  catalogStandard: CatalogModel[];
  catalogLevel: CatalogModel[];
  catalogEdu: CatalogModel[];
  catalogAgency: CatalogModel[];
  catalogTypeSchool: CatalogModel[];
  catalogTypeSchool2: CatalogModel[];
  catalogAreas: CatalogModel[];
}

@State<CatalogStateModel>({
  name: 'catalogs',
  defaults: {
    catalogs: [],
    catalogStandard: [],
    catalogLevel: [],
    catalogEdu: [],
    catalogAgency: [],
    catalogTypeSchool: [],
    catalogTypeSchool2: [],
    catalogAreas: [],
  }
})
@Injectable()
export class CatalogState {
  constructor(private catalogService: CatalogService) {
  }

  @Selector()
  static getCatalog(state: CatalogStateModel) {
    return state.catalogs;
  }
  @Selector()
  static getCatalogStandard(state: CatalogStateModel){
    return state.catalogStandard;
  }

  @Selector()
  static getCatalogLevel(state: CatalogStateModel){
    return state.catalogLevel;
  }
  @Selector()
  static getCatalogEdu(state: CatalogStateModel){
    return state.catalogEdu;
  }
  @Selector()
  static getCatalogAgency(state: CatalogStateModel){
    return state.catalogAgency;
  }
  @Selector()
  static getCatalogTypeSchool(state: CatalogStateModel){
    return state.catalogTypeSchool;
  }
  @Selector()
  static getCatalogTypeSchool2(state: CatalogStateModel){
    return state.catalogTypeSchool2;
  }
  @Selector()
  static getCatalogAreas(state: CatalogStateModel){
    return state.catalogAreas;
  }
  @Action(GetCatalog)
  getCatalog(ctx: StateContext<CatalogStateModel>, {categoryCode}: GetCatalog) {
    return this.catalogService.getCatalog(categoryCode).pipe(tap((result) => {
      const state = ctx.getState();
      // console.log(result)
      // if (categoryCode === 'DM_MUC_DAT_CHUAN_QG_CLGD') {
      //   console.log(result);
      //   ctx.setState({
      //     ...state,
      //     catalogStandard: result,
      //   })
        switch (categoryCode) {
          case 'DM_MUC_DAT_CHUAN_QG_CLGD':
            ctx.setState({
              ...state,
              catalogStandard: result,
            })
            break;
          case 'DM_CAP_HOC':
            ctx.setState({
              ...state,
              catalogLevel: result,
            })
            break;
          case 'DM_HINH_THUC_DAO_TAO':
            ctx.setState({
              ...state,
              catalogEdu: result,
            })
            break;
          case 'DM_CAP_DON_VI':
            ctx.setState({
              ...state,
              catalogAgency: result,
            })
            break;
          case 'DM_LOAI_TRUONG':
            ctx.setState({
              ...state,
              catalogTypeSchool: result,
            })
            break;
          case 'DM_HINH_THUC_DAO_TAO_HOC_TAP':
            ctx.setState({
              ...state,
              catalogTypeSchool2: result,
            })
            break;
          case 'DM_KHU_VUC':
            ctx.setState({
              ...state,
              catalogAreas: result,
            })
            break;

          default:ctx.setState({
            ...state,
            catalogs: result,
          })

        }
    }));
  }

  // @Action(GetCatalogStandard)
  // getCatalogStandard(ctx: StateContext<CatalogStateModel>, {catagoryCode}: GetCatalogStandard) {
  //   return this.catalogService.getCatalog(catagoryCode).pipe(tap((result) => {
  //     const state = ctx.getState();
  //     ctx.setState({
  //       ...state,
  //       catalogStandard: result
  //     })
  //   }));
  // }
}
