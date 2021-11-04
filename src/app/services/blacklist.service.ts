import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';

@Injectable({
    providedIn: 'root',
})
export class BlacklistService {
    constructor(private globalService: GlobalService) {}

    public getAll(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.BLACKLIST.PAGINATION(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createBlackListRecord(data: any): Observable<any> {
        return this.globalService.post(Api.Endpoints.BLACKLIST.BASE, data).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public removeBlackListRecord(blacklistId: number): Observable<any> {
        return this.globalService.delete(`${Api.Endpoints.BLACKLIST.BASE}/${blacklistId}`).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public search(filter: any, pageNumber: number, pageElements: number) {
        return this.globalService.get(Api.Endpoints.BLACKLIST.SEARCH(pageNumber, pageElements, filter)).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
