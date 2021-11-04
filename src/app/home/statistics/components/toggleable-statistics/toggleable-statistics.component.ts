import { Component, OnInit } from '@angular/core';

import { GlobalService } from '@services/global.service';
import { CompanyType } from '@apptypes/enums';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-toggleable-statistics',
    templateUrl: './toggleable-statistics.component.html',
    styleUrls: ['./toggleable-statistics.component.scss'],
})
export class ToggleableStatisticsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    isGenerator: boolean = false;

    constructor(private readonly globalService: GlobalService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
    }
}
