import Swal from 'sweetalert2';
import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ModalReasonsComponent } from 'src/app/components/modal-reasons/modal-reasons.component';

import { ModalNewPublicationComponent } from '../../../companies/components/modal-newpublication/modal-newpublication.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PublicationService } from '@services/publication.service';
import { HandleErrorService } from '@services/handle-error.service';
import { ReportService } from '@services/report.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-modal-options',
    templateUrl: './modal-options.component.html',
    styleUrls: ['./modal-options.component.scss'],
})
export class ModalOptionsComponent implements OnInit {
    public disabled: boolean = false;
    public submit: boolean = false;
    public refresh: boolean = false;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        @Inject(MAT_DIALOG_DATA) public requestData: any,
        private handleErrorService: HandleErrorService,
        private readonly publicationService: PublicationService,
        private reportService: ReportService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ModalOptionsComponent>,
    ) {}

    ngOnInit(): void {}

    public onClose() {
        this.dialogRef.close({ data: { refresh: this.refresh } });
    }

    public openDialog() {
        this.disabled = true;
        this.dialog
            .open(ModalNewPublicationComponent, {
                width: '1000px',
                height: '600px',
                disableClose: true,
                data: { editPublication: this.requestData, refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                result.close ? (this.disabled = false) : (this.disabled = true);
                if (result.data.refresh) this.refresh = true;
            });
    }

    public openDialogCancel() {
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
                    this.cancelPublication(result.data);
                    this.refresh = true;
                    this.onClose();
                }
            });
    }

    public openDialogFinish() {
        Swal.fire({
            title: '¿Finalizar carga?',
            text:
                'Tenga en cuenta que al finalizar la carga va a rechazar los reportes que se encuentran sin seleccionar',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.dialog
                    .open(ModalReasonsComponent, {
                        width: '650px',
                        height: '600px',
                        disableClose: true,
                        data: { type: 'finish' },
                    })
                    .afterClosed()
                    .subscribe((result) => {
                        if (result.data !== undefined) {
                            this.finishPublication(result.data);
                            this.refresh = true;
                            this.onClose();
                        }
                    });
            }
        });
    }

    private cancelPublication(reason: string) {
        this.publicationService.cancelLoad(this.requestData.option.id, { reason: reason }).subscribe(
            (res) => {
                if (res.code >= 1000) {
                    this.refresh = true;
                    this.onClose();
                    this.handleErrorService.onSuccess(res);
                } else {
                    this.handleErrorService.onFailure(res);
                }
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }

    private finishPublication(reason: string) {
        this.publicationService.finishedLoad(this.requestData.option.id, { reason: reason }).subscribe(
            (res) => {
                if (res.code >= 1000) {
                    this.refresh = true;
                    this.onClose();
                    this.handleErrorService.onSuccess(res);
                } else {
                    this.handleErrorService.onFailure(res);
                }
            },
            (err) => {
                this.handleErrorService.onFailure(err);
                this.blockUI.stop();
            },
        );
    }
}
