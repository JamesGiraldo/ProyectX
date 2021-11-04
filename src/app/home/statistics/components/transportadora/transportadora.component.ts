import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { Driver } from '@apptypes/entities/driver';
import { DriverService } from '@services/driver.service';

@Component({
    selector: 'app-transportadora',
    templateUrl: './transportadora.component.html',
    styleUrls: ['./transportadora.component.scss'],
})
export class TransportadoraComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public page: number = 1;
    public totalPages: number;
    public currentElements: number = 12;
    public drivers: Driver[] = [];
    public elementPages: number;

    constructor(private driverService: DriverService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.getDrivers(this.page, this.currentElements);
    }

    public goToPage(page: number) {
        this.page = page;
        this.getDrivers(this.page, this.currentElements);
    }

    private getDrivers(page: number, currentElements: number): void {
        this.driverService.getAll(page, currentElements).subscribe((res) => {
            this.drivers = [...res.data.records].sort((a: any, b: any) => {
                if (b.rating < a.rating) {
                    return -1;
                } else if (a.rating > b.rating) {
                    return 1;
                } else {
                    return 0;
                }
            });
            this.elementPages = this.drivers.length;
            this.totalPages = res.data.totalPages;
            this.blockUI.stop();
        });
    }
}
