import {Moment} from 'moment';

export interface GroupTeacherModel {
  id?: number;
  code?: string;
  name?: string;
  createDate?: Moment;
  creator?: string;
}
