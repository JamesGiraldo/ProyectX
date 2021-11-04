import Swal from 'sweetalert2';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first, delay } from 'rxjs/operators';

import { AuthenticationService } from '@services/authentication.service';
import { CustomErrorLogin, errorMessages } from '../../utils/validators/custom-error-login';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public errors = errorMessages;
    public matcher = new CustomErrorLogin();

    public hideImage: boolean;
    public hidePwd: boolean;
    public loading = false;
    public login: FormGroup;
    public showWhiteSpace: boolean;

    constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private router: Router) {
        this.createForm();
    }

    ngOnInit(): void {
        this.showWhiteSpace = window.innerHeight <= 500;
        this.hideImage = window.innerWidth <= 375;
        this.hidePwd = true;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.showWhiteSpace = window.innerHeight <= 500;
        this.hideImage = window.innerWidth <= 500;
    }

    public onSubmit(): void {
        if (this.login.invalid) {
            return;
        }

        this.loading = true;
        this.authService
            .login(this.login.value)
            .pipe(first())
            .pipe(delay(1500))
            .subscribe(
                () => {
                    this.onSuccess();
                },
                (err) => {
                    this.onFailure(err);
                },
            );
    }

    private createForm() {
        this.login = this.formBuilder.group({
            email: [
                '',
                [
                    Validators.pattern(
                        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                    ),
                    Validators.required,
                ],
            ],
            password: ['', [Validators.required]],
        });
    }

    private onSuccess() {
        this.router.navigateByUrl('/home');
    }

    private onFailure(err) {
        this.loading = false;

        Swal.fire({
            icon: 'error',
            title: 'Error de sesión',
            text: 'El usuario o la contraseña son incorrectas!',
        });
    }
}
