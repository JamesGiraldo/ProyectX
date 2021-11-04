import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TripService {
    constructor(private globalService: GlobalService) {}

    public getAll(pageNumber: number, pageElements: number, start: string, end: string): Observable<any> {
        return this.globalService.get(Api.Endpoints.TRIP.TRIP_COLUMNS(pageNumber, pageElements, start, end)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllDestiny(id: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.TRIP.ALL_DESTINY(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllOrigin(id: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.TRIP.ALL_ORIGIN(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getById(trip: any) {
        return this.globalService.get(Api.Endpoints.TRIP.BASE + '/' + trip.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public addLocation(trip: any) {
        return this.globalService.post(Api.Endpoints.TRIP.TRAZABILITY(trip.id), trip).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getTrazabilityById(id: any) {
        return this.globalService.get(Api.Endpoints.TRIP.TRAZABILITY(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public addStatus(id: number, status: FormData) {
        const headers = new HttpHeaders({});
        return this.globalService.post(Api.Endpoints.TRIP.REPORT(id), status, { headers }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public search(filter: any, pageNumber: number, pageElements: number, start?: string, end?: string) {
        return this.globalService.post(Api.Endpoints.TRIP.SEARCH(pageNumber, pageElements, start, end), filter).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public searchCompliment(filter: any, pageNumber: number, pageElements: number, start?: string, end?: string) {
        return this.globalService
            .post(Api.Endpoints.TRIP.SEARCH_COMPLIMENT(pageNumber, pageElements, start, end), filter)
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public getColumns(id: number) {
        const type = 'GENERAL_WORD.TRIPS';
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

    public completed(pageNumber: number, pageElements: number, start?: string, end?: string, completed?: any) {
        return this.globalService
            .post(Api.Endpoints.TRIP.COMPLETED(pageNumber, pageElements, start, end), completed)
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public vehicleInfo(plate: string, pageNumber: number, pageElements: number) {
        return this.globalService.get(Api.Endpoints.TRIP.VEHICLE_FILES(plate, pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public driverInfo(id_card: string, pageNumber: number, pageElements: number) {
        return this.globalService.get(Api.Endpoints.TRIP.DRIVER_FILES(id_card, pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getReportsStatus(id: number) {
        return this.globalService.get(Api.Endpoints.TRIP.REPORT(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getDownload(pageNumber: number, pageElements: number, start: string, end: string): Observable<any> {
        return this.globalService.get(Api.Endpoints.TRIP.DOWNLOAD(pageNumber, pageElements, start, end)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public deleteReportStatus(id: number) {
        return this.globalService.delete(Api.Endpoints.TRIP.REPORT(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public verifyFiles(id, data) {
        return this.globalService.put(Api.Endpoints.TRIP.VERIFY_FILE(id), data).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
