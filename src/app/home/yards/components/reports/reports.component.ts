import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { YardService } from '@services/yard.service';
import { ReportYardControl } from '@apptypes/entities';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public yardControl = new FormControl([]);
    public stageControl = new FormControl([]);
    public range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    public averageStages;
    public colspan: number;
    public columns;
    public currentElements: number = 12;
    public elementPages: number;
    public endDate;
    public idYard: number;
    public page: number = 1;
    public reports: any[] = [];
    public stages: string[] = [];
    public startDate;
    public totalPages: number;
    public vehicleEntering: number;
    public vehicleLeaving: number;
    public yards: string[] = [];

    /* ID's */
    public idYards = [];
    public idStages = [];

    constructor(private readonly yardService: YardService, private router: Router) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.endDate = this.getFormattedTomorrow();
        this.startDate = this.getFormattedLastMonths();

        this.getYards();
        const data = {
            yardsId: [],
            stages: [],
            searchParam: '',
        };
        this.getReports(this.page, this.currentElements, this.startDate, this.endDate, data);
        this.getCountVehicles(this.page, this.currentElements, this.startDate, this.endDate, data);
        this.getStagesAverages(this.page, this.currentElements, this.startDate, this.endDate, data);
    }

    getCurrentElements($event) {
        this.currentElements = $event;
        const data = {
            yardsId: [],
            stages: [],
            searchParam: '',
        };

        if ($event > 12) this.page = 1;
        this.blockUI.start('Loading...');
        this.getReports(this.page, this.currentElements, this.startDate, this.endDate, data);
        this.blockUI.stop();
    }

    public onYardRemoved(yard: string) {
        const yards = this.yardControl.value as string[];
        this.removeFirst(yards, yard);
        this.yardControl.setValue(yards);
    }

    public onStageRemoved(stage: string) {
        const stages = this.stageControl.value as string[];
        this.removeFirst(stages, stage);
        this.stageControl.setValue(stages);
    }

    public convertTimeElapsed(timeMs: any) {
        let hours = Math.floor((timeMs / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((timeMs % 3600000) / 60000);
        let seconds = Math.floor((timeMs / 1000) % 60);

        return hours + 'h ' + minutes + 'm ' + seconds + 's';
    }

    public changeRange() {
        this.blockUI.start('Loading...');

        if (this.yardControl.value.length > 0)
            this.yardControl.value.forEach((element) => {
                this.idYards.push(element.id);
            });

        if (this.stageControl.value.length > 0)
            this.stageControl.value.forEach((element) => {
                this.idStages.push(element);
            });

        const data = {
            yardsId: this.idYards,
            stages: this.idStages,
            searchParam: '',
        };

        this.getStages(this.idYards);
        this.getReports(this.page, this.currentElements, this.startDate, this.endDate, data);
        this.getCountVehicles(this.page, this.currentElements, this.startDate, this.endDate, data);
        this.getStagesAverages(this.page, this.currentElements, this.startDate, this.endDate, {
            yardsId: this.idYards,
            stages: this.idStages,
        });

        this.columns = [];
        this.clearArrayID();
    }

    private clearArrayID() {
        this.idYards = [];
        this.idStages = [];
    }

    public getFormattedTomorrow(): string {
        const instant = moment(new Date()).add(3, 'd');
        return instant.format('YYYY-MM-DD');
    }

    public getFormattedLastMonths(): string {
        const instant = moment(new Date()).add(-5, 'M');
        return instant.format('YYYY-MM-DD');
    }

    handleSearchChange($event) {
        let start = moment(new Date()).format('YYYY-MM-DD');
        let end = moment(new Date()).format('YYYY-MM-DD');
        let startHours = moment(start).add(-4.9, 'hours').toISOString();
        let endHours = moment(end).add(18.99, 'hours').toISOString();

        if ($event?.length > 0) {
            this.getReports(this.page, this.currentElements, startHours, endHours, {
                yardsId: this.idYards,
                stages: this.idStages,
                searchParam: $event,
            });
        } else {
            this.getReports(this.page, this.currentElements, this.startDate, this.endDate, {
                yardsId: [],
                stages: [],
                searchParam: '',
            });
        }
    }

    public getRange(event: MatDatepickerInputEvent<Date>) {
        let start = moment(this.range.get('start').value).format('YYYY-MM-DD');
        let end = moment(this.range.get('end').value).format('YYYY-MM-DD');
        let startHours = moment(start).add(-4.9, 'hours').toISOString();
        let endHours = moment(end).add(18.99, 'hours').toISOString();

        if (this.range.get('start').value !== null && this.range.get('end').value !== null) {
            this.blockUI.start('Loading...');
            this.getReports(this.page, this.currentElements, startHours, endHours, {
                yardsId: this.idYards,
                stages: this.idStages,
            });
            this.getCountVehicles(this.page, this.currentElements, startHours, endHours, {
                yardsId: this.idYards,
                stages: this.idStages,
            });
            this.getStagesAverages(this.page, this.currentElements, startHours, endHours, {
                yardsId: this.idYards,
                stages: this.idStages,
            });
        }
        if (event.value === null) {
            this.blockUI.start('Loading...');
            this.getReports(this.page, this.currentElements, this.startDate, this.endDate, {
                yardsId: this.idYards,
                stages: this.idStages,
            });
            this.getCountVehicles(this.page, this.currentElements, this.startDate, this.endDate, {
                yardsId: this.idYards,
                stages: this.idStages,
            });
            this.getStagesAverages(this.page, this.currentElements, this.startDate, this.endDate, {
                yardsId: this.idYards,
                stages: this.idStages,
            });
        }

        this.clearArrayID();
    }

    public goToPage(page: number) {
        this.blockUI.start('Loading...');
        this.page = page;
    }

    private getCountVehicles(
        page: number,
        currentElements: number,
        start: string,
        end: string,
        body: ReportYardControl,
    ) {
        this.yardService
            .getCountVehicles(page, currentElements, start, end, { yardsId: body.yardsId, stages: body.stages })
            .subscribe((res) => {
                this.vehicleEntering = res.data.vehiEntering;
                this.vehicleLeaving = res.data.vehiLeaving;
                this.blockUI.stop();
            });
    }

    private getReports(page: number, currentElements: number, start: string, end: string, body: ReportYardControl) {
        const INITAL_COLUMNS = {
            PLANT: 'Planta',
            PLATE: 'Placa',
            DRIVER: 'Conductor',
        };
        const cols: string[] = [...Object.values(INITAL_COLUMNS)];

        this.yardService
            .getReports(page, currentElements, start, end, {
                yardsId: body.yardsId,
                stages: body.stages,
                searchParam: body.searchParam,
            })
            .subscribe((res) => {
                res.data.records.forEach((r) =>
                    r.history
                        .sort((first, second) => {
                            if (first.order < second.order) return -1;
                            else if (first.order > second.order) return 1;
                            else return 0;
                        })
                        .forEach((h) => cols.push(h.stage)),
                );
                const uniqueColumns = new Set(cols);

                const tableData = res.data.records.map((r) => {
                    let row = {};
                    for (const uniqueCol of uniqueColumns) {
                        row[uniqueCol] = '---';
                    }

                    row[INITAL_COLUMNS.PLANT] = r.yard.name;
                    row[INITAL_COLUMNS.PLATE] = r.vehicle.plate;
                    row[INITAL_COLUMNS.DRIVER] = r.driver.name;

                    r.history.forEach((h) => {
                        row[h.stage] = this.convertTimeElapsed(h.timeElapsed);
                    });

                    return row;
                });

                this.columns = uniqueColumns;
                this.reports = res.data.elementsPerPage === 0 ? [] : tableData;
                this.colspan = this.columns?.size + 1;
                this.elementPages = res.data.records.length;
                this.totalPages = res.data.totalPages;
                this.blockUI.stop();
            });
    }

    private getYards() {
        this.yardService.getAll().subscribe((res) => {
            this.yards = [...res.data];
            this.blockUI.stop();
        });
    }

    private getStages(yardsId: any) {
        this.yardService.getYardsIdStages({ yardsId: yardsId }).subscribe((res) => {
            this.stages = [...res.data];

            this.columns = this.stages;
            this.blockUI.stop();
        });
    }

    private getStagesAverages(
        page: number,
        currentElements: number,
        start: string,
        end: string,
        body: ReportYardControl,
    ) {
        this.yardService
            .getYardStagesAverages(page, currentElements, start, end, { yardsId: body.yardsId, stages: body.stages })
            .subscribe((res) => {
                this.averageStages = res.data.promTotal;
            });
    }

    private removeFirst<T>(array: T[], toRemove: T): void {
        const index = array.indexOf(toRemove);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }
}
