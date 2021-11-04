import Swal from 'sweetalert2';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { Fare, FareRecord } from '@apptypes/entities';
import { FareService, GlobalService, HandleErrorService } from '@services/index';
import { ModalNewfareComponent } from '../modal-newfare/modal-newfare.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Country } from '@apptypes/enums';
interface transporterFares extends Fare {
    transporterId: number;
    transporterName: string;
    count: number;
}
@Component({
    selector: 'app-fare-detail',
    templateUrl: './fare-detail.component.html',
    styleUrls: ['./fare-detail.component.scss'],
})
export class FareDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('fare') fare: transporterFares;
    @Output() remove: EventEmitter<number> = new EventEmitter<number>();
    public fares: Fare[] = [];
    public displayedColumns: string[] = ['vehicleType', 'tripPrice', 'roundTripPrice', 'tonnagePrice'];
    public country = Country;
    public user;

    constructor(
        public dialog: MatDialog,
        private fareService: FareService,
        private handleErrorService: HandleErrorService,
        private readonly globalService: GlobalService,
    ) {}

    ngOnInit(): void {
        this.user = this.globalService.getDecodedToken().company.country?.id;
    }

    public getFaresOfTransporter() {
        this.fareService.getByTransporter(this.fare.transporterId).subscribe((res) => {
            this.fares = res.data.records;
        });
    }

    public editFare(fare: Fare) {
        this.dialog
            .open(ModalNewfareComponent, {
                width: '850px',
                height: '600px',
                disableClose: true,
                data: { fare: fare, refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.refresh) this.getFaresOfTransporter();
            });
    }

    public removeFare(id: Fare) {
        Swal.fire({
            title: '¿Estás seguro que deseas remover esta tarifa?',
            text: 'La información perdida en caso de ser recuperada tendrá que volver a ser diligenciada...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remover',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.blockUI.start('Loading...');
                this.fareService.removeFare(id).subscribe((res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe(() => {});
                    if (res.code == 1035) {
                        this.getFaresOfTransporter();
                        this.remove.emit(1);
                    }
                });
                this.blockUI.stop();
            }
        });
    }

    public removeAllFare() {
        Swal.fire({
            title: '¿Estás seguro que deseas remover todas las tarifas del este(a) transportador(a)?',
            text: 'La información perdida en caso de ser recuperada tendrá que volver a ser diligenciada.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remover',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.blockUI.start('Loading...');
                this.fareService.removeFareByTransport(this.fare.transporterId).subscribe(
                    (res) => {
                        this.handleErrorService.controlError(res);
                        this.handleErrorService.closeEnd$.pipe(take(1)).subscribe(() => {});
                        if (res.code == 1035) {
                            this.getFaresOfTransporter();
                            this.remove.emit(1);
                        }
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
                this.blockUI.stop();
            }
        });
    }
}
