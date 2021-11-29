import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Publication } from '@entities/index';
import { GlobalService, PublicationService } from '@services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { ModalOptionsDownloadComponent } from '../modal-options-download/modal-options-download.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CompanyType } from '@apptypes/enums';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    isGenerator: boolean = false;
    public DAY: number = 1000 * 60 * 60 * 24;
    public MONTH: number = this.DAY * 7;
    public WEEK: number = this.DAY * 7;
    public history: Publication[] = [];
    public currentElements: number = 12;
    public elementPages: number;
    public endDate;
    public filterRequest = '';
    public isSearch: boolean = false;
    public page: number = 1;
    public startDate;
    public range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    public statusOrder: boolean = true;
    public sortFields = [
        { key: 'HEADER_TABLE.LOAD', value: 'description' },
        { key: 'HEADER_TABLE.LOAD_DATE', value: 'date' },
        { key: 'HEADER_TABLE.DATE_PUBLISHED', value: 'createdAt' },
        { key: 'HEADER_TABLE.MODALITY', value: 'tripModality' },
    ];
    public columns = [
        { name: 'HEADER_TABLE.TYPE', tooltip: '' },
        { name: 'HEADER_TABLE.LOAD_DATE', tooltip: 'Fecha Cargue' },
        { name: 'HEADER_TABLE.DATE_PUBLISHED', tooltip: 'Fecha Publicación' },
        { name: 'HEADER_TABLE.LOAD', tooltip: 'Carga' },
        { name: 'HEADER_TABLE.MODALITY', tooltip: 'Modalidad' },
        { name: 'HEADER_TABLE.PUBLISHED_BY', tooltip: '' },
    ];
    public searchArray: any[] = [];
    public sortArray: any[] = [];
    public totalPages: number;
    public colspan: number;

    constructor(
        private readonly globalService: GlobalService,
        private readonly publicationService: PublicationService,
        public dialog: MatDialog,
    ) {
        this.blockUI.start('Loading...');
    }

    ngOnInit() {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
        const today = new Date();
        this.startDate = moment(new Date(0)).toISOString();
        this.endDate = moment(new Date(today.getTime() + this.DAY)).toISOString();

        this.getHistory(this.page, this.currentElements, this.startDate, this.endDate);
    }

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;

        this.blockUI.start('Loading...');
        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
            : this.getHistory(this.page, this.currentElements, this.startDate, this.endDate);
        this.blockUI.stop();
    }

    public getRange(event: MatDatepickerInputEvent<Date>) {
        let start = moment(this.range.get('start').value).format('YYYY-MM-DD');
        let end = moment(this.range.get('end').value).format('YYYY-MM-DD');
        let startHours = moment(start).add(-4.9, 'hours').toISOString();
        let endHours = moment(end).add(18.99, 'hours').toISOString();

        if (this.range.get('start').value !== null && this.range.get('end').value !== null) {
            this.blockUI.start('Loading...');
            this.getHistory(this.page, this.currentElements, startHours, endHours);
        }

        if (event.value === null) {
            this.blockUI.start('Loading...');
            this.getHistory(this.page, this.currentElements, this.startDate, this.endDate);
        }
    }

    public clearRange() {
        this.blockUI.start('Loading...');
        this.range.reset();
        this.getHistory(this.page, this.currentElements, this.startDate, this.endDate);
        this.blockUI.stop();
    }

    public onDownload() {
        this.dialog
            .open(ModalOptionsDownloadComponent, {
                width: '450px',
                height: '410px',
                disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {});
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

    public search(searchData: any, sortData: any, statusOrder?: boolean) {
        if (searchData === undefined) this.blockUI.stop();

        let start = moment(this.range.get('start').value).toISOString();
        let end = moment(this.range.get('end').value).toISOString();

        this.blockUI.start('Loading...');

        let query = searchData?.length > 0 ? { key: 'all', value: searchData } : {};
        let sort = sortData.length > 0 ? { orderMode: statusOrder ? 'ASC' : 'DESC', sortField: sortData[0].value } : {};

        if (searchData?.length > 0 || sortData.length > 0) {
            this.publicationService
                .searchHistory(
                    {
                        query: query,
                        order: sort,
                    },
                    this.page,
                    this.currentElements,
                    this.range.get('start').value === null ? moment(this.startDate).toISOString() : start,
                    this.range.get('end').value === null ? moment(this.endDate).toISOString() : end,
                )
                .subscribe(
                    (res) => {
                        this.history = [...res.data.records];
                        this.elementPages = res.data.records.length;
                        this.totalPages = res.data.totalPages;
                        this.colspan = this.columns.length + 1;
                        this.blockUI.stop();
                    },
                    () => this.blockUI.stop(),
                );
        } else {
            this.getHistory(this.page, this.currentElements, this.startDate, this.endDate);
        }
    }

    public goToPage(page: number) {
        this.blockUI.start('Loading...');
        this.page = page;
        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
            : this.getHistory(this.page, this.currentElements, this.startDate, this.endDate);
        this.blockUI.stop();
    }

    /**
     * API CALLS
     */
    getHistory(page: number, elements: number, start: string, end: string) {
        this.publicationService.getHistory(page, elements, start, end).subscribe((res) => {
            this.history = [...res.data.records];
            this.elementPages = res.data.records.length;
            this.totalPages = res.data.totalPages;
            this.colspan = this.columns.length + 1;
        });

        this.blockUI.stop();
    }
}
