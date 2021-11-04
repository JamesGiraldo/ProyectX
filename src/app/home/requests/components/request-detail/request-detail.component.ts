import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService } from '@services/global.service';
import { ModalCargoInfoComponent } from '../../../../components/modal-cargo-info/modal-cargo-info.component';
import { ModalNewReportComponent } from '../../../../components/modal-new-report/modal-new-report.component';
import { ModalOffersComponent } from '../../../../components/modal-offers/modal-offers.component';
import { ModalOptionsComponent } from '../modal-options/modal-options.component';
import { StatusList } from '@apptypes/entities';
import { PublicationType, TripType, TripModality, CompanyType, BodyworkType } from '@apptypes/enums';
import Swal from 'sweetalert2';
import { HandleErrorService, PublicationService } from '../../../../services';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: '[request-detail]',
    templateUrl: './request-detail.component.html',
    styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('request') request: any;
    @Input('state') state: any;
    @Input('columns') columns: any[];
    @Input('totalColumns') totalColumns: number;
    @Output('onUpdate') onUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output('onRemove') onRemove: EventEmitter<boolean> = new EventEmitter<boolean>();
    public publicationType: StatusList;
    publicationTypes = PublicationType;
    tripType = TripType;
    tripmodality = TripModality;
    bodyworkType = BodyworkType;
    isGenerator: boolean = null;

    constructor(
        public dialog: MatDialog,
        private readonly globalService: GlobalService,
        private readonly publicationService: PublicationService,
        private handleErrorService: HandleErrorService,
    ) {}

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
    }

    openCargoDialog() {
        this.dialog
            .open(ModalCargoInfoComponent, {
                width: '850px',
                height: '750px',
                disableClose: false,
                data: { publicationId: this.request.id, btnShow: true },
            })
            .afterClosed()
            .subscribe((data) => {
                if (data) if (data.viewOffers) this.openOffersDialog({ isProgrammatically: data.autoClose });
                this.onUpdate.emit(true);
            });
    }

    openEditDialog() {
        this.dialog
            .open(ModalOptionsComponent, {
                width: '650px',
                height: '600px',
                disableClose: true,
                data: { option: this.request, refresh: false, state: this.state },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.data.refresh) this.onUpdate.emit(true);
            });
    }

    openOffersDialog(opts: { isProgrammatically: boolean }) {
        this.blockUI.start('Loading...');
        this.dialog
            .open(ModalOffersComponent, {
                width: '1000px',
                height: '700px',
                disableClose: false,
                data: { publicationId: this.request.id, isProgrammatically: opts.isProgrammatically, visibleBtn: true },
            })
            .afterClosed()
            .subscribe((data) => {
                if (data) this.onUpdate.emit(true);

                if (data) if (data.offerId) this.openAddReportDialog(data.offerId, data.idPublication);
            });

        this.blockUI.stop();
    }

    openAddReportDialog(offerId: number, idPublication: number) {
        this.dialog
            .open(ModalNewReportComponent, {
                width: '1000px',
                height: '600px',
                disableClose: false,
                data: { offerId: offerId, idPublication: idPublication },
            })
            .afterClosed()
            .subscribe((data) => {});
    }

    /**
     * EVENT HANDLERS
     */
    public onDescriptionClick() {
        this.openCargoDialog();
    }

    public onEditClick() {
        this.openEditDialog();
    }

    public onViewOffersClick() {
        this.openOffersDialog({ isProgrammatically: false });
    }

    removeRequest() {
        Swal.fire({
            title: `¿Estas seguro que deseas remover la solicitud?`,
            text: 'En caso de querer añadir esta solicitud nuevamente se tendra que publicar nuevamente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remover',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.blockUI.start('Loading...');
                this.publicationService.remove(this.request.id).subscribe(
                    (res) => {
                        if (res.code >= 1000) {
                            Swal.fire(
                                'Solicitud Removida!',
                                'La solicitud ha sido removida satisfactoriamente.',
                                'success',
                            );
                            this.onRemove.emit(true);
                        }
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            }
            this.blockUI.stop();
        });
    }
}
