import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ExporterService } from '@services/exporter.service';
import { PublicationService } from '@services/publication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripService } from '@services/trip.service';

@Component({
    selector: 'app-modal-options-download',
    templateUrl: './modal-options-download.component.html',
    styleUrls: ['./modal-options-download.component.scss'],
})
export class ModalOptionsDownloadComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public optionDownload: string;
    public submit: boolean = false;
    public page: number = 1;
    public currentElements: number = 0;
    public range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    public requests: any[] = [];
    public trips: any[] = [];

    public loadedRequests = null;
    public loadedTrips = null;

    constructor(
        private _snackBar: MatSnackBar,
        private readonly exporterService: ExporterService,
        private readonly publicationService: PublicationService,
        private readonly tripService: TripService,
        public dialogRef: MatDialogRef<ModalOptionsDownloadComponent>,
    ) {}

    ngOnInit(): void {
        this.optionDownload = 'request';
    }

    public onClose(): void {
        this.dialogRef.close();
    }

    public handleChange(event) {
        this.optionDownload = event;
    }

    public getRange() {
        let start = moment(this.range.get('start').value).format('YYYY-MM-DD');
        let end = moment(this.range.get('end').value).format('YYYY-MM-DD');
        let startHours = moment(start).add(-4.9, 'hours').toISOString();
        let endHours = moment(end).add(18.99, 'hours').toISOString();

        if (this.range.get('start').value !== null && this.range.get('end').value !== null) {
            this.blockUI.start('Loading...');
            this.submit = true;

            this.getRequests(this.page, this.currentElements, startHours, endHours);
            this.getTrips(this.page, this.currentElements, startHours, endHours);
        } else {
            this.submit = false;
        }
    }

    public onDownload() {
        if (this.optionDownload && this.range.get('start').value !== null && this.range.get('end').value !== null) {
            this.blockUI.start('Descargando reporte...');

            if (this.optionDownload === 'request') {
                this.exporterService.exportToExcelRequest(this.requests, 'Reports_request');
            } else {
                this.exporterService.exportToExcelTrips(this.trips, 'Reports_trips');
            }

            setTimeout(() => {
                this.blockUI.stop();
                this.onClose();
            }, 1000);
        } else {
            this._snackBar.open('Seleccione un rango de fecha válido para generar el reporte.', '', {
                duration: 5000,
            });
        }
    }

    private getRequests(page: number, currentElements: number, startDate: string, endDate: string): void {
        this.publicationService.getDownload(page, currentElements, startDate, endDate).subscribe((res) => {
            this.requests = res.data;
            this.loadedRequests = res.code;
            this.blockUI.stop();
        });
    }

    private getTrips(page: number, currentElements: number, startDate: string, endDate: string) {
        this.tripService.getDownload(page, currentElements, startDate, endDate).subscribe((res) => {
            this.loadedTrips = res.code;
            this.trips = res.data;
            this.blockUI.stop();
        });
    }
}
