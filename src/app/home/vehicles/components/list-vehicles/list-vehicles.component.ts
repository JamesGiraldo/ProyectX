import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalNewvehicleComponent } from '../modal-newvehicle/modal-newvehicle.component';
import { Vehicle } from '@apptypes/entities/vehicle';
import { VehicleService } from '@services/vehicle.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-list-vehicles',
    templateUrl: './list-vehicles.component.html',
    styleUrls: ['./list-vehicles.component.scss'],
})
export class ListVehiclesComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public colNames: string[];
    public filterDriver = '';
    public page: number = 1;
    public totalPages: number;
    public elementPages: number;
    public vehicles: Vehicle[] = [];
    public isSearch;
    public searchArray: any[] = [];
    public currentElements: number = 12;
    public columns = [
        { name: 'GENERAL_WORD.RELATION' },
        { name: 'GENERAL_WORD.PLATE' },
        { name: 'GENERAL_WORD.TYPE' },
        { name: 'HEADER_TABLE.CAPACITY' },
        { name: 'GENERAL_WORD.DOCUMENTS' },
        { name: 'GENERAL_WORD.ASSIGNED_DRIVER' },
    ];

    constructor(public dialog: MatDialog, private vehicleService: VehicleService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.getVehicles(this.page, this.currentElements);
    }

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;
        this.blockUI.start('Loading...');
        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1])
            : this.getVehicles(this.page, this.currentElements);
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
            this.vehicleService.search(query, this.page, this.currentElements).subscribe(
                (res) => {
                    this.vehicles = [...res.data.records];
                    this.elementPages = res.data.records.length;
                    this.totalPages = res.data.totalPages;

                    this.blockUI.stop();
                },
                () => this.blockUI.stop(),
            );
        } else {
            this.getVehicles(this.page, this.currentElements);
        }
    }

    public goToPage(page: number) {
        this.blockUI.start('Loading...');
        this.page = page;
        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1])
            : this.getVehicles(this.page, this.currentElements);
    }

    public openDialog(): void {
        this.dialog
            .open(ModalNewvehicleComponent, {
                width: '650px',
                height: '520px',
                disableClose: true,
                data: { vehicle: new Vehicle(), refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.refresh) {
                    this.getVehicles(this.page, this.currentElements);
                }
            });
    }

    public refresh($event) {
        if ($event) this.getVehicles(this.page, this.currentElements);
    }

    private getVehicles(page: number, currentElements: number): void {
        this.vehicleService.getAll(page, currentElements).subscribe((res) => {
            this.vehicles = [...res.data.records];
            this.elementPages = this.vehicles.length;
            this.totalPages = res.data.totalPages;
            this.blockUI.stop();
        });
    }
}
