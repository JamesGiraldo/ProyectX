import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Fare, FareRecord } from '@entities/fare';
import { FareService } from '@services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalMassiveFareComponent } from './modal-massive-fare/modal-massive-fare.component';
import { ModalNewfareComponent } from './modal-newfare/modal-newfare.component';

interface transporterFares {
    transporterId: number;
    transporterName: string;
    count: number;
}

@Component({
    selector: 'app-fares',
    templateUrl: './fares.component.html',
    styleUrls: ['./fares.component.scss'],
})
export class FaresComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public colNames: string[];
    public translateKeys: string[] = ['Nombre', 'Fecha'];
    public currentElements: number = 12;
    public elementPages: number;
    public fares: transporterFares[] = [];
    public page: number = 1;
    public records: FareRecord;
    public showFareTable: boolean = false;
    public totalPages: number;
    public isShow: boolean;
    public topPosToStartShowing = 100;
    public isSearch;
    public searchArray: any[] = [];
    public sortArray: any[] = [];
    public sortFields = [{ key: '', value: '' }];
    public statusOrder: boolean = true;

    constructor(private fareService: FareService, public dialog: MatDialog) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.setColumnNames();
        this.getFares(this.page, this.currentElements);
    }

    @HostListener('window:scroll')
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        if (scrollPosition > this.topPosToStartShowing) {
            this.isShow = true;
        } else {
            this.isShow = false;
        }
    }

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;
        this.blockUI.start('Loading...');
        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
            : this.getFares(this.page, this.currentElements);
        this.blockUI.stop();
    }

    public sortData($event) {
        this.sortArray = [];
        this.statusOrder = !this.statusOrder;
        let order = this.sortFields.find((x) => x.key === $event.srcElement.id);
        this.sortArray.push(order);

        this.search(this.searchArray[this.searchArray.length - 1], this.sortArray, this.statusOrder);
    }

    public searchData($event) {
        $event.length > 0 ? (this.isSearch = true) : (this.isSearch = false);
        this.searchArray.push($event);

        if ($event.length === 0) this.searchArray = [];
        this.search(this.searchArray[this.searchArray?.length - 1], this.sortArray);
    }

    public search(searchData: any, sortData: any, statusOrder?: boolean) {}

    gotoTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }

    public goToPage(page: number) {
        this.page = page;
        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
            : this.getFares(this.page, this.currentElements);
    }

    setColumnNames() {
        this.colNames = [];
        for (let index = 0; index < this.translateKeys.length; index++) {
            this.colNames.push(`FARE.COLUMNS.${this.translateKeys[index]}`);
        }
    }

    /**
     * EVENT HANLDERS
     */
    public openDialog() {
        this.dialog
            .open(ModalNewfareComponent, {
                width: '850px',
                height: '600px',
                disableClose: true,
                data: { fare: new Fare(), refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.refresh) this.getFares(this.page, this.currentElements);
            });
    }

    public openDialogMassive() {
        this.dialog
            .open(ModalMassiveFareComponent, {
                width: '450px',
                height: '220px',
                disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) this.getFares(this.page, this.currentElements);
            });
    }

    public onFareDetailRemoved(fareId: number) {
        if (fareId === 1) this.getFares(this.page, this.currentElements);

        const indexToRemove = this.fares.findIndex((f) => f.transporterId == fareId);
        this.fares.splice(indexToRemove, 1);
    }

    /**
     * API CALLS
     */
    private getFares(page: number, currentElements: number): void {
        this.fareService.getAll(page, currentElements).subscribe((res) => {
            this.fares = [...res.data.records] as transporterFares[];
            this.elementPages = this.fares.length;
            this.totalPages = res.data.totalPages;
            this.blockUI.stop();
        });
    }
}
