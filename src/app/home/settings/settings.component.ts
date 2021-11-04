import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '@services/global.service';
import { CompanyType } from '@apptypes/enums';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    isGenerator: boolean = false;

    constructor(private readonly globalService: GlobalService, private router: Router) {}

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;

        if (this.router.url === '/settings') {
            this.router.navigateByUrl('/settings/automatic');
        }
    }

    public tabChanged(): void {
        this.blockUI.start('Loading...');

        setTimeout(() => {
            this.blockUI.stop(); // Stop blocking
        }, 500);
    }
}
