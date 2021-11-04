import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Api } from '../shared/api';
import { map } from 'rxjs/operators';
import { InterventedRoute } from '@apptypes/entities';

@Injectable({
    providedIn: 'root',
})
export class InterventedRouteService {
    constructor(private globalService: GlobalService) {}

    public getInterventedRoutes() {
        return this.globalService.get(Api.Endpoints.INTERVENTED_ROUTE.BASE).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createInterventedRoute(interventedRoute: any) {
        return this.globalService.post(Api.Endpoints.INTERVENTED_ROUTE.BASE, interventedRoute).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public remove(interventedRouteId: number) {
        return this.globalService.delete(`${Api.Endpoints.INTERVENTED_ROUTE.BASE}/${interventedRouteId}`).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
