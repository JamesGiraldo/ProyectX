import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { RoleService } from '@services/role.service';

@Injectable({
    providedIn: 'root',
})
export class RoleTransporterGuard implements CanActivate {
    constructor(private roleService: RoleService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const url: string = state.url;

        let isTransporter: boolean = this.roleService.isTransporter();
        if (!isTransporter) {
            Swal.fire({
                title: 'Autorización denegada',
                text:
                    'Usted no tiene permisos para acceder a esta área. Si existe un error comuníquese con el administrador de la plataforma!',
                icon: 'error',
            });
            this.router.navigate(['/home'], { queryParams: { returnUrl: url } });
        }
        return isTransporter;
    }
}
