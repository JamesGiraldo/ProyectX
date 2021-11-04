import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, switchMap, filter, take, map } from 'rxjs/operators';

import { Api } from 'src/app/shared/api';
import { GlobalService, AuthenticationService } from '@services/index';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    @BlockUI() blockUI: NgBlockUI;
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private globalService: GlobalService,
        private authService: AuthenticationService,
        private router: Router,
    ) {}

    /**
     * @description Intecepta las respuestas y agrega los headers.
     */

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let urlCourseCC = this.router.routerState.snapshot.root.children[0].params['cc'];

        if (
            request.url === Api.Endpoints.AUTH.RECOVERY_PASSWORD ||
            request.url === Api.Endpoints.AUTH.SET_PASSWORD ||
            request.url === Api.Endpoints.QUIZ.QUESTIONS(urlCourseCC) ||
            request.url === Api.Endpoints.TRIP.DRIVER_FILES(request.params.get('key'), 1, 0) ||
            request.url === Api.Endpoints.QUIZ.CREATE_QUIZ ||
            request.url === Api.Endpoints.QUIZ.UPDATE_QUIZ(request.params.get('id')) ||
            request.url === Api.Endpoints.QUIZ.SEND_QUIZ(request.params.get('quizId'))
        ) {
            return this.handleRequestRecovery(request, next);
        }

        // in case that the login token triggers the intercerptor
        if (request.url === Api.Endpoints.AUTH.LOGIN) {
            return this.handleRequest(request, next);
        }

        // in case that the refresh token triggers the intercerptor
        if (request.url === Api.Endpoints.AUTH.REFRESH) {
            return this.handleRequest(request, next);
        }

        if (this.isTokenExpired()) {
            if (!this.isRefreshing) {
                this.isRefreshing = true;
                this.refreshTokenSubject.next(null);
                return this.authService.refreshToken().pipe(
                    switchMap((response) => {
                        this.authService.saveToken(response['data']['token']);
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(response['data']['token']);
                        return next.handle(this.addToken(request));
                    }),
                );
            } else {
                return this.refreshTokenSubject.pipe(
                    filter((result) => result !== null),
                    take(1),
                    switchMap((response) => {
                        return next.handle(this.addToken(request));
                    }),
                );
            }
        } else {
            return next.handle(this.addToken(request)).pipe(
                map((response) => {
                    if (this.hasError35(response)) {
                        this.onError35(response['body']);
                    } else {
                        return response;
                    }
                }),
            );
        }
    }

    private addToken(request: HttpRequest<any>) {
        const token = this.globalService.getToken();
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
            },
        });
    }

    private isTokenExpired(): boolean {
        const payload = this.globalService.getDecodedToken();
        return Date.now() >= payload['exp'] * 1000;
    }

    private hasError35(response: HttpEvent<any>): boolean {
        if (response instanceof HttpResponse) {
            if (response.body.code == 35) return true;
        }
        return false;
    }

    private handleRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    if (event.body.code == 34) {
                        console.error('impossible');
                    } else if (event.body.code == 35) {
                        this.displayResponseModal(event.body);
                    } else {
                        this.displayResponseModal(event.body);
                        return event;
                    }
                } else {
                    return throwError(event);
                }
            }),
        );
    }

    private handleRequestRecovery(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap((event) => {}));
    }

    private displayResponseModal(res) {
        if (res.code > 1000 && res.code != 1112 && res.code != 1107) {
            //success and it isnt token refresh
            this.onSuccess(res);
        } else if (res.code < 1000) {
            // error
            this.onFailure(res);
        } else {
            if (res.code != 1112) {
                return throwError(res);
            }
        }
    }

    private onSuccess(res) {
        Swal.fire({
            icon: 'success',
            title: 'Operación exitosa!',
            text: res.message,
        });

        this.blockUI.stop();
    }

    private onFailure(err) {
        Swal.fire({
            icon: 'error',
            title: 'Error de operación: #' + err.code,
            text: err.error,
        });

        this.blockUI.stop();
    }

    private onError35(err) {
        Swal.fire({
            icon: 'error',
            title: 'Error de operación: #' + err.code,
            text: err.error,
        }).then(() => {
            this.authService.logout();
        });

        this.blockUI.stop();
    }
}
