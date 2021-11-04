import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService, GlobalService } from '@services/index';
import { RoleService } from '@services/role.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    public currentUser: any;
    public isGeneradora: boolean = false;
    public activeLang = 'es';
    public cache = false;
    public cacheWhitelist = ['mapbox-tiles'];
    constructor(
        private authService: AuthenticationService,
        private globalService: GlobalService,
        private roleService: RoleService,
        private router: Router,
        private toastr: ToastrService,
        public translate: TranslateService,
    ) {}

    ngOnInit(): void {
        this.verifyCache();

        this.translate.setDefaultLang(this.activeLang);
        this.isGeneradora = this.roleService.isGenerator();
        const token = this.globalService.getToken();
        let tokenInfo = this.authService.getDecodedAccessToken(token);
        let role = tokenInfo.type.split('USER.TYPE.');

        this.currentUser = {
            nameShort: tokenInfo.firstName1,
            name: tokenInfo.firstName1 + ' ' + tokenInfo.lastName1,
            photo: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/user-male-icon.png',
            company: tokenInfo.company.name,
            role: role[1],
        };
    }

    public verifyCache() {
        caches.keys().then((keyList) => {
            keyList.map((key) => {
                if (keyList.length >= 5) {
                    if (this.cacheWhitelist.indexOf(key) === -1) {
                        this.cache = true;
                    }
                }
            });
        });
    }

    public clearCache() {
        caches.keys().then((keyList) => {
            keyList.map((key) => {
                if (this.cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            });
        });

        window.location.href = window.location.href;
    }

    public goToProfile() {
        this.router.navigate(['/profile']);
    }

    public goToSettings() {
        if (this.isGeneradora) {
            this.router.navigate(['/settings/automatic']);
        } else {
            this.router.navigate(['/settings/customer-service']);
        }
    }

    public logout() {
        this.toastr.info('Cerrando sesión...', '', { timeOut: 1000 });

        setTimeout(() => {
            this.authService.logout();
        }, 1500);
    }
}
