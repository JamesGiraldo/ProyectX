import { Component, OnInit } from '@angular/core';

import { GlobalService } from '@services/global.service';
import { CompanyType } from '@apptypes/enums';

@Component({
    selector: 'app-blockages',
    templateUrl: './blockages.component.html',
    styleUrls: ['./blockages.component.scss'],
})
export class BlockagesComponent implements OnInit {
    isGenerator: boolean = false;
    selectedIndex = 0;

    constructor(private readonly globalService: GlobalService) {}

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
    }
}
