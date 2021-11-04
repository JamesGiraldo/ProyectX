import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { Driver, Vehicle } from '@entities/index';
import { GlobalService } from './global.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    constructor(private globalService: GlobalService) {}

    public getAll(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.VEHICLE.ALL(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getCompanyVehiclePlates(): Observable<any> {
        return this.globalService.get(Api.Endpoints.VEHICLE.PLATE).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllTypes(): Observable<any> {
        return this.globalService.get(Api.Endpoints.VEHICLE.TYPE).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getById(vehicle: Vehicle) {
        return this.globalService.get(Api.Endpoints.VEHICLE.BASE + '/' + vehicle.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createVehicle(vehicle: any) {
        return this.globalService.post(Api.Endpoints.VEHICLE.BASE, vehicle).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public assignDriver(vehicleId: number, driverId: number) {
        return this.globalService.post(Api.Endpoints.VEHICLE.ASSIGN_DRIVER(vehicleId, driverId)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getVehicleCurrentDriver(plate: string): Observable<any> {
        return this.globalService.get(Api.Endpoints.VEHICLE.CURRENT_DRIVER(plate)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getVehicleCapacity(plate: string): Observable<any> {
        return this.globalService.get(Api.Endpoints.VEHICLE.CAPACITY(plate)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateVehicle(id: any, vehicle: any) {
        return this.globalService.put(Api.Endpoints.VEHICLE.BASE + '/' + id, vehicle).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getFilesByVehicle(vehicle: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.VEHICLE.FILE(vehicle)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public uploadFile(vehicle: Vehicle, data: any) {
        const headers = new HttpHeaders({});
        return this.globalService.post(Api.Endpoints.VEHICLE.FILE(vehicle.id), data, { headers }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public deleteFile(file: any) {
        return this.globalService.delete(Api.Endpoints.VEHICLE.DELETE_FILE(file.id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public deleteVehicle(vehicle: Vehicle) {
        return this.globalService.delete(Api.Endpoints.VEHICLE.BASE + '/' + vehicle.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public search(filter: any, pageNumber: number, pageElements: number) {
        return this.globalService.post(Api.Endpoints.VEHICLE.SEARCH(pageNumber, pageElements), filter).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
