// Angular
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
// RxJS
// NGRX
// Auth reducers and selectors
import {AuthService} from '../_services';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private store: Store<AppState>, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> {
//     return this.store.pipe(
//       select(isLoggedIn),
//       tap((loggedIn) => {
//         if (!loggedIn) {
//           this.router.navigateByUrl('/auth/login');
//         }
//       })
//     );
//   }
// }

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(
      private authService: AuthService,
      private router: Router
      ) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    public canLoad(route: Route): boolean {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    private checkLogin(url: string): boolean {
        if (this.authService.isAuthorized) {
            return true;
        }

        this.router.navigate(['/auth/login'], {queryParams: { returnUrl: url }});

        return false;
    }
}
