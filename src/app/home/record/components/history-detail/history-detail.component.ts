import { Component, OnInit, Input } from '@angular/core';
import { Publication } from '../../../../types/entities';
import { TripType, PublicationType, PublicationStatus } from '../../../../types/enums';
import { MatDialog } from '@angular/material/dialog';
import { ModalCargoInfoComponent } from '../../../../components/modal-cargo-info/modal-cargo-info.component';
import { ModalOffersComponent } from '../../../../components/modal-offers/modal-offers.component';

@Component({
    selector: '[history-detail]',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.scss'],
})
export class HistoryDetailComponent implements OnInit {
    @Input() record: Publication;
    @Input('columns') columns: any[];
    tripType = TripType;
    publicationType = PublicationType;
    publicationState = PublicationStatus;
    currdate: Date = new Date();

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {}

    get publisher() {
        return this.record.generatorUser.firstName1 + ' ' + this.record.generatorUser.lastName1;
    }

    openCargoDialog() {
        this.dialog.open(ModalCargoInfoComponent, {
            width: '850px',
            height: '650px',
            disableClose: false,
            data: { publicationId: this.record.id, btnShow: false },
        });
    }

    openOffersDialog() {
        this.dialog.open(ModalOffersComponent, {
            width: '1000px',
            height: '650px',
            disableClose: false,
            data: { publicationId: this.record.id, visibleBtn: false },
        });
    }

    /**
     * EVENT HANDLERS
     */
    public onDescriptionClick() {
        this.openCargoDialog();
    }

    public onViewOffersClick() {
        this.openOffersDialog();
    }
}
