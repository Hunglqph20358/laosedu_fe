// NGRX
// CRUD
import {BaseDataSource} from '../../_base/crud';

// State


export class UsersDataSource extends BaseDataSource {
  constructor() {
    super();

    // this.loading$ = this.store.pipe(
    //   select(selectUsersPageLoading)
    // );

    // this.isPreloadTextViewed$ = this.store.pipe(
    //   select(selectUsersShowInitWaitingMessage)
    // );

    // this.store.pipe(
    //   select(selectUsersInStore)
    // ).subscribe((response: QueryResultsModel) => {
    //   this.paginatorTotalSubject.next(response.totalCount);
    //   this.entitySubject.next(response.items);
    // });
  }
}
