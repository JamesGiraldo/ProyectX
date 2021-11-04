import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiResponse } from '@apptypes/api-response';

@Injectable({
    providedIn: 'root',
})
export class HandleErrorService {
    private closeSource = new BehaviorSubject<boolean>(false);
    public closeEnd$ = this.closeSource.asObservable();

    constructor() {}

    public controlError(res: ApiResponse) {
        if (res.code > 1000) {
            this.onSuccess(res);
            this.closeSource.next(true);
        } else if (res.code === 65) {
            this.closeSource.next(false);
            this.onFailureDoc(res);
        } else {
            this.closeSource.next(false);
            this.onFailure(res);
        }
    }

    public onSuccess(res) {
        Swal.fire({
            icon: 'success',
            title: 'Operación exitosa!',
            text: res.message,
        });
    }

    public onFailure(err) {
        Swal.fire({
            icon: 'error',
            title: `Error de operación: #${err.code}`,
            text: err.error?.statusCode === 500 ? err.error.message : err.error,
        });
    }

    public onFailureDoc(err) {
        Swal.fire({
            icon: 'error',
            title: `Error de operación: #${err.code}`,
            html:
                `${err.error}<br><br><b>Documentos conductores:</b> [${err.data.drivers},]<br>` +
                `<b>Documentos vehículos:</b> [${err.data.vehicles}, ]`,
        });
    }
}
