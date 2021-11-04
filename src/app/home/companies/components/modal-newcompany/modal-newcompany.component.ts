import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-modal-newcompany',
    templateUrl: './modal-newcompany.component.html',
    styleUrls: ['./modal-newcompany.component.scss'],
})
export class ModalNewcompanyComponent implements OnInit {
    public submit: boolean = false;
    public companyForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<ModalNewcompanyComponent>,
        @Inject(MAT_DIALOG_DATA) public companyData: any,
        private formBuilder: FormBuilder,
    ) {
        this.createForm();
    }

    ngOnInit(): void {}

    public onClose(): void {
        this.dialogRef.close(this.companyData);
    }

    public onSubmit() {
        this.submit = true;
        this.submit = false;
    }

    private createForm() {
        this.companyForm = this.formBuilder.group({
            type: ['', [Validators.required]],
            state: [''],
            email: ['', [Validators.required]],
            name: ['', [Validators.required]],
            address: ['', [Validators.required]],
            phoneCode: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            rating: ['', [Validators.required]],
        });
    }
}
