// Angular
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
// RxJS
import {Observable, of} from 'rxjs';
// NGRX
// Module reducers and selectors

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor( private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const moduleName = route.data.moduleName as string;
    if (!moduleName) {
      return of(false);
    }

    // return this.store
    //   .pipe(
    //     select(currentUserPermissions),
    //     map((permissions: Permission[]) => {
    //       const perm = find(permissions, (elem: Permission) => {
    //         return elem.title.toLocaleLowerCase() === moduleName.toLocaleLowerCase();
    //       });
    //       return perm ? true : false;
    //     }),
    //     tap(hasAccess => {
    //       if (!hasAccess) {
    //         this.router.navigateByUrl('/error/403');
    //       }
    //     })
    //   );
  }
}
