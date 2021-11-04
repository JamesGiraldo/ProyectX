import { Component, OnInit, Input } from '@angular/core';

import { FareService } from '@services/index';

@Component({
    selector: 'app-fare-subscription-detail',
    templateUrl: './fare-subscription-detail.component.html',
    styleUrls: ['./fare-subscription-detail.component.scss'],
})
export class FareSubscriptionDetailComponent implements OnInit {
    displayedColumns: string[] = ['vehicleType', 'tripPrice', 'roundTripPrice', 'tonnagePrice'];

    constructor(private fareService: FareService) {}

    ngOnInit(): void {}
}
