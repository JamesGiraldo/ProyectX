import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Api } from '../shared/api';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CustomFieldService {
    constructor(private globalService: GlobalService) {}

    public getCustomfields(pageNumber: number, pageElements: number) {
        return this.globalService.get(Api.Endpoints.CUSTOM_FIELD.ALL(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getCustomfieldsByModule(mod) {
        return this.globalService.get(Api.Endpoints.CUSTOM_FIELD.MODULE(mod)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getCustomfieldsByStage(id) {
        return this.globalService.get(Api.Endpoints.CUSTOM_FIELD.STAGE(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createCustomField(customField: any) {
        return this.globalService.post(Api.Endpoints.CUSTOM_FIELD.BASE, customField).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public edit(customFieldId: number, data: any) {
        return this.globalService.put(`${Api.Endpoints.CUSTOM_FIELD.BASE}/${customFieldId}`, data).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public remove(customFieldId: number) {
        return this.globalService.delete(`${Api.Endpoints.CUSTOM_FIELD.BASE}/${customFieldId}`).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
