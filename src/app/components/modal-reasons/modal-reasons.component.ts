import Swal from 'sweetalert2';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from '@services/global.service';
import { CompanyType } from '@apptypes/enums';

@Component({
    selector: 'app-modal-reasons',
    templateUrl: './modal-reasons.component.html',
    styleUrls: ['./modal-reasons.component.scss'],
})
export class ModalReasonsComponent implements OnInit {
    public reasonForm: FormGroup;
    public isGenerator: boolean = null;
    public submit: boolean = true;
    public reasons: string[] = [
        'conductor incapacitado.',
        'vehículo averiado.',
        'vehículo no ha descargado el antiguo viaje.',
        'cambio de conductor',
        'otro',
        'pedido cancelado',
        'no hubo respuestas de transportadoras',
        'otro',
        'no hay vehículos disponibles',
        'tarifa insuficiente',
        'otro',
    ];
    public fieldOtherEnabled: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ModalReasonsComponent>,
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;

        if (this.data.type === 'accept' && this.isGenerator) {
            this.submit = false;
            this.reasonForm.controls['reason'].clearValidators();
            this.reasonForm.controls['description'].setValidators(Validators.required);
            this.reasonForm.controls['description'].updateValueAndValidity();
            this.reasonForm.controls['reason'].updateValueAndValidity();
        }
    }

    get f() {
        return this.reasonForm.controls;
    }

    public onClose(state: boolean = false, data?: string): void {
        this.dialogRef.close({ state, data });
    }

    public onSubmit() {
        if (this.reasonForm.invalid) {
            return;
        }
        const reason = this.reasonForm.get('reason').value + ': ' + this.reasonForm.get('description').value;
        switch (this.data.type) {
            case 'accept':
                this.onClose(true, this.reasonForm.get('description').value);
                break;
            case 'reject':
                this.onClose(true, this.fieldOtherEnabled ? reason : this.reasonForm.get('reason').value);
                break;
            case 'cancel':
                this.onClose(true, this.fieldOtherEnabled ? reason : this.reasonForm.get('reason').value);
                break;
            case 'finish':
                this.onClose(true, this.fieldOtherEnabled ? reason : this.reasonForm.get('reason').value);
                break;
        }
    }

    public reasonChange($event) {
        if ($event.value === 'otro') {
            this.fieldOtherEnabled = true;
            this.reasonForm.controls['description'].setValidators(Validators.required);
            this.reasonForm.controls['description'].updateValueAndValidity();
        } else {
            this.reasonForm.controls['description'].clearValidators();
            this.reasonForm.controls['description'].updateValueAndValidity();
            this.fieldOtherEnabled = false;
        }

        if ($event.value) this.submit = false;
    }

    private createForm() {
        this.reasonForm = this.formBuilder.group({
            reason: ['', [Validators.required]],
            description: [''],
        });
    }
}
