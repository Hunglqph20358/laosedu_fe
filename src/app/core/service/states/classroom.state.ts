import {Injectable} from "@angular/core";
import {ClassroomModel} from "../model/classroom.model";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {tap} from "rxjs/operators";
import {ClassroomService} from "../service-model/classroom.service";
import {GetAllClassroom} from "../actions/classroom.action";

@Injectable()
export class ClassroomStateModel {
  classrooms : ClassroomModel[];
}
@State<ClassroomStateModel>({
  name: 'classroom',
  defaults: {
    classrooms: []
  }
})
@Injectable()
export class ClassroomState{
  constructor(private classroomService: ClassroomService) {
  }

  @Selector()
  static getAllClassroom(state: ClassroomStateModel) {
    return state.classrooms;
  }

  @Action(GetAllClassroom)
  getAllClassroom({getState, setState} : StateContext<ClassroomStateModel>) {
    return this.classroomService.getAllClassroom().pipe(tap((result) => {
      console.log('result from action',result);
      const state = getState();
      setState({
        ...state,
        classrooms: result,
      })
    }))
  }
}
