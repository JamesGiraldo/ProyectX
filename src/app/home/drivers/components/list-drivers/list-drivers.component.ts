import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

import { DriverService } from '@services/driver.service';
import { Item, StatusList, Driver } from '@apptypes/entities/';
import { ModalNewdriverComponent } from '../modal-newdriver/modal-newdriver.component';

@Component({
    selector: 'app-list-drivers',
    templateUrl: './list-drivers.component.html',
    styleUrls: ['./list-drivers.component.scss'],
})
export class ListDriversComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public driverType: StatusList;
    public currentElements: number = 12;
    public drivers: Driver[] = [];
    public elementPages: number;
    public page: number = 1;
    public totalPages: number;
    showActions: boolean = true;
    public isSearch;
    public searchArray: any[] = [];
    public columns = [
        { name: 'GENERAL_WORD.RELATION' },
        { name: 'GENERAL_WORD.NAME' },
        { name: 'GENERAL_WORD.IDENTIFICATION' },
        { name: 'HEADER_TABLE.PHONE' },
        { name: 'GENERAL_WORD.DOCUMENTS' },
        { name: 'HEADER_TABLE.RATING' },
    ];

    constructor(public dialog: MatDialog, private driverService: DriverService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.getDrivers(this.page, this.currentElements);
    }

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;
        this.blockUI.start('Loading...');

        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1])
            : this.getDrivers(this.page, this.currentElements);
        this.blockUI.stop();
    }

    public searchData($event) {
        $event.length > 0 ? (this.isSearch = true) : (this.isSearch = false);
        this.searchArray.push($event);

        if ($event.length === 0) this.searchArray = [];
        this.search(this.searchArray[this.searchArray?.length - 1]);
    }

    public search(searchData: any) {
        if (searchData === undefined) this.blockUI.stop();

        this.blockUI.start('Loading...');

        let query = searchData?.length > 0 ? { data: searchData } : {};

        if (searchData?.length > 0) {
            this.driverService.search(query, this.page, this.currentElements).subscribe(
                (res) => {
                    this.drivers = [...res.data.records];
                    this.elementPages = res.data.records.length;
                    this.totalPages = res.data.totalPages;

                    this.blockUI.stop();
                },
                () => this.blockUI.stop(),
            );
        } else {
            this.getDrivers(this.page, this.currentElements);
        }
    }

    public goToPage(page: number) {
        this.blockUI.start('Loading...');
        this.page = page;

        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1])
            : this.getDrivers(this.page, this.currentElements);
    }

    public openDialog(): void {
        this.dialog
            .open(ModalNewdriverComponent, {
                width: '700px',
                height: '570px',
                disableClose: true,
                data: { driver: new Driver(), refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.refresh) {
                    this.getDrivers(this.page, this.currentElements);
                }
            });
    }

    public refresh($event) {
        if ($event) this.getDrivers(this.page, this.currentElements);
    }

    private getDrivers(page: number, currentElements: number): void {
        this.driverService.getAll(page, currentElements).subscribe((res) => {
            this.showActions = true;
            this.drivers = [...res.data.records];
            this.elementPages = this.drivers.length;
            this.totalPages = res.data.totalPages;

            this.blockUI.stop();
        });
    }
}
