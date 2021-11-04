import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CompanyType } from '@apptypes/enums';
import { Offer } from '@entities/index';
import { PublicationService, GlobalService } from '@services/index';

interface Props {
    publicationId: number;
    isProgrammatically?: boolean;
    visibleBtn?: boolean;
}

@Component({
    selector: 'app-modal-offers',
    templateUrl: './modal-offers.component.html',
    styleUrls: ['./modal-offers.component.scss'],
})
export class ModalOffersComponent implements OnInit {
    isGenerator: boolean = null;
    public offers: Offer[] = [];
    public historyVisible: boolean;
    public isManual: string;
    public publicationStatus: string;
    public idPublication: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Props,
        public dialogRef: MatDialogRef<ModalOffersComponent>,
        private readonly publicationService: PublicationService,
        private readonly globalService: GlobalService,
    ) {}

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
        this.getPublicationById(this.data.publicationId);
        this.getOffers(this.data.publicationId);

        this.historyVisible = this.data.visibleBtn;
    }

    /**
     * EVENT HANLDERS
     */
    public onClose(): void {
        this.dialogRef.close();
    }

    onAddClicked($event: { offerId: number }) {
        this.dialogRef.close({ offerId: $event.offerId, idPublication: this.idPublication });
    }

    public onReportUpdated($event) {
        if ($event && $event !== undefined) this.getOffers($event);
    }

    /**
     * API CALLS
     */
    getOffers(publicationId: number) {
        this.publicationService.getOffers(publicationId).subscribe((res) => {
            if (res.data?.records.length == 1 && this.data.isProgrammatically) {
                this.dialogRef.close({ offerId: res.data.records[0].id, idPublication: this.idPublication });
                return;
            }

            try {
                this.offers = [...res.data?.records];
            } catch (error) {}
        });
    }

    getPublicationById(id: number) {
        this.publicationService.getById(id).subscribe((res) => {
            this.idPublication = res.data.id;
            this.isManual = res.data.type;
            this.publicationStatus = res.data.state;
        });
    }
}
