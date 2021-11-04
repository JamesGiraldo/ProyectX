import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { Stage, Yard } from '@entities/index';
import { GlobalService } from './global.service';

@Injectable({
    providedIn: 'root',
})
export class YardService {
    constructor(private globalService: GlobalService) {}

    public getAll(): Observable<any> {
        return this.globalService.get(Api.Endpoints.YARD.BASE).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getYardsTracking() {
        return this.globalService.get(Api.Endpoints.YARD.TRACKING).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllTracking(page, elements) {
        return this.globalService.post(Api.Endpoints.YARD.VECHILES(page, elements), { value: '' }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public searchTracking(query, page, elements) {
        return this.globalService.post(Api.Endpoints.YARD.VECHILES(page, elements), query).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getById(yard: Yard) {
        return this.globalService.get(Api.Endpoints.YARD.BASE + '/' + yard).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getStagesWithVehicleCount(yardId: number) {
        return this.globalService.get(Api.Endpoints.YARD.STAGES_WITH_VEHICLE_COUNT(yardId)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllFormInspection(): Observable<any> {
        return this.globalService.get(Api.Endpoints.YARD.FORM_INSPECTION).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllFormHeader(id): Observable<any> {
        return this.globalService.get(Api.Endpoints.YARD.FORM_HEADER(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllFormResponses(id): Observable<any> {
        return this.globalService.get(Api.Endpoints.YARD.FORM_INSPECTION_RESPONSES(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public create(yard: any) {
        return this.globalService.post(Api.Endpoints.YARD.BASE, yard).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public update(id: any, yard: any) {
        return this.globalService.put(Api.Endpoints.YARD.BASE + '/' + id, yard).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public delete(yard: Yard) {
        return this.globalService.delete(Api.Endpoints.YARD.BASE + '/' + yard.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createStage(id: number, stage: any) {
        return this.globalService.post(Api.Endpoints.YARD.STAGE(id), stage).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public reportControl(id: number, searchQuery: any, stage: any) {
        return this.globalService.post(Api.Endpoints.YARD.REPORT(id, searchQuery), stage).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getStage(id: any) {
        return this.globalService.get(Api.Endpoints.YARD.YARD_STAGE(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateStage(id: any, stage: any) {
        return this.globalService.put(Api.Endpoints.YARD.YARD_STAGE(id), stage).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public deleteStage(stage: Stage) {
        return this.globalService.delete(Api.Endpoints.YARD.YARD_STAGE(stage.id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getCurrentStage(yardId: number, searchQuery: any, tripId: any) {
        return this.globalService
            .post(Api.Endpoints.YARD.EXAMINE_CURRENT_STAGES(yardId, searchQuery), { tripId: tripId })
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public getReports(pageNumber: number, pageElements: number, start: string, end: string, data: any) {
        return this.globalService
            .post(Api.Endpoints.YARD_REPORTS.REPORTS(pageNumber, pageElements, start, end), {
                yardsId: data.yardsId,
                stages: data.stages,
                searchParam: data.searchParam,
            })
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public getCountVehicles(pageNumber: number, pageElements: number, start: string, end: string, data: any) {
        return this.globalService
            .post(Api.Endpoints.YARD_REPORTS.REPORTS_VEHICLES(pageNumber, pageElements, start, end), data)
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public getYardsIdStages(data: any) {
        return this.globalService
            .post(Api.Endpoints.YARD_REPORTS.YARDSIDTAGES, {
                yardsId: data.yardsId,
            })
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public getYardStagesAverages(pageNumber: number, pageElements: number, start: string, end: string, data: any) {
        return this.globalService
            .post(Api.Endpoints.YARD_REPORTS.YARDSTAGESAVERAGES(pageNumber, pageElements, start, end), {
                yardsId: data.yardsId,
                stages: data.stages,
            })
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public search(querySearch: string) {
        return this.globalService.post(Api.Endpoints.YARD.SEARCH_YARD, { name: querySearch }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllShifts(page, elements, start, end, yard): Observable<any> {
        return this.globalService.get(Api.Endpoints.YARD.SHIFT(page, elements, start, end, yard)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public reschedule(id: number, data: any) {
        return this.globalService.post(Api.Endpoints.YARD.SHIFT_RESCHEDULE(id), data).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public sendFormResponse(data: any) {
        return this.globalService.post(Api.Endpoints.YARD.FORM_INSPECTION_RESPONSE, data).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public uploadFileResponse(formId: any, data: any) {
        const headers = new HttpHeaders({});
        return this.globalService.post(Api.Endpoints.YARD.FORM_INSPECTION_FILE(formId), data, { headers }).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
