import {Roles} from "../../../views/pages/system/role-management/model/Roles";

export class AddRoles {
  static  readonly type = '[Role] Add';

  constructor(public payload: Roles) {
  }
}


export class GetRoles {
  static readonly type = '[Role] Get';
}

export class UpdateRole {
  static readonly type = '[Role] Update';

  constructor(public payload: Roles, public id: string) {
  }
}

export class DeleteRole {
  static readonly type = '[Role] Delete';

  constructor(public id: string) {
  }
}

export class SetSelectedRole {
  static readonly type = '[Role] Set';

  constructor(public payload: Roles) {
  }
}
