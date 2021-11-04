import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';
import { Report } from '@apptypes/entities';

@Injectable({
    providedIn: 'root',
})
export class OfferService {
    constructor(private globalService: GlobalService) {}

    public getMetadata(offerId: number) {
        return this.globalService.get(`${Api.Endpoints.OFFER.BASE}/${offerId}/meta`).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getReports(offerId: number) {
        return this.globalService.get(`${Api.Endpoints.OFFER.BASE}/${offerId}/report`).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getReportsByState(offerId: number, state: string) {
        return this.globalService.get(`${Api.Endpoints.OFFER.BASE}/${offerId}/report/${state}`).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public addReports(offerId: number, reports: Report[]) {
        return this.globalService.post(`${Api.Endpoints.OFFER.BASE}/${offerId}`, reports).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public removeOffer(id: number) {
        return this.globalService.delete(Api.Endpoints.OFFER.DELETE_OFFER(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
