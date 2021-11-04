import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';

@Injectable({
    providedIn: 'root',
})
export class ReportService {
    constructor(private globalService: GlobalService) {}

    public toggleReportAcceptance(reportId: number, acceptance: { acceptance: boolean; reason: string }) {
        return this.globalService.put(`${Api.Endpoints.REPORT.BASE}/${reportId}/status`, acceptance).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public cancelReport(reportId: number, reason: { reason: string }) {
        return this.globalService.put(`${Api.Endpoints.REPORT.BASE}/${reportId}/cancel`, reason).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public confirmReport(reportId: number, data: any) {
        return this.globalService.put(Api.Endpoints.REPORT.BLOCKAGE(reportId), data).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
