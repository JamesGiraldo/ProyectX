import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CustomErrorLogin, errorMessages } from '@utils/validators/custom-error-login';
import { AuthenticationService } from '@services/authentication.service';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-password-recovery',
    templateUrl: './password-recovery.component.html',
    styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {
    public recoveryForm: FormGroup;
    public loading = false;
    public errors = errorMessages;
    public matcher = new CustomErrorLogin();

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params.email) this.recoveryForm.get('email').setValue(params.email);
        });
    }

    public onSubmit() {
        if (this.recoveryForm.invalid) {
            return;
        }
        this.loading = true;

        let email = this.recoveryForm.get('email').value;
        this.authService
            .recoveryPassword(email)
            .pipe(delay(1500))
            .subscribe(
                (res) => {
                    res.code > 1000 ? this.onSuccess() : this.onFailure(res);
                },
                (err) => this.onFailure(err),
            );
    }

    private createForm() {
        this.recoveryForm = this.formBuilder.group({
            email: [
                '',
                [
                    Validators.pattern(
                        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                    ),
                    Validators.required,
                ],
            ],
        });
    }

    private onSuccess() {
        Swal.fire({
            icon: 'success',
            title: 'Recuperación exitosa',
            text:
                'Se ha enviado un mensaje al correo electrónico anterior. Por favor siga las instruciones ahí descritas en su correo!',
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
            title: 'Error de recuperación',
            html: err.error,
        });
        this.loading = false;
    }
}
