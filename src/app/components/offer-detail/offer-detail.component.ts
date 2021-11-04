import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Item, Offer, Report, StatusList } from '@entities/index';
import { OfferService, GlobalService } from '@services/index';
import { OfferStatus, CompanyType, Acceptance, Country, PublicationStatus } from '@apptypes/enums';

@Component({
    selector: 'app-offer-detail',
    templateUrl: './offer-detail.component.html',
    styleUrls: ['./offer-detail.component.scss'],
})
export class OfferDetailComponent implements OnInit {
    @Input() offer: Offer;
    @Input('isManual') isManual: string;
    @Input('publicationStatus') publicationStatus: string;
    @Input('idPublication') idPublication: number;
    @Input() shouldBeExpanded: boolean = false;
    @Input() historyVisible: boolean;
    @Output('addClicked') addClicked: EventEmitter<{ offerId: number; idPublication: number }> = new EventEmitter();
    @Output('updated') updated: EventEmitter<number> = new EventEmitter<number>();
    isOpen: boolean = true;
    offerState = OfferStatus;
    reports: Report[] = [];
    isGenerator: boolean;
    currentState: Acceptance = Acceptance.UNSELECTED;
    public historyBtn: boolean;
    public offerType: StatusList;
    public country = Country;
    public user;
    public columns = [
        { name: 'HISTORY.DATE_REPORT' },
        { name: 'HISTORY.DATE_LOAD' },
        { name: 'HISTORY.TRANSPORTER' },
        { name: 'HISTORY.DRIVER.TITLE' },
        { name: 'HISTORY.REPORT' },
        { name: 'GENERAL_WORD.OBSERVATION' },
        { name: 'HISTORY.FARE' },
    ];
    public colspan: number;
    public unselected: number = 0;
    public publicationStatusActive = PublicationStatus;

    /* btn */
    public reject: boolean;

    constructor(private readonly offerService: OfferService, private readonly globalService: GlobalService) {}

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
        this.user = this.globalService.getDecodedToken().company.country?.id;
        this.isOpen = this.shouldBeExpanded;
        this.offerType = new StatusList();
        this.offerType.add(new Item(0, 'Reporte realizado sin seleccionar', true));
        this.offerType.add(new Item(1, 'Aceptados'));
        this.offerType.add(new Item(2, 'Rechazados'));
        this.offerType.add(new Item(3, 'Cancelados'));
        this.historyBtn = this.historyVisible;
    }

    /**
     * EVENT EMITTERS
     */
    public emittAddClicked() {
        this.addClicked.emit({ offerId: this.offer.id, idPublication: this.idPublication });
    }

    /**
     * EVENT HANDLERS
     */
    public onAddClick() {
        this.emittAddClicked();
    }

    public onOpenedOffer() {
        this.getReports();
    }

    public onReportUpdated($event: number) {
        this.updated.emit($event);

        if ($event) this.getReports();

        const reportIndex = this.reports.findIndex((r) => r.id === $event);
        this.reports.splice(reportIndex, 1);
    }

    public toggleStatus(id: number) {
        let shouldSearch = true;
        this.reject = true;
        for (let type of this.offerType.items) {
            type.isActive = false;
            if (type.id == id) {
                if (type.isActive) shouldSearch = false;
                type.isActive = true;
                switch (type.id) {
                    case 0:
                        this.currentState = Acceptance.UNSELECTED;
                        break;
                    case 1:
                        this.currentState = Acceptance.ACCEPTED;
                        break;
                    case 2:
                        this.currentState = Acceptance.REJECTED;
                        this.reject = false;
                        break;
                    case 3:
                        this.currentState = Acceptance.CANCELLED;
                        this.reject = false;
                        break;
                }
            }
        }

        if (shouldSearch) this.getReports();
    }

    /**
     * API CALLS
     */
    getReports() {
        this.offerService.getReportsByState(this.offer.id, this.currentState).subscribe((res) => {
            this.reports = res.data.reports;
            this.colspan = this.columns.length + 1;
            this.unselected = res.data?.unselected;
        });
    }
}
