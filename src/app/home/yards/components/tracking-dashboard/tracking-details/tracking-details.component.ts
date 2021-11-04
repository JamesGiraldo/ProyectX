import { Component, Input, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: '[tracking-details]',
    templateUrl: './tracking-details.component.html',
    styleUrls: ['./tracking-details.component.scss'],
})
export class TrackingDetailsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input() refresh: boolean;
    @Input('tracking') tracking: any;

    page = 1;
    elementPages = 12;
    totalPages = 0;
    trackings = [];

    constructor() {}

    ngOnInit(): void {
        this.blockUI.stop();
    }

    /**
     * Helpers
     */

    generateDates() {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 7);
        yesterday.setHours(23);
        yesterday.setMinutes(59);
        yesterday.setSeconds(59);
        yesterday.setMilliseconds(999);

        let today = new Date();
        yesterday.setHours(23);
        yesterday.setMinutes(59);
        yesterday.setSeconds(59);
        yesterday.setMilliseconds(999);

        return { start: yesterday.toISOString(), end: today.toISOString() };
    }

    /**
     * Accessors
     */

    public getStageColor(index) {
        return `#${index}`;
    }
}
