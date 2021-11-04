import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';
import { Company } from '@apptypes/entities';

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    constructor(private globalService: GlobalService) {}

    public getAll(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.COMPANY.ALL_PAGE(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllTransporters(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.COMPANY.TRANSPORTER(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllByTransporter(): Observable<any> {
        return this.globalService.get(Api.Endpoints.COMPANY.TRANSPORTER(0, 0)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllGeneratorTransporterRelation(): Observable<any> {
        return this.globalService.get(Api.Endpoints.COMPANY.RELATION.BASE).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public createGeneratorTransporterRelation(transporterId: any) {
        return this.globalService.post(Api.Endpoints.COMPANY.RELATION.BASE, transporterId).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public removeGeneratorTransporterRelation(company: Company) {
        return this.globalService.delete(Api.Endpoints.COMPANY.RELATION.BASE + '/' + company.id).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getGeneratorTransporterRelationOfCompany(pageNumber: number, pageElements: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.COMPANY.RELATION.GET_BY_COMPANY(pageNumber, pageElements)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getCompanyMuniciaplities(): Observable<any> {
        const user = this.globalService.getDecodedToken();
        return this.globalService.get(Api.Endpoints.COMPANY.MUNICIPALITY(user.company.id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getBlockage(): Observable<any> {
        return this.globalService.get(Api.Endpoints.COMPANY.BLOCKAGE).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateBlockage(data: any) {
        return this.globalService.put(Api.Endpoints.COMPANY.BLOCKAGE, data).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getValidationReport(id): Observable<any> {
        return this.globalService.get(Api.Endpoints.COMPANY.VALIDATION_REPORTS(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateValidationReport(id: number, data: any) {
        return this.globalService.put(Api.Endpoints.COMPANY.VALIDATION_REPORTS(id), data).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getAllValidationYear(id: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.COMPANY.VALIDATION_YEAR(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateValidationYear(id: number, data: any) {
        return this.globalService.put(Api.Endpoints.COMPANY.UPDATE_VALIDATION_YEAR(id), data).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
