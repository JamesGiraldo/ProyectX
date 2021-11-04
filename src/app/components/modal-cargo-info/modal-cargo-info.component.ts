import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

import { CompanyType, Acceptance, Country, PublicationStatus } from '@apptypes/enums';
import { ModalReasonsComponent } from '../modal-reasons/modal-reasons.component';
import { Publication, Company, User } from '@entities/index';
import { PublicationService, GlobalService, HandleErrorService } from '@services/index';
import { Router } from '@angular/router';

interface Props {
    publicationId: number;
    //isFromHistory: boolean;
    btnShow: boolean;
}

@Component({
    selector: 'app-modal-cargo-info',
    templateUrl: './modal-cargo-info.component.html',
    styleUrls: ['./modal-cargo-info.component.scss'],
})
export class ModalCargoInfoComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    isGenerator: boolean = false;
    public publicationStatus = PublicationStatus;
    publication: Publication;
    pending: Company[];
    rejected: Company[];
    btnShow: boolean;
    public country = Country;
    public user;

    constructor(
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: Props,
        public dialogRef: MatDialogRef<ModalCargoInfoComponent>,
        private readonly publicationService: PublicationService,
        private readonly globalService: GlobalService,
        public dialog: MatDialog,
        private handleErrorService: HandleErrorService,
    ) {}

    ngOnInit(): void {
        this.blockUI.start('Loading...');
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
        this.getPublication(this.data.publicationId);
        this.user = this.globalService.getDecodedToken().company.country?.id;
        this.btnShow = this.data.btnShow;
    }

    get publisher() {
        return this.publication.generatorUser.firstName1 + ' ' + this.publication.generatorUser.lastName1;
    }

    generateClipboardContent() {
        let clipboardContent = { ...this.publication };

        delete clipboardContent.id;
        delete clipboardContent.generatorUser;
        delete clipboardContent.requests;
        delete clipboardContent.createdAt;
        delete clipboardContent.updatedAt;
        delete clipboardContent.load.createdAt;
        delete clipboardContent.load.updatedAt;
        delete clipboardContent.load.id;
        delete clipboardContent.reasonCancellation;
        delete clipboardContent.reasonCancellationCode;
        delete clipboardContent.reasonFinish;
        delete clipboardContent.reasonFinishCode;
        delete clipboardContent.isVisible;
        delete clipboardContent.date;

        for (let currentCF = 0; currentCF < clipboardContent.customFields.length; currentCF++) {
            delete clipboardContent.customFields[currentCF].createdAt;
            delete clipboardContent.customFields[currentCF].updatedAt;
            delete clipboardContent.customFields[currentCF].module;
            delete clipboardContent.customFields[currentCF].id;
            delete clipboardContent.customFields[currentCF].module;
            delete clipboardContent.customFields[currentCF].companyId;
            delete clipboardContent.customFields[currentCF].datatype;
            delete clipboardContent.customFields[currentCF].publicationId;
            delete clipboardContent.customFields[currentCF].customFieldId;
        }

        for (let currentDestiny = 0; currentDestiny < clipboardContent.destinies.length; currentDestiny++) {
            delete clipboardContent.destinies[currentDestiny].createdAt;
            delete clipboardContent.destinies[currentDestiny].updatedAt;
            delete clipboardContent.destinies[currentDestiny].downloadDate;
            // delete clipboardContent.destinies[currentDestiny].id;
            delete clipboardContent.destinies[currentDestiny].publicationId;
            delete clipboardContent.destinies[currentDestiny].downloadDate;
        }

        for (let currentOrigin = 0; currentOrigin < clipboardContent.origins.length; currentOrigin++) {
            delete clipboardContent.origins[currentOrigin].createdAt;
            delete clipboardContent.origins[currentOrigin].updatedAt;
            delete clipboardContent.origins[currentOrigin].loadDate;
            //delete clipboardContent.origins[currentOrigin].id;
            delete clipboardContent.origins[currentOrigin].publicationId;
            delete clipboardContent.origins[currentOrigin].loadDate;
        }

        for (let currentOffer = 0; currentOffer < clipboardContent.offers.length; currentOffer++) {
            delete clipboardContent.offers[currentOffer].createdAt;
            delete clipboardContent.offers[currentOffer].updatedAt;
            delete clipboardContent.offers[currentOffer].state;
            //delete clipboardContent.offers[currentOffer].id;
            delete clipboardContent.offers[currentOffer].publicationId;
        }

        return clipboardContent;
    }

    /**
     * EVENT HANLDERS
     */
    public onClose(viewOffers: boolean = false, autoClose: boolean = false): void {
        this.dialogRef.close({ viewOffers: viewOffers, autoClose: autoClose });
    }

    public onContentCopy(): void {
        const clipboardContent = this.generateClipboardContent();
        this.globalService.setClipboard(JSON.stringify(clipboardContent));
        this.router.navigateByUrl('companies');
        this.dialogRef.close();

        Swal.fire({
            icon: 'success',
            title: 'Operación exitosa!',
            text:
                'La publicación se guardó exitosamente, a continuación eliga a quien irá dirigida o eliga publicar a todos',
            timer: 3500,
        });
    }

    public loadSharingDriver() {
        let data = {
            carga: '',
            publicacion: this.publication,
        };

        this.dialogRef.close();
        this.router.navigateByUrl('home');

        Swal.fire({
            icon: 'success',
            title: 'Operación exitosa!',
            text:
                'La publicación se guardó exitosamente, a continuación eliga a quien irá dirigida o eliga publicar a todos',
            timer: 3500,
        });
    }

    public onRejectClicked(): void {
        this.dialog
            .open(ModalReasonsComponent, {
                width: '650px',
                height: '600px',
                disableClose: true,
                data: { type: 'reject' },
            })
            .afterClosed()
            .subscribe((result) => {});
        // this.dialogRef.close({ lastAction: action });
    }

    /**
     * API CALLS
     */
    getPublication(publicationId: number) {
        this.publicationService.getById(publicationId).subscribe(
            (res) => {
                this.publication = res.data;
                this.pending = this.publication.requests
                    ?.map((r) => {
                        if (r.state == Acceptance.UNSELECTED) return r.transporter;
                    })
                    .filter((r) => r != undefined);
                this.rejected = this.publication.requests
                    ?.map((r) => {
                        if (r.state == Acceptance.REJECTED) return r.transporter;
                    })
                    .filter((r) => r != undefined);

                this.blockUI.stop();
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }
}
