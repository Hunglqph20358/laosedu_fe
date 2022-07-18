import {publish} from 'rxjs/operators';

export class FilterItems{
  propertyName: string;
  value: any;
  comparison: ComparisonOperator;
}
export class GridParam {
  sort: string;
  sortDirection: SortDirection;
  filterItems: FilterItems[];
  searchText: string;
  skipCount: number;
  maxResultCount: number;
}

export enum SortDirection {
  ASC = 0,
  DESC = 1
}

export enum ComparisonOperator {
  Equal = 0,
  LessThan = 1,
  LessThanOrEqual = 2,
  GreaterThan = 3,
  GreaterThanOrEqual = 4,
  NotEqual = 5,
  Contains = 6,
  StartsWith = 7,
  EndsWith = 8,
  In = 9
}
