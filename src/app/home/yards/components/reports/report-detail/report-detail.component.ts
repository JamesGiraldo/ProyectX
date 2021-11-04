import { Component, Input, OnInit } from '@angular/core';

import { YardService } from '@services/yard.service';

@Component({
    selector: '[report-detail]',
    templateUrl: './report-detail.component.html',
    styleUrls: ['./report-detail.component.scss'],
})
export class ReportDetailComponent implements OnInit {
    @Input('report') report: any;
    @Input('columns') columns: any;
    public columnsComp: any[] = [];

    constructor() {}

    ngOnInit(): void {}
}
