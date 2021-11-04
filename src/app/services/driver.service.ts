import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { Driver } from '@apptypes/entities/driver';
import { GlobalService } from '@services/global.service';

@Injectable({
    providedIn: 'root',
})
export class DriverService {
    constructor(private globalService: GlobalService) {}

    public getAll(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.DRIVER.ALL(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getNonRelated(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.DRIVER.NON_RELATED(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getById(driver: number) {
        return this.globalService.get(Api.Endpoints.DRIVER.BASE + '/' + driver).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getHealth(): Observable<any> {
        return this.globalService.get(Api.Endpoints.DRIVER.ALL_HEALTH).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getRisk(): Observable<any> {
        return this.globalService.get(Api.Endpoints.DRIVER.ALL_RISK).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createDriver(driver: any) {
        return this.globalService.post(Api.Endpoints.DRIVER.BASE, driver).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateDriver(id: any, driver: any) {
        return this.globalService.put(Api.Endpoints.DRIVER.BASE + '/' + id, driver).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getFilesByDriver(driver: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.DRIVER.FILE(driver)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public uploadFile(driver: Driver, data: any) {
        const headers = new HttpHeaders({});
        return this.globalService.post(Api.Endpoints.DRIVER.FILE(driver.id), data, { headers }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public deleteFile(file: any) {
        return this.globalService.delete(Api.Endpoints.DRIVER.DELETE_FILE(file.id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public deleteDriver(driver: Driver) {
        return this.globalService.delete(Api.Endpoints.DRIVER.BASE + '/' + driver.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public search(filter: any, pageNumber: number, pageElements: number) {
        return this.globalService.post(Api.Endpoints.DRIVER.SEARCH(pageNumber, pageElements), filter).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
