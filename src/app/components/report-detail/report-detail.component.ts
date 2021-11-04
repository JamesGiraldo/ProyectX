import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { Acceptance, CompanyType, Country } from '@apptypes/enums';
import { GlobalService, HandleErrorService, ReportService } from '@services/index';
import { Report } from '@entities/report';
import { ModalReasonsComponent } from '../modal-reasons/modal-reasons.component';
import { ModalObservationsComponent } from '../modal-observations/modal-observations.component';

@Component({
    selector: '[report-detail]',
    templateUrl: './report-detail.component.html',
    styleUrls: ['./report-detail.component.scss'],
})
export class ReportDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('report') report: Report;
    @Input('columns') columns: any[];
    @Input() historyBtn: boolean;
    @Input() isManual: string;
    @Input('imLast') imLast: boolean;
    @Output('updated') updated: EventEmitter<number> = new EventEmitter<number>();
    isGenerator: boolean = null;
    public country = Country;
    public user;

    /* btns */
    public accept: boolean;
    public reject: boolean = true;

    constructor(
        private readonly globalService: GlobalService,
        private readonly reportService: ReportService,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private handleErrorService: HandleErrorService,
    ) {}

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
        this.user = this.globalService.getDecodedToken().company.country?.id;

        if (this.report.state === Acceptance.UNSELECTED) this.accept = true;
        else this.accept = false;

        if (this.report.state === Acceptance.REJECTED || this.report.state === Acceptance.CANCELLED)
            this.reject = false;
        else this.reject = true;
    }

    /**
     * EVENT HANDLERS
     */
    public onAcceptClick() {
        if (this.isManual) {
            this.dialog
                .open(ModalReasonsComponent, {
                    width: '650px',
                    height: '600px',
                    disableClose: true,
                    data: { type: 'accept' },
                })
                .afterClosed()
                .subscribe((result) => {
                    if (result.data !== undefined) {
                        this.toggleReportAcceptace(true, result.data);
                    } else {
                        this.toastr.warning(
                            'Para aceptar debe agregar un motivo de aceptación',
                            'No se aceptó el reporte!',
                            { timeOut: 2500 },
                        );
                    }
                });
        } else {
            Swal.fire('Operación exitosa!', 'La publicación fue aceptada exitosamente.', 'success');
        }
    }
    public onRejectClick() {
        if (this.isManual) {
            this.dialog
                .open(ModalReasonsComponent, {
                    width: '650px',
                    height: '600px',
                    disableClose: true,
                    data: { type: 'reject' },
                })
                .afterClosed()
                .subscribe((result) => {
                    if (result.data !== undefined) {
                        this.toggleReportAcceptace(false, result.data);
                    } else {
                        this.toastr.warning(
                            'Para rechazar debe agregar un motivo de rechazo',
                            'No se rechazó el reporte!',
                            { timeOut: 2500 },
                        );
                    }

                    /*  this.updated.emit(this.report.id); */
                });
        } else {
            Swal.fire('Operación exitosa!', 'La publicación fue rechazada exitosamente.', 'success');
        }
    }
    public onCancelClick() {
        if (this.isManual) {
            this.dialog
                .open(ModalReasonsComponent, {
                    width: '650px',
                    height: '600px',
                    disableClose: true,
                    data: { type: 'cancel' },
                })
                .afterClosed()
                .subscribe((result) => {
                    if (result.data !== undefined) {
                        this.cancelReport(result.data);
                    } else {
                        this.toastr.warning(
                            'Para cancelar debe agregar un motivo de cancelación',
                            'No se canceló el reporte!',
                            { timeOut: 2500 },
                        );
                    }
                });
        } else {
            Swal.fire('Operación exitosa!', 'La publicación fue cancelada exitosamente.', 'success');
        }
    }

    /**
     * API CALLS
     */
    toggleReportAcceptace(acceptance: boolean, reason?: string) {
        this.reportService
            .toggleReportAcceptance(this.report.id, { acceptance: acceptance, reason: reason })
            .subscribe((res) => {
                if (res.code === 30) {
                    Swal.fire('Error de operación!', res.error, 'error');
                } else {
                    if (res.code >= 1000) {
                        this.updated.emit(res.data.publicationId);
                        Swal.fire('Operación exitosa!', 'La publicación fue ejecutada exitosamente.', 'success');
                    } else {
                        this.handleErrorService.onFailure(res);
                    }
                }

                this.updated.emit(this.report.offerId);

                if (res.code === 60) {
                    Swal.fire({
                        title: res.error,
                        html: `El vehículo se encuentra asociado al viaje <b>${
                            res.data.requestId
                        }</b> con fecha <b>${this.getFormattedDate(
                            res.data.date,
                        )}</b> <br /><br />¿Desea llevar a cabo la operación de igual forma?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.blockUI.start('Loading...');

                            /* Algo pasa aquí */
                            this.reportService
                                .confirmReport(this.report.id, { acceptance: acceptance, reason: reason })
                                .subscribe(
                                    (res) => {
                                        if (res.code >= 1000) {
                                            Swal.fire(
                                                'Operación exitosa!',
                                                'La publicación fue ejecutada exitosamente.',
                                                'success',
                                            );
                                        } else {
                                            this.handleErrorService.onFailure(res);
                                        }
                                    },
                                    (err) => {
                                        this.onFailure(err);
                                    },
                                );
                        }
                        this.blockUI.stop();
                    });
                }
            });
    }

    cancelReport(reason: string) {
        this.reportService.cancelReport(this.report.id, { reason: reason }).subscribe(
            (res) => {
                if (res.code >= 1000 && res.code !== 23) {
                    this.updated.emit(this.report.offerId);

                    this.toastr.success('La publicación fue cancelada exitosamente', 'Operación exitosa!', {
                        timeOut: 2500,
                    });
                } else {
                    this.handleErrorService.onFailure(res);
                }
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }

    seeObservations() {
        this.dialog
            .open(ModalObservationsComponent, {
                width: '350px',
                height: '300px',
                disableClose: false,
                data: this.report.observation,
            })
            .afterClosed()
            .subscribe(() => {});
    }

    private getFormattedDate(dateCreated) {
        return moment(dateCreated).format('LLL');
    }

    private onFailure(err) {
        Swal.fire({
            icon: 'error',
            title: 'Error de operación',
            html: err.error,
        });
    }
}
