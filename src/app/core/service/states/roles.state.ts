import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {RolesService} from "../service-model/roles.service";
import {AddRoles, DeleteRole, GetRoles, SetSelectedRole, UpdateRole} from "../actions/roles.action";
import {tap} from "rxjs/operators";
import {Roles} from "../../../views/pages/system/role-management/model/Roles";
import {NotiService} from "../service-model/notification.service";


@Injectable()
export class RolesStateModel {
  roles: Roles[];
  selectedRole: Roles;
}

  @State<RolesStateModel>({
    name: 'roles',
    defaults: {
      roles: [],
      selectedRole: null
    }
  })

@Injectable()
export class RolesState {
  constructor(private roleService: RolesService,
              private notiService: NotiService) {
  }

  @Selector()
  static getRoleList(state: RolesStateModel) {
    console.log("role state", state);
    return state.roles;
  }

  @Selector()
  static getSelectedRole(state: RolesStateModel) {
    return state.selectedRole;
  }

  @Action(GetRoles)
  getRoles({getState, setState}: StateContext<RolesStateModel>) {
    return this.roleService.fetchRoles().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        roles: result.items,
      });
    }));
  }

  @Action(AddRoles)
  addRole({getState, patchState}: StateContext<RolesStateModel>, {payload}: AddRoles) {
    return this.roleService.addRole(payload).pipe(tap((result) => {
      const state = getState();
      patchState({
        roles: [...state.roles, result]
      });
      // @ts-ignore
      const {error} = result;
      if (error && error.length >0) {
        const {code, message} = error;
        console.log(message)
        this.notiService.showNoti(message, 'error');
      } else {
        this.notiService.showNoti('Thêm mới thành công', 'success')
      }
    }, error => {this.notiService.showNoti('Tên vai trò bị trùng','error')}));
  }

  @Action(UpdateRole)
  updateTodo({getState, setState}: StateContext<RolesStateModel>, {payload, id}: UpdateRole) {
    return this.roleService.updateRole(payload, id).pipe(tap((result) => {
      const state = getState();
      const roleList = [...state.roles];
      const roleIndex = roleList.findIndex(item => item.id === id);
      roleList[roleIndex] = result;
      setState({
        ...state,
        roles: roleList,
      });
      this.notiService.showNoti('Cập nhật thành công', 'success');
    }, error => {this.notiService.showNoti('Tên vai trò bị trùng','error')}));
  }


  @Action(DeleteRole)
  deleteRole({getState, setState}: StateContext<RolesStateModel>, {id}: DeleteRole) {
    return this.roleService.deleteRole(id).pipe(tap(() => {
      const state = getState();
      const filteredArray = state.roles.filter(item => item.id !== id);
      setState({
        ...state,
        roles: filteredArray,
      });
      this.notiService.showNoti('Xoá thành công!','success');
    }));
  }

  @Action(SetSelectedRole)
  setSelectedTodoId({getState, setState}: StateContext<RolesStateModel>, {payload}: SetSelectedRole) {
    const state = getState();
    setState({
      ...state,
      selectedRole: payload
    });
  }
}

