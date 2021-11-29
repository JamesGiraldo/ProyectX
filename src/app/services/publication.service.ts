import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';

@Injectable({
    providedIn: 'root',
})
export class PublicationService {
    constructor(private globalService: GlobalService) {}

    public convertToMilliseconds(hour: number, minutes: number) {
        let hourMilliseconds = Math.floor(hour * 3600000);
        let minuteMilliseconds = Math.floor((minutes * 3600000) / 60);
        let milliseconds = Math.floor(hourMilliseconds + minuteMilliseconds);

        return milliseconds;
    }

    public convertFromMilliseconds(ms: number) {
        let hours = Math.floor(ms / 3600000);
        let minutes = Math.floor((ms % 3600000) / 60000);

        return { hours: hours, minutes: minutes };
    }

    public createPublication(fare: any) {
        return this.globalService.post(Api.Endpoints.PUBLICATION.BASE, fare).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createPublicationAsTransporter(publication: any) {
        return this.globalService.post(Api.Endpoints.PUBLICATION.CREATE_AS_TRANSPORTER, publication).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public massive(file: any) {
        return this.globalService.post(Api.Endpoints.PUBLICATION.MASSIVE, file).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public uploadMassive(file: FormData) {
        const headers = new HttpHeaders({});
        return this.globalService.post(Api.Endpoints.PUBLICATION.MASSIVE_UPLOAD, file, { headers }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public saveMassiveRelations(mapper: any) {
        return this.globalService.post(Api.Endpoints.PUBLICATION.MASSIVE_RELATIONS, mapper).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updatePublication(id: any, publication: any) {
        return this.globalService.put(Api.Endpoints.PUBLICATION.BASE + '/' + id, publication).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getById(publication: number) {
        return this.globalService.get(Api.Endpoints.PUBLICATION.BASE + '/' + publication).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAll(pageNumber: number, pageElements: number, start: string, end: string, state): Observable<any> {
        return this.globalService
            .get(Api.Endpoints.PUBLICATION.PUBLICATION_COLUMNS(pageNumber, pageElements, start, end, state))
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public getHistory(pageNumber: number, pageElements: number, start: string, end: string): Observable<any> {
        return this.globalService.get(Api.Endpoints.PUBLICATION.HISTORY(pageNumber, pageElements, start, end)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getOffers(publicationId): Observable<any> {
        return this.globalService.get(`${Api.Endpoints.PUBLICATION.BASE}/${publicationId}/offer`).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public remove(id: number) {
        return this.globalService.delete(Api.Endpoints.PUBLICATION.BASE + '/' + id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public search(filter: any, pageNumber: number, pageElements: number, start?: string, end?: string, state?: any) {
        return this.globalService
            .post(Api.Endpoints.PUBLICATION.SEARCH_PUBLICATION(pageNumber, pageElements, start, end, state), filter)
            .pipe(
                map((res) => {
                    console.log( res )
                    return res;
                }),
            );
    }

    public searchHistory(filter: any, pageNumber: number, pageElements: number, start?: string, end?: string) {
        return this.globalService
            .post(Api.Endpoints.PUBLICATION.SEARCH_HISTORY(pageNumber, pageElements, start, end), filter)
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public getColumns(id: number) {
        const type = 'GENERAL_WORD.PUBLICATIONS';
        return this.globalService.get(Api.Endpoints.PUBLICATION.COLUMNS(id, type)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public setColumns(id, columns) {
        return this.globalService.put(Api.Endpoints.PUBLICATION.SET_COLUMNS(id), columns).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public finishedLoad(id: number, reason: any) {
        return this.globalService.post(Api.Endpoints.PUBLICATION.FINISHED_LOAD(id), reason).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public cancelLoad(id: number, reason: any) {
        return this.globalService.post(Api.Endpoints.PUBLICATION.CANCEL_LOAD(id), reason).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public removeOrigin(id: number) {
        return this.globalService.delete(Api.Endpoints.PUBLICATION.DELETE_ORIGIN(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public removeDestiny(id: number) {
        return this.globalService.delete(Api.Endpoints.PUBLICATION.DELETE_DESTINY(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getDownload(pageNumber: number, pageElements: number, start: string, end: string): Observable<any> {
        return this.globalService.get(Api.Endpoints.PUBLICATION.DOWNLOAD(pageNumber, pageElements, start, end)).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
