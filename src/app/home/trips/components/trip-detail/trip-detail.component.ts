import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService } from '@services/index';
import { ModalCargoInfoComponent } from '../../../../components/modal-cargo-info/modal-cargo-info.component';
import { ModalOrderComponent } from '../modal-order/modal-order.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalNotesComponent } from '../modal-notes/modal-notes.component';
import { ModalQrComponent } from '../modal-qr/modal-qr.component';
import {
    TripType,
    CompanyType,
    PublicationType,
    TripModality,
    BodyworkType,
    VehicleType,
    TripReport,
} from '@apptypes/enums';
import { ModalDetailsFilesComponent } from '../../../../components/modal-details-files/modal-details-files.component';
import { ClipboardService } from 'ngx-clipboard';
import { ModalRescheduleComponent } from '../../../../components/modal-reschedule/modal-reschedule.component';

@Component({
    selector: '[trip-detail]',
    templateUrl: './trip-detail.component.html',
    styleUrls: ['./trip-detail.component.scss'],
})
export class TripDetailComponent implements OnInit {
    @Input('trip') trip: any;
    @Input('state') state: any;
    @Input('columns') columns: any[];
    @Input('totalColumns') totalColumns: number;
    @Output('updated') updated: EventEmitter<boolean> = new EventEmitter<boolean>();
    isGenerator: boolean = null;
    tripType = TripType;
    publicationTypes = PublicationType;
    tripmodality = TripModality;
    bodyworkType = BodyworkType;
    vehicleType = VehicleType;
    tripReport = TripReport;
    public stateValidity: string;

    constructor(
        public dialog: MatDialog,
        private readonly globalService: GlobalService,
        private _snackBar: MatSnackBar,
        private _clipboardService: ClipboardService,
    ) {}

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;

        this._clipboardService.copyResponse$.subscribe((re) => {
            if (re.isSuccess) {
                this._snackBar.open('El link fue copiado en el portapapeles', 'Ok');
            }
        });
    }

    public openCopy() {
        let hostname = window.location.hostname;
        if (hostname === 'localhost') {
            this._clipboardService.copy(hostname + `:4200/company/${this.trip['companyGenerator']}/safety-course`);
        } else {
            this._clipboardService.copy(hostname + `/company/${this.trip['companyGenerator']}/safety-course`);
        }
    }

    public openOrder() {
        this.dialog
            .open(ModalOrderComponent, {
                width: '650px',
                height: '550px',
                disableClose: false,
                data: { data: this.trip, cancel: false },
            })
            .afterClosed()
            .subscribe((data) => {
                if (data) this.updated.emit(true);
            });
    }

    public openRejectCompliment() {
        this.dialog
            .open(ModalOrderComponent, {
                width: '650px',
                height: '350px',
                disableClose: false,
                data: { data: this.trip, cancel: true },
            })
            .afterClosed()
            .subscribe((data) => {
                if (data) this.updated.emit(true);
            });
    }

    public openNotesDialog() {
        this.dialog
            .open(ModalNotesComponent, {
                width: '1000px',
                height: '550px',
                disableClose: false,
                data: this.trip,
            })
            .afterClosed()
            .subscribe((data) => {});
    }

    onDescriptionClick() {
        this.dialog
            .open(ModalCargoInfoComponent, {
                width: '850px',
                height: '750px',
                disableClose: false,
                data: { publicationId: this.trip.publication_id, btnShow: false },
            })
            .afterClosed()
            .subscribe(() => {});
    }

    public onDocumentsPlate(type: string) {
        this.dialog
            .open(ModalDetailsFilesComponent, {
                width: '750px',
                height: '450px',
                disableClose: true,
                data: { data: { type: type, data: this.trip['Placa'], trip: this.trip.id } },
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    public onDocumentsId(type: string) {
        this.dialog
            .open(ModalDetailsFilesComponent, {
                width: '750px',
                height: '450px',
                disableClose: true,
                data: { data: { type: type, data: this.trip['Cédula del conductor'], trip: this.trip.id } },
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    public openDialogReschedule() {
        this.dialog
            .open(ModalRescheduleComponent, {
                width: '400px',
                height: '350px',
                disableClose: true,
                data: {
                    id: this.trip?.shift ? this.trip?.shift.id : null,
                    yard: this.trip?.shift ? this.trip?.shift.tripId : null,
                    name: this.trip?.yardName,
                },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) this.updated.emit(true);
            });
    }

    public modalQR() {
        this.dialog
            .open(ModalQrComponent, {
                width: '500px',
                height: '470px',
                disableClose: false,
                data: this.trip,
            })
            .afterClosed()
            .subscribe(() => {});
    }
}
