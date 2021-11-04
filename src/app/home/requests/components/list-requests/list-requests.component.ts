import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PublicationService, GlobalService } from '@services/index';
import { StatusList, Item } from '@apptypes/entities';
import { ModalColumnsComponent } from '../modal-columns/modal-columns.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CompanyType } from '@apptypes/enums';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    selector: 'app-list-requests',
    templateUrl: './list-requests.component.html',
    styleUrls: ['./list-requests.component.scss'],
})
export class ListRequestsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public columns = [];
    public currentElements: number = 12;
    public elementPages: number;
    public endDate;
    public index: number = 0;
    public page: number = 1;
    public publicationType: StatusList;
    public requests: string[] = [];
    public startDate;
    public totalColumns: number = 0;
    public totalPages: number;
    public range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    public filter = new FormControl('all');
    public filterRequest = '';
    public isSearch;
    public statusOrder: boolean = true;
    public isGenerator: boolean = null;
    public colspan: number;
    public filters = [
        { key: 'all', value: 'Todo' },
        { key: 'company', value: 'Empresa' },
        { key: 'load', value: 'Carga' },
        { key: 'origin', value: 'Origen' },
        { key: 'destiny', value: 'Destino' },
        { key: 'trip_type', value: 'Tipo viaje' },
    ];
    public sortFields = [
        { key: 'Fecha de cargue', value: 'date' },
        { key: 'Fecha de publicación', value: 'createdAt' },
        { key: 'Clientes', value: 'client' },
        { key: 'Descripcion de la carga', value: 'description' },
        { key: 'Origen', value: 'name' },
        { key: 'Lugar de cargue', value: 'loadPlace' },
    ];
    public searchArray: any[] = [];
    public sortArray: any[] = [];
    public state;

    /* Socket */
    public setIntervalServe;

    constructor(
        private publicationService: PublicationService,
        private readonly globalService: GlobalService,
        public dialog: MatDialog,
    ) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;

        this.endDate = this.getFormattedTomorrow();
        this.startDate = this.getFormattedLastMonths();

        this.publicationType = new StatusList();
        this.publicationType.add(new Item(0, 'Activos', true));
        this.publicationType.add(new Item(1, 'Finalizados'));
        this.publicationType.add(new Item(2, 'Cancelados'));

        this.getRequests(
            this.page,
            this.currentElements,
            this.startDate,
            this.endDate,
            this.publicationType.items[0].id,
        );
    }

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;

        this.blockUI.start('Loading...');
        if (this.publicationType.items[0].isActive) {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getRequests(
                      this.page,
                      this.currentElements,
                      this.startDate,
                      this.endDate,
                      this.publicationType.items[0].id,
                  );
            this.blockUI.stop();
        } else if (this.publicationType.items[1].isActive) {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getRequests(
                      this.page,
                      this.currentElements,
                      this.startDate,
                      this.endDate,
                      this.publicationType.items[1].id,
                  );
            this.blockUI.stop();
        } else {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getRequests(
                      this.page,
                      this.currentElements,
                      this.startDate,
                      this.endDate,
                      this.publicationType.items[2].id,
                  );
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

    public getRange(event: MatDatepickerInputEvent<Date>) {

        let start = moment(this.range.get('start').value).format('YYYY-MM-DD');
        let end = moment(this.range.get('end').value).format('YYYY-MM-DD');
        let startHours = moment(start).add(-4.9, 'hours').toISOString();
        let endHours = moment(end).add(18.99, 'hours').toISOString();
        if (this.range.get('start').value !== null && this.range.get('end').value !== null) {
            this.blockUI.start('Loading...');
            this.getRequests(this.page, this.currentElements, startHours, endHours, this.publicationType.items[0].id);
        }

        if (event.value === null) {
            this.blockUI.start('Loading...');
            if (this.publicationType.items[0].isActive) {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[0].id,
                );
            } else if (this.publicationType.items[1].isActive) {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[1].id,
                );
            } else {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[2].id,
                );
            }
        }
    }

    onDetailActionPerformed($event) {
        if ($event) {
            if (this.publicationType.items[0].isActive) {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[0].id,
                );
            } else if (this.publicationType.items[1].isActive) {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[1].id,
                );
            } else {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[2].id,
                );
            }
        }
    }

    public goToPage(page: number, $event?: any) {
        this.blockUI.start('Loading...');
        switch ($event) {
            case 0:
                this.page = page;
                this.isSearch
                    ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                    : this.getRequests(
                          this.page,
                          this.currentElements,
                          this.startDate,
                          this.endDate,
                          this.publicationType.items[0].id,
                      );
                this.blockUI.stop();
                break;
            case 1:
                this.page = page;
                this.isSearch
                    ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                    : this.getRequests(
                          this.page,
                          this.currentElements,
                          this.startDate,
                          this.endDate,
                          this.publicationType.items[1].id,
                      );
                this.blockUI.stop();
                break;
            default:
                this.page = page;
                this.isSearch
                    ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                    : this.getRequests(
                          this.page,
                          this.currentElements,
                          this.startDate,
                          this.endDate,
                          this.publicationType.items[2].id,
                      );
                this.blockUI.stop();
        }
    }

    public remove($event) {
        if ($event)
            if (this.publicationType.items[0].isActive) {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[0].id,
                );
            } else if (this.publicationType.items[1].isActive) {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[1].id,
                );
            } else {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[2].id,
                );
            }
    }

    public onUpdate($event) {
        if ($event) {
            if (this.publicationType.items[0].isActive) {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[0].id,
                );
            } else if (this.publicationType.items[1].isActive) {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[1].id,
                );
            } else {
                this.getRequests(
                    this.page,
                    this.currentElements,
                    this.startDate,
                    this.endDate,
                    this.publicationType.items[2].id,
                );
            }
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
                    if (this.publicationType.items[0].isActive) {
                        this.getRequests(
                            this.page,
                            this.currentElements,
                            this.startDate,
                            this.endDate,
                            this.publicationType.items[0].id,
                        );
                    } else if (this.publicationType.items[1].isActive) {
                        this.getRequests(
                            this.page,
                            this.currentElements,
                            this.startDate,
                            this.endDate,
                            this.publicationType.items[1].id,
                        );
                    } else {
                        this.getRequests(
                            this.page,
                            this.currentElements,
                            this.startDate,
                            this.endDate,
                            this.publicationType.items[2].id,
                        );
                    }
                }
            });
    }

    public toggleStatus(id: number) {
        this.blockUI.start('Loading...');
        for (let type of this.publicationType.items) {
            type.isActive = false;
            if (type.id == id) type.isActive = true;
        }

        this.page = 1;
        if (this.publicationType.items[0].isActive) {
            this.index = 0;
            this.getRequests(1, this.currentElements, this.startDate, this.endDate, this.publicationType.items[0].id);
        } else if (this.publicationType.items[1].isActive) {
            this.index = 1;
            this.getRequests(1, this.currentElements, this.startDate, this.endDate, this.publicationType.items[1].id);
        } else {
            this.index = 2;
            this.getRequests(1, this.currentElements, this.startDate, this.endDate, this.publicationType.items[2].id);
        }
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
        this.state;
        switch (this.index) {
            case 0:
                this.state = 'STATE.ACTIVE';
                break;
            case 1:
                this.state = 'STATE.FINISHED';
                break;
            default:
                this.state = 'STATE.CANCELED' || 'STATE.REJECTED';
        }

        let start = moment(this.range.get('start').value).toISOString();
        let end = moment(this.range.get('end').value).toISOString();

        this.blockUI.start('Loading...');

        let query = searchData?.length > 0 ? { key: this.filter.value, value: searchData } : {};
        let sort = sortData.length > 0 ? { orderMode: statusOrder ? 'ASC' : 'DESC', sortField: sortData[0].value } : {};

        this.publicationService
            .search(
                {
                    query: query,
                    order: sort,
                },
                this.page,
                this.currentElements,
                this.range.get('start').value === null ? moment(this.startDate).toISOString() : start,
                this.range.get('end').value === null ? moment(this.endDate).toISOString() : end,
                this.state,
            )
            .subscribe((res) => {
                this.columns = res.data.columns;
                this.requests = [...res.data.pagination.records];
                this.elementPages = res.data.pagination.records.length;
                this.totalPages = res.data.pagination.totalPages;
                this.totalColumns = res.data.columns.length;
                this.colspan = this.totalColumns + 1;
                this.blockUI.stop();
            });
    }

    private getRequests(
        page: number,
        currentElements: number,
        startDate: string,
        endDate: string,
        stateRequest?: number,
    ): void {
        switch (stateRequest) {
            case 0:
                this.state = 'STATE.ACTIVE';
                break;
            case 1:
                this.state = 'STATE.FINISHED';
                break;
            default:
                this.state = 'STATE.CANCELED' || 'STATE.REJECTED';
        }

        this.publicationService.getAll(page, currentElements, startDate, endDate, this.state).subscribe((res) => {
            this.columns = res.data.columns;
            this.requests = [...res.data.pagination.records];
            this.elementPages = res.data.pagination.records.length;
            this.totalPages = res.data.pagination.totalPages;
            this.totalColumns = res.data.columns.length;
            this.colspan = this.totalColumns + 1;
            this.blockUI.stop();
        });
    }

    ngOnDestroy() {
    }
}
