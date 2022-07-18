import {Schedule} from './schedule';

export interface MappedSchedules {
  [key: string]: { [key: string]: Schedule };
}
