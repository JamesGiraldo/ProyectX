import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith, debounceTime, switchMap, map, filter, take } from 'rxjs/operators';

import { Company } from '@apptypes/entities';
import { CompanyService, GlobalService, HandleErrorService } from '@services/index';

@Component({
    selector: 'app-modal-newloyal',
    templateUrl: './modal-newloyal.component.html',
    styleUrls: ['./modal-newloyal.component.scss'],
})
export class ModalNewloyalComponent implements OnInit {
    @Output() refresh = new EventEmitter<boolean>();
    public filteredTransporters: Observable<any>;
    public submit: boolean = false;
    public transporterForm: FormGroup;
    public transporters: Company;
    public empty: boolean;
    public token: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public loyalData: any,
        private companyService: CompanyService,
        private fb: FormBuilder,
        private globalService: GlobalService,
        private handleErrorService: HandleErrorService,
        public dialogRef: MatDialogRef<ModalNewloyalComponent>,
    ) {
        this.transporterForm = this.fb.group({
            transporterId: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.getTransportersLoyal();
        this.filteredTransporters = this.transporterForm.get('transporterId').valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            switchMap((value) => this.filterTransporter(value)),
        );
    }

    get f() {
        return this.transporterForm.controls;
    }

    public displayFn(transporter: Company): string {
        return transporter && transporter.name ? transporter.name : '';
    }

    public onClose(): void {
        this.dialogRef.close();
    }

    public onSubmit() {
        if (this.transporterForm.invalid) {
            return;
        }

        this.submit = true;

        let transporterId = this.transporterForm.get('transporterId').value;
        const data = {
            token: this.globalService.getToken(),
            transporterId: transporterId.id,
        };

        this.companyService.createGeneratorTransporterRelation(data).subscribe(
            (res) => {
                this.handleErrorService.controlError(res);
                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                    this.submit = false;
                });
            },
            (err) => {
                this.handleErrorService.onFailure(err);
                this.submit = false;
            },
        );
    }

    public removeLoyalty(id: any) {
        this.companyService.removeGeneratorTransporterRelation(id).subscribe(
            () => {
                this.getTransportersLoyal();
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }

    private filterTransporter(value: string) {
        return this.companyService.getAllByTransporter().pipe(
            filter((data) => !!data),
            map((res) => {
                return res.data?.records.filter((option) => option.name.toLowerCase().includes(value));
            }),
        );
    }

    private getTransportersLoyal() {
        this.companyService.getAllTransporters(0, 0).subscribe((res) => {
            this.transporters = res.data?.records;

            res.data.elementsPerPage > 0 ? (this.empty = false) : (this.empty = true);
        });
    }
}
