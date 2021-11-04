import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErrorLogin implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }

    static passwordMatchValidator(control: AbstractControl) {
        const password: string = control.get('password').value; // get password from our password form control
        const confirmPassword: string = control.get('repeatPwd').value; // get password from our confirmPassword form control
        // compare is the password math
        if (password !== confirmPassword) {
            // if they don't match, set an error in our confirmPassword form control
            control.get('repeatPwd').setErrors({ NoPassswordMatch: true });
        }
    }
}

export const errorMessages: { [key: string]: string } = {
    email: 'La dirección de correo electrónico es inválida. Ej: email@email.com',
    password: 'La contraseña es requerida',
    matchPassword:
        ' La nueva contraseña debe contener mín. 6 caracteres entre números (0-9), letras (a-z), caracteres especiales (#$%&._) y alguna mayúscula.',
};
