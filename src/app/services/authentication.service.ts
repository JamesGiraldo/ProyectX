import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Api } from '../shared/api';
import { GlobalService } from '@services/global.service';
import { Login } from '@entities/login';
import { HttpEvent } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    public redirectUrl: string;

    constructor(private globalService: GlobalService, private router: Router, private http: HttpClient) {}

    /**
     * @description realizar login
     * @returns Observable <any>
     */
    public login(data: Login): Observable<any> {
        return this.globalService
            .post(Api.Endpoints.AUTH.LOGIN, {
                email: data.email,
                password: data.password,
            })
            .pipe(
                map((res) => {
                    localStorage.setItem('token', res.data['token']);

                    return res.data;
                }),
            );
    }

    public isLoggedIn() {
        const token = localStorage.getItem('token');
        if (token) {
            return true;
        }
        return false;
    }

    public saveToken(token: any): any {
        localStorage.setItem('token', token);
    }

    public getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }

    public logout() {
        localStorage.clear();

        this.router.navigate(['/login']);
    }

    public refreshToken(): Observable<HttpEvent<any>> {
        return this.globalService.post(Api.Endpoints.AUTH.REFRESH, {
            token: this.globalService.getToken(),
        });
    }

    public recoveryPassword(email: string) {
        return this.globalService.post(Api.Endpoints.AUTH.RECOVERY_PASSWORD, { email: email }).pipe(
            map((res) => {
                return res;
            }),
        );
    }

    public resetPassword(data: any) {
        return this.globalService.put(Api.Endpoints.AUTH.SET_PASSWORD, data).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
