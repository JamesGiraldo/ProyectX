import Swal from 'sweetalert2';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RoleService } from '@services/role.service';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    constructor(private roleService: RoleService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const url: string = state.url;

        let isGenerator: boolean = this.roleService.isGenerator();
        if (!isGenerator) {
            Swal.fire({
                title: 'Autorización denegada',
                text:
                    'Usted no tiene permisos para acceder a esta área. Si existe un error comuníquese con el administrador de la plataforma!',
                icon: 'error',
            });
            this.router.navigate(['/home'], { queryParams: { returnUrl: url } });
        }
        return isGenerator;
    }
}
