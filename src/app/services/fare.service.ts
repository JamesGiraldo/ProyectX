import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';
import { Fare } from '@apptypes/entities';

@Injectable({
    providedIn: 'root',
})
export class FareService {
    constructor(private globalService: GlobalService) {}

    public getAll(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.FARE.ALL(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getByTransporter(transporterId: number) {
        return this.globalService.get(Api.Endpoints.FARE.BY_TRANSPORTER(transporterId)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getById(fare: Fare) {
        return this.globalService.get(Api.Endpoints.FARE.BASE + '/' + fare.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getLocationsById(fareId: number) {
        return this.globalService.get(Api.Endpoints.FARE.GET_LOCATIONS(fareId)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getFareSubscription(subscriptionId: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.FARE.SUBSCRIPTION + '/' + subscriptionId).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createFare(fare: any) {
        return this.globalService.post(Api.Endpoints.FARE.BASE, fare).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public removeFare(fare: Fare) {
        return this.globalService.delete(Api.Endpoints.FARE.BASE + '/' + fare.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public removeFareByTransport(transportId: number) {
        return this.globalService.delete(Api.Endpoints.FARE.REMOVE_TRANSPORTER_FARE(transportId)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public massive(file: any) {
        return this.globalService.post(Api.Endpoints.FARE.MASSIVE, file).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public uploadMassive(file: FormData) {
        const headers = new HttpHeaders({});
        return this.globalService.post(Api.Endpoints.FARE.MASSIVE_UPLOAD, file, { headers }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public saveMassiveRelations(mapper: any) {
        return this.globalService.post(Api.Endpoints.FARE.MASSIVE_RELATIONS, mapper).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateFare(id: any, fare: any) {
        return this.globalService.put(Api.Endpoints.FARE.BASE + '/' + id, fare).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
