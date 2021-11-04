import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class QuizService {
    constructor(private readonly globalService: GlobalService) {}

    private driverQuizId = new BehaviorSubject<number>(null);
    public driverQuizIdObservable = this.driverQuizId.asObservable();

    /* Enviar driverQuizId */
    public sendDriverQuizId(id: number): void {
        this.driverQuizId.next(id);
    }

    public getAll(id: number): Observable<any> {
        return this.globalService.get(Api.Endpoints.QUIZ.QUESTIONS(id)).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public getDriverInfo(id_card: string, pageNumber: number, pageElements: number): Observable<any> {
        const params = new HttpParams().set('key', id_card);
        return this.globalService
            .get(Api.Endpoints.TRIP.DRIVER_FILES(id_card, pageNumber, pageElements), { params })
            .pipe(
                map((res) => {
                    return res;
                }),
            );
    }

    public createQuiz(driverId: number, quizId: number) {
        return this.globalService.post(Api.Endpoints.QUIZ.CREATE_QUIZ, { driverId: driverId, quizId: quizId }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public updateSeen(id: any, data: any) {
        const params = new HttpParams().set('id', id);
        return this.globalService.put(Api.Endpoints.QUIZ.UPDATE_QUIZ(id), data, { params }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public sendQuiz(quizId: any, data: any) {
        const params = new HttpParams().set('quizId', quizId);
        return this.globalService.post(Api.Endpoints.QUIZ.SEND_QUIZ(quizId), data, { params }).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
