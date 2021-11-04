import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';
import { User } from '@apptypes/entities';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private globalService: GlobalService) {}

    public getAll(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.USER.ALL(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getById(user: any) {
        return this.globalService.get(Api.Endpoints.USER.BASE + '/' + user.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAssignment(user: User) {
        return this.globalService.get(Api.Endpoints.USER.CONFIG_AA(user.id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getRightToSee(user: User) {
        return this.globalService.get(Api.Endpoints.USER.RIGHT_TO_SEE(user.id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateRightToSee(rights: any) {
        return this.globalService.put(Api.Endpoints.USER.RIGHT_TO_SEE_BASE, rights).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateAssigment(user: User, data: any) {
        return this.globalService.put(Api.Endpoints.USER.CONFIG_AA(user.id), data).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAAConfigTimes(user: User) {
        return this.globalService.get(Api.Endpoints.USER.CONFIG_AA(user.id) + '?justTimes=true').pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public relationsOfPublication() {
        return this.globalService.get(`${Api.Endpoints.USER.BASE}/publication_massive`).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public relationsOfFare() {
        return this.globalService.get(`${Api.Endpoints.USER.BASE}/fare_massive`).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
