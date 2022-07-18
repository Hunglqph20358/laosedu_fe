// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
// Selectors
import { selectQueryResult, selectRolesPageLoading, selectRolesShowInitWaitingMessage } from '../_selectors/role.selectors';

export class RolesDataSource extends BaseDataSource {
  constructor() {
    super();
  }
}
