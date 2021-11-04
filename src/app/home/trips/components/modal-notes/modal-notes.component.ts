import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TripReport } from '@apptypes/enums';
import { HandleErrorService } from '@services/handle-error.service';
import { TripService } from '@services/trip.service';
import { ModalFilesComponent } from '../modal-files/modal-files.component';

@Component({
    selector: 'app-modal-notes',
    templateUrl: './modal-notes.component.html',
    styleUrls: ['./modal-notes.component.scss'],
})
export class ModalNotesComponent implements OnInit {
    public reportStatus: string[] = [];
    public status = TripReport;
    public state: string;
    public columns: string[] = [
        'Fecha de creación',
        'Estado',
        'Observaciones',
        'Tiempo estimado',
        'Archivos',
        'Tonelaje cargado',
        'Acción',
    ];

    constructor(
        public dialogRef: MatDialogRef<ModalNotesComponent>,
        @Inject(MAT_DIALOG_DATA) public reportStateData: any,
        private readonly tripService: TripService,
        public dialog: MatDialog,
        private handleErrorService: HandleErrorService,
    ) {}

    ngOnInit(): void {
        this.getAllReports(this.reportStateData.id);
    }

    public deleteReport(statusReport) {
        this.tripService.deleteReportStatus(statusReport.id).subscribe(
            (res) => {
                this.handleErrorService.controlError(res);
                if (res.code >= 1000) {
                    this.getAllReports(this.reportStateData.id);
                }
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }

    public getStates(state: string) {
        switch (state) {
            case this.status.AT_DESTINY:
                this.state = 'En Destino';
                break;
            case this.status.AT_ORIGIN:
                this.state = 'En Origen';
                break;
            case this.status.CANCELLED:
                this.state = 'Cancelado';
                break;
            case this.status.COMPLETED:
                this.state = 'Completado';
                break;
            case this.status.LOADED:
                this.state = 'Cargado';
                break;
            case this.status.NOT_STARTED:
                this.state = 'No Iniciado';
                break;
            case this.status.ON_ROUTE_TO_DESTINY:
                this.state = 'En Ruta a Destino';
                break;
            case this.status.ON_ROUTE_TO_ORIGIN:
                this.state = 'En Ruta a Origen';
                break;
            case this.status.UNLOADING:
                this.state = 'Descargando';
                break;
            default:
                this.state = 'Esperando carga';
        }
        return this.state;
    }

    public onClose() {
        this.dialogRef.close();
    }

    public showFiles(file) {
        this.dialog
            .open(ModalFilesComponent, {
                width: '750px',
                height: '450px',
                disableClose: true,
                data: file,
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    private getAllReports(id: number) {
        this.tripService.getReportsStatus(id).subscribe((res) => {
            this.reportStatus = res.data;
        });
    }
}
