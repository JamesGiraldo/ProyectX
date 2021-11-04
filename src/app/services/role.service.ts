import { Injectable } from '@angular/core';

import { GlobalService, AuthenticationService } from '@services/index';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor(private globalService: GlobalService, private authService: AuthenticationService) {}

    public isGenerator(): boolean {
        const token = this.globalService.getToken();
        const tokenInfo = this.authService.getDecodedAccessToken(token);
        const companyType = tokenInfo.company.type;

        if (tokenInfo !== null && tokenInfo !== undefined) return companyType === 'COMPANY.TYPE.GENERATOR';
        return false;
    }

    public isTransporter(): boolean {
        const token = this.globalService.getToken();
        const tokenInfo = this.authService.getDecodedAccessToken(token);
        const companyType = tokenInfo.company.type;

        if (tokenInfo !== null && tokenInfo !== undefined) return companyType === 'COMPANY.TYPE.TRANSPORTER';
        return false;
    }
}
