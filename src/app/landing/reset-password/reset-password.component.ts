import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '@services/authentication.service';
import { CustomErrorLogin, errorMessages } from '@utils/validators/custom-error-login';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    public resetForm: FormGroup;
    public loading = false;
    public errors = errorMessages;
    public matcher = new CustomErrorLogin();
    public hidePwd: boolean = true;
    public keyToken: string;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.keyToken = this.route.snapshot.paramMap.get('key');
    }

    get f() {
        return this.resetForm.controls;
    }

    public onSubmit() {
        if (this.resetForm.invalid) {
            return;
        }

        this.loading = true;

        let data = {
            password: this.resetForm.get('password').value,
            reset_token: this.keyToken,
        };
        this.authService
            .resetPassword(data)
            .pipe(delay(1500))
            .subscribe(
                (res) => {
                    res.code > 1000 ? this.onSuccess() : this.onFailure(res);
                },
                (err) => this.onFailure(err),
            );
    }

    private createForm() {
        let regexp_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*_.,?&])[A-Za-z\d$#@$!%*,._?&]{6,15}/g;
        this.resetForm = this.formBuilder.group(
            {
                password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(regexp_password)]],
                repeatPwd: ['', [Validators.required]],
            },
            {
                validator: CustomErrorLogin.passwordMatchValidator,
            },
        );
    }

    private onSuccess() {
        Swal.fire({
            icon: 'success',
            title: 'Cambio de contraseña exitoso',
            text:
                'Se ha cambiado la contraseña de usuario. Por favor, ingrese con su correo electrónico y su nueva contraseña.',
        }).then((result) => {
            if (result.value) {
                this.router.navigate(['/login']);
            }
        });
        this.loading = false;
    }

    private onFailure(err) {
        Swal.fire({
            icon: 'error',
            title: 'Error al cambiar la contraseña',
            html: err.error,
        });
        this.loading = false;
    }
}
