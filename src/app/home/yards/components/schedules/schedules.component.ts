import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { YardService } from '@services/yard.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-schedules',
    templateUrl: './schedules.component.html',
    styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public minDate;
    public range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    public page: number = 1;
    public currentElements: number = 12;
    public shifts: any[] = [];
    public startHoursFormatted;
    public endHoursFormatted;
    public totalPages: number = 0;
    public elementPages: number;
    public yards: string[] = [];
    public yardSelected: string = null;
    public isVisible: boolean = false;

    constructor(private readonly yardService: YardService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.getYards();
        this.getRangeToday(this.page, this.currentElements);
    }

    public changeYard($event) {
        this.blockUI.start('Loading...');
        if ($event.value) this.isVisible = true;

        this.yardSelected = $event.value;

        this.blockUI.stop();
    }

    public getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;
        this.blockUI.start('Loading...');

        this.getShifts(this.page, this.currentElements, this.startHoursFormatted, this.endHoursFormatted);
    }

    public getRange(event: MatDatepickerInputEvent<Date>) {
        let dateNow = moment(this.range.get('start').value).toISOString();
        let dateNowDayNext = moment(this.range.get('end').value).add(1, 'days').toISOString();

        /* Formatted Start Hours */
        let startHoursSplit = dateNow.split('T');
        let startHoursFormatted = startHoursSplit[0] + 'T' + '05:00:01.334Z';
        /* Formatted End Hours */
        let endHoursFormatted;
        if (dateNowDayNext !== null) {
            let endHoursSplit = dateNowDayNext.split('T');
            endHoursFormatted = endHoursSplit[0] + 'T' + '04:59:59.178Z';
        }

        if (this.range.get('start').value !== null && this.range.get('end').value !== null) {
            this.blockUI.start('Loading...');
            this.getShifts(this.page, this.currentElements, startHoursFormatted, endHoursFormatted);
        }

        if (event.value === null) {
            this.blockUI.start('Loading...');
            this.getShifts(this.page, this.currentElements, this.startHoursFormatted, this.endHoursFormatted);
        }
    }

    public getRangeToday(page, currentElements) {
        let dateNow = moment(new Date()).toISOString();
        let dateNowDayNext = moment(new Date()).add(1, 'days').toISOString();
        /* Formatted Start Hours */
        let startHoursSplit = dateNow.split('T');
        this.startHoursFormatted = startHoursSplit[0] + 'T' + '05:00:01.334Z';
        /* Formatted End Hours */
        let endHoursSplit = dateNowDayNext.split('T');
        this.endHoursFormatted = endHoursSplit[0] + 'T' + '04:59:59.178Z';

        this.getShifts(page, currentElements, this.startHoursFormatted, this.endHoursFormatted);
    }

    public goToPage(page: number) {
        this.blockUI.start('Loading...');
        this.page = page;

        this.getShifts(this.page, this.currentElements, this.startHoursFormatted, this.endHoursFormatted);
    }

    private getShifts(page, currentElements, startHoursFormatted, endHoursFormatted) {
        this.yardService
            .getAllShifts(page, currentElements, startHoursFormatted, endHoursFormatted, this.yardSelected)
            .subscribe((res) => {
                this.shifts = [...res.data];
                this.totalPages = res.data.totalPages;
                this.elementPages = this.shifts.length;

                this.blockUI.stop();
            });
    }

    private getYards() {
        this.yardService.getAll().subscribe((res) => {
            this.yards = [...res.data];
        });
        this.blockUI.stop();
    }
}
