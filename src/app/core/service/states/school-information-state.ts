import {SchoolInformationModel} from '../model/school-information.model';
import {SchoolInformationService} from '../service-model/school-information.service';
import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AddData, DeleteData, DeleteMultiple, GetData, SelectedData, UpdateData} from '../actions/school-information-action';
import {tap} from 'rxjs/operators';
import {NotiService} from '../service-model/notification.service';

// @ts-ignore
@Injectable()
export class SchoolInformationStateModel{
  data: SchoolInformationModel[];
  selectedData: SchoolInformationModel;
}

@State<SchoolInformationStateModel>({
  name: 'SchoolInformationState',
  defaults: {
    data: [],
    selectedData: null
  }
})

@Injectable()
export class SchoolInformationState {
  constructor(private schoolInformationServiceService: SchoolInformationService,
              private notiService: NotiService) {
  }

  @Selector()
  static getList(state: SchoolInformationStateModel): SchoolInformationModel[]{
    return state.data;
  }

  @Selector()
  // tslint:disable-next-line:typedef
  static getDataSelected(states: SchoolInformationStateModel){
    return states.selectedData;
  }

  @Action(GetData)
  getData({getState , setState}: StateContext<SchoolInformationStateModel>){
    return this.schoolInformationServiceService.apiGetAll().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        data: result
      });
    }));
  }

  // @ts-ignore
  @Action(AddData)
  // tslint:disable-next-line:typedef
  addData({getState, patchState}: StateContext<SchoolInformationStateModel>, { createData }: AddData) {
    return this.schoolInformationServiceService.apiAdd(createData).pipe(tap((result) => {
      const state = getState();
      patchState({
        data: [...state.data, result]
      });
      const {error} = result;
      if(error && error.length > 0) {
        const {code, message} = error;
        console.log(message)
        this.notiService.showNoti(message, 'error');
      }else{
        this.notiService.showNoti('Thêm mới thành công', 'success');
      }
    },error => {this.notiService.showNoti('Thông tin điểm trường phụ bị trùng','error')}));
  }

  @Action(UpdateData)
  updateData({getState, setState}: StateContext<SchoolInformationStateModel>, {id, updateData}: UpdateData) {
    return this.schoolInformationServiceService.apiUpdate(id, updateData).pipe(tap((result) => {
      const state = getState();
      const listData = [...state.data];
      // const selectIndex = listData.findIndex(item => item.id === id);
      // listData[selectIndex] = result;
      setState({
        ...state,
        data: listData,
      });
    },error => {this.notiService.showNoti('Thông tin điểm trường phụ bị trùng','error')}));
  }


  @Action(DeleteData)
  // tslint:disable-next-line:typedef
  deleteData({getState, setState}: StateContext<SchoolInformationStateModel>, {id}: DeleteData) {
    return this.schoolInformationServiceService.apiDelete(id).pipe(tap(() => {
      const state = getState();
      // const filteredArray = state.data.filter(item => item.id !== id);
      setState({
        ...state,
        // data: filteredArray,
      });
      this.notiService.showNoti('Xoá thành công!','success');
    }));
  }

  @Action(DeleteMultiple)
  // tslint:disable-next-line:typedef
  deletemultipleData({getState, setState}: StateContext<SchoolInformationStateModel>, {id}: DeleteMultiple) {
    return this.schoolInformationServiceService.apiDeleteMany(id).pipe(tap(() => {
      const state = getState();
      // const filteredArray = state.data.filter(item => item.id !== id);
      setState({
        ...state,
        // data: filteredArray,
      });
    }));
  }

  @Action(SelectedData)
  // tslint:disable-next-line:typedef
  selectedData({getState, setState}: StateContext<SchoolInformationStateModel>, {selectedData}: SelectedData) {
    const state = getState();
    setState({
      ...state,
      selectedData
    });
  }
}
