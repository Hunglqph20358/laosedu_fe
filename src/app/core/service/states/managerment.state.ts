import {ManagermentModel} from '../model/managerment.model';
import {Selector, State, Action, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {ManagermentService} from '../service-model/managerment.service';
import {GetManagerments} from '../actions/managerment-action';

export class ManagermentStateModel {
  management: ManagermentModel[];
}

@State<ManagermentStateModel>({
  name: 'management',
  defaults: {
    management: []
  }
})
@Injectable()
export class ManagermentState {
  constructor(private managermentService: ManagermentService) {
  }

  @Selector()
  static manager(state: ManagermentStateModel){
    return state.management;
  }

  @Action(GetManagerments)
  getManagerments(ctx: StateContext<ManagermentStateModel>){
    return this.managermentService.getManagerments().subscribe( data => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        management: data.items
      })
    });
  }

}
