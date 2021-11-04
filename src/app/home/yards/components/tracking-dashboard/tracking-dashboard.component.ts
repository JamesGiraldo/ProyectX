import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { YardService } from '@services/yard.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tracking-dashboard',
    templateUrl: './tracking-dashboard.component.html',
    styleUrls: ['./tracking-dashboard.component.scss'],
})
export class TrackingDashboardComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;

    public refreshManual: Subject<void> = new Subject<void>();
    public map: boolean = false;
    public refresh: boolean = true;

    page = 1;
    elementPages = 12;
    totalPages = 0;
    trackings = [];

    constructor(private toastr: ToastrService, private readonly yardService: YardService, private router: Router) {}

    ngOnInit(): void {
        this.getTrackings(this.page);

        let interval;
        if (this.router.url === '/yards/tracking' && this.refresh) {
            interval = setInterval(() => {
                this.getTrackings();
            }, 60000);
        } else {
            clearInterval(interval);
        }
    }

    public viewMap() {
        this.map = true;
    }

    public viewTable() {
        this.map = false;
    }

    public goToPage(page: number) {
        this.blockUI.start('Loading...');
        this.page = page;

        this.getTrackings(this.page);
    }

    /**
     * Event Handlers
     */
    handleSearchChange(event) {
        this.blockUI.start('Loading...');
        if (event === undefined) this.blockUI.stop();

        let query = event?.length > 0 ? { value: event } : {};

        if (event?.length > 0) {
            this.yardService.searchTracking(query, 0, 0).subscribe((res) => {
                if (res.data?.records) {
                    this.trackings = res.data.records;
                }
                this.blockUI.stop();
            });
        } else {
            this.getTrackings(this.page);
        }
    }

    getTrackings(page = null) {
        if (!page) page = this.page;

        this.yardService.getAllTracking(page, this.elementPages).subscribe((res) => {
            if (res.data?.records) {
                this.trackings = res.data.records;
                this.page = res.data.page;
                this.elementPages = res.data.elementsPerPage;
                this.totalPages = res.data.totalPages;
            }
            this.blockUI.stop();
        });
    }

    public onRefresh() {
        this.refreshManual.next();
        this.toastr.info('Actualizando mapa...', '', { timeOut: 2500 });
    }
}
