import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { CompanyType } from '@apptypes/enums';
import { GlobalService, TripService } from '@services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { ModalColumnsComponent } from '../../../requests/components/modal-columns/modal-columns.component';
import { Item, StatusList } from '@apptypes/entities';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    selector: 'app-list-trips',
    templateUrl: './list-trips.component.html',
    styleUrls: ['./list-trips.component.scss'],
})
export class ListTripsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public currentElements: number = 12;
    public elementPages: number;
    public endDate;
    public page: number = 1;
    public index: number = 0;
    public startDate;
    public totalPages: number;
    public tripType: StatusList;
    public trips: string[] = [];
    public isSearch: boolean;
    public completed: string[] = [];
    public incompleted: string[] = [];
    isGenerator: boolean = null;
    public range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    public filterRequest = '';
    public statusOrder: boolean = true;
    public columns = [];
    public totalColumns: number = 0;
    public colspan: number;
    public filter = new FormControl('all');
    public filters = [
        { key: 'all', value: 'Todo' },
        { key: 'requested_by', value: 'Solicitado por' },
        { key: 'client', value: 'Cliente' },
        { key: 'load', value: 'Carga' },
        { key: 'origin', value: 'Origen' },
        { key: 'origin_load_place', value: 'Lugar de carga - Origen' },
        { key: 'destiny', value: 'Destino' },
        { key: 'destiny_download_place', value: 'Lugar de descargue - Destino' },
        { key: 'order_number', value: 'Número orden' },
        { key: 'trip_type', value: 'Tipo viaje' },
        { key: 'company', value: 'Empresa' },
        { key: 'driver_name', value: 'Nombre conductor' },
        { key: 'driver_id_card', value: 'ID conductor' },
        { key: 'driver_phone', value: 'Teléfono conductor' },
        { key: 'vehicle_plate', value: 'Placa vehículo' },
        { key: 'fare_value', value: 'Valor tarifa' },
        { key: 'load_length', value: 'Longitud' },
        { key: 'load_width', value: 'Ancho' },
        { key: 'load_height', value: 'Altura' },
        { key: 'load_weight', value: 'Peso' },
        { key: 'load_volume', value: 'Volumen' },
    ];
    public sortFields = [
        { key: 'Fecha de cargue', value: 'date' },
        { key: 'Fecha de publicación', value: 'createdAt' },
        { key: 'Clientes', value: 'client' },
        { key: 'Descripcion de la carga', value: 'description' },
        { key: 'Origen', value: 'name' },
        { key: 'Lugar de cargue', value: 'loadPlace' },
        { key: 'Fecha de cargue transportadora', value: 'loadDate' },
    ];
    public searchArray: any[] = [];
    public sortArray: any[] = [];

    constructor(
        private tripService: TripService,
        private readonly globalService: GlobalService,
        public dialog: MatDialog,
    ) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;

        this.tripType = new StatusList();
        this.tripType.add(new Item(0, 'Viajes', true));
        this.tripType.add(new Item(1, 'Cumplidos'));
        this.tripType.add(new Item(2, 'No Cumplidos'));

        this.endDate = this.getFormattedTomorrow();
        this.startDate = this.getFormattedLastMonths();

        this.getTrips(this.page, this.currentElements, this.startDate, this.endDate);
    }

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;

        this.blockUI.start('Loading...');
        if (this.tripType.items[0].isActive) {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getTrips(this.page, this.currentElements, this.startDate, this.endDate);
            this.blockUI.stop();
        } else if (this.tripType.items[1].isActive) {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getCompleted(this.page, this.currentElements, this.startDate, this.endDate);
            this.blockUI.stop();
        } else {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getIncompleted(this.page, this.currentElements, this.startDate, this.endDate);
            this.blockUI.stop();
        }
    }

    public getFormattedTomorrow(): string {
        const instant = moment(new Date()).add(3, 'd');
        return instant.format('YYYY-MM-DD');
    }

    public getFormattedLastMonths(): string {
        const instant = moment(new Date()).add(-5, 'M');
        return instant.format('YYYY-MM-DD');
    }

    public onUpdated($event) {
        if ($event) {
            this.getTrips(this.page, this.currentElements, this.startDate, this.endDate);
            this.getCompleted(this.page, this.currentElements, this.startDate, this.endDate);
            this.getIncompleted(this.page, this.currentElements, this.startDate, this.endDate);
        }
    }

    public toggleStatus(id: number) {
        this.blockUI.start('Loading...');
        for (let type of this.tripType.items) {
            type.isActive = false;
            if (type.id == id) type.isActive = true;
        }

        this.clearArray();
        this.page = 1;
        if (this.tripType.items[0].isActive) {
            this.index = 0;
            this.getTrips(this.page, this.currentElements, this.startDate, this.endDate);
        } else if (this.tripType.items[1].isActive) {
            this.index = 1;
            this.getCompleted(this.page, this.currentElements, this.startDate, this.endDate);
        } else {
            this.index = 2;
            this.getIncompleted(this.page, this.currentElements, this.startDate, this.endDate);
        }
    }

    public setColumns() {
        this.dialog
            .open(ModalColumnsComponent, {
                width: '650px',
                height: '600px',
                disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getTrips(this.page, this.currentElements, this.startDate, this.endDate);
                }
            });
    }

    public getRange(event: MatDatepickerInputEvent<Date>) {
        let start = moment(this.range.get('start').value).format('YYYY-MM-DD');
        let end = moment(this.range.get('end').value).format('YYYY-MM-DD');
        let startHours = moment(start).add(-4.9, 'hours').toISOString();
        let endHours = moment(end).add(18.99, 'hours').toISOString();
        if (this.range.get('start').value !== null && this.range.get('end').value !== null) {
            this.blockUI.start('Loading...');

            this.getTrips(this.page, this.currentElements, startHours, endHours);
            this.getCompleted(this.page, this.currentElements, startHours, endHours);
            this.getIncompleted(this.page, this.currentElements, startHours, endHours);
        }

        if (event.value === null) {
            this.blockUI.start('Loading...');
            this.getTrips(this.page, this.currentElements, this.startDate, this.endDate);
            this.getCompleted(this.page, this.currentElements, this.startDate, this.endDate);
            this.getIncompleted(this.page, this.currentElements, this.startDate, this.endDate);
        }
    }

    public goToPage(page: number, $event?: any) {
        this.blockUI.start('Loading...');
        switch ($event) {
            case 0:
                this.page = page;
                this.getTrips(this.page, this.currentElements, this.startDate, this.endDate);
                break;
            case 1:
                this.page = page;
                this.getCompleted(this.page, this.currentElements, this.startDate, this.endDate);
                break;
            default:
                this.page = page;
                this.getIncompleted(this.page, this.currentElements, this.startDate, this.endDate);
        }
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

    public search(searchData: any, sortData: any, statusOrder?: boolean) {
        if (searchData === undefined) this.blockUI.stop();

        let start = moment(this.range.get('start').value).toISOString();
        let end = moment(this.range.get('end').value).toISOString();

        this.blockUI.start('Loading...');

        let query = searchData?.length > 0 ? { key: this.filter.value, value: searchData } : {};
        let sort = sortData.length > 0 ? { orderMode: statusOrder ? 'ASC' : 'DESC', sortField: sortData[0].value } : {};

        if (this.tripType.items[0].isActive) {
            if (searchData?.length > 0 || sortData.length > 0) {
                this.tripService
                    .search(
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
                            this.columns = res.data.columns;
                            this.trips = [...res.data.pagination.records];
                            this.elementPages = res.data.pagination.records.length;
                            this.totalPages = res.data.pagination.totalPages;
                            this.totalColumns = res.data.columns.length;
                            this.colspan = this.totalColumns + 1;

                            this.blockUI.stop();
                        },
                        () => this.blockUI.stop(),
                    );
            } else {
                this.getTrips(this.page, this.currentElements, this.startDate, this.endDate);
            }
        } else {
            let compliment;
            if (this.tripType.items[1].isActive) compliment = true;
            if (this.tripType.items[2].isActive) compliment = false;

            if (searchData?.length > 0 || sortData.length > 0) {
                this.tripService
                    .searchCompliment(
                        {
                            query: query,
                            order: sort,
                            compliment: compliment,
                        },
                        this.page,
                        this.currentElements,
                        this.range.get('start').value === null ? moment(this.startDate).toISOString() : start,
                        this.range.get('end').value === null ? moment(this.endDate).toISOString() : end,
                    )
                    .subscribe(
                        (res) => {
                            if (this.tripType.items[1].isActive) {
                                this.columns = res.data.columns;
                                this.completed = [...res.data.pagination.records];
                                this.elementPages = res.data.pagination.records.length;
                                this.totalPages = res.data.pagination.totalPages;
                                this.totalColumns = res.data.columns.length;
                                this.colspan = this.totalColumns + 1;
                            } else {
                                this.columns = res.data.columns;
                                this.incompleted = [...res.data.pagination.records];
                                this.elementPages = res.data.pagination.records.length;
                                this.totalPages = res.data.pagination.totalPages;
                                this.totalColumns = res.data.columns.length;
                                this.colspan = this.totalColumns + 1;
                            }

                            this.blockUI.stop();
                        },
                        () => this.blockUI.stop(),
                    );
            } else {
                if (this.tripType.items[1].isActive) {
                    this.getCompleted(this.page, this.currentElements, this.startDate, this.endDate);
                } else {
                    this.getIncompleted(this.page, this.currentElements, this.startDate, this.endDate);
                }
            }
        }
    }

    private clearArray() {
        this.searchArray = [];
        this.sortArray = [];
        this.columns = [];
    }

    private getCompleted(page: number, currentElements: number, startDate: string, endDate: string) {
        this.tripService.completed(page, currentElements, startDate, endDate, { compliment: true }).subscribe(
            (res) => {
                this.columns = res.data.columns;
                this.completed = [...res.data.pagination.records];
                this.elementPages = res.data.pagination.records.length;
                this.totalPages = res.data.pagination.totalPages;
                this.totalColumns = res.data.columns.length;
                this.colspan = this.totalColumns + 1;
                this.blockUI.stop();
            },
            () => this.blockUI.stop(),
        );
    }

    private getIncompleted(page: number, currentElements: number, startDate: string, endDate: string) {
        this.tripService.completed(page, currentElements, startDate, endDate, { compliment: false }).subscribe(
            (res) => {
                this.columns = res.data.columns;
                this.incompleted = [...res.data.pagination.records];
                this.elementPages = res.data.pagination.records.length;
                this.totalPages = res.data.pagination.totalPages;
                this.totalColumns = res.data.columns.length;
                this.colspan = this.totalColumns + 1;

                this.blockUI.stop();
            },
            () => this.blockUI.stop(),
        );
    }

    public getTrips(page: number, currentElements: number, startDate: string, endDate: string) {
        this.tripService.getAll(page, currentElements, startDate, endDate).subscribe(
            (res) => {
                this.columns = res.data.columns;
                this.trips = [...res.data.pagination.records];
                this.elementPages = res.data.pagination.records.length;
                this.totalPages = res.data.pagination.totalPages;
                this.totalColumns = res.data.columns.length;
                this.colspan = this.totalColumns + 1;
                this.blockUI.stop();
            },
            () => this.blockUI.stop(),
        );
    }
}
