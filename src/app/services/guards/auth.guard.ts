import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '@services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthenticationService, private router: Router, private toastr: ToastrService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(next, state);
    }

    /**
     * @description Verificación de logueo. Sí el usuario no está logueado lo enviará de inmediato al login.
     */
    private checkLogin(url: string) {
        if (this.authService.isLoggedIn()) {
            return true;
        }

        this.authService.redirectUrl = url;

        this.toastr.warning(
            'Usted no tiene permisos para acceder a esta área. Para ingresar al área debe iniciar sesión previamente!',
            'Autorización denegada',
            { timeOut: 7000 },
        );

        this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
    }
}
