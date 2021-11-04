import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, startWith, take } from 'rxjs/operators';

import { CompanyService, FareService, HandleErrorService } from '@services/index';
import { User, Company } from '@apptypes/entities';
import { Observable } from 'rxjs';
import { VehicleType } from '../../../../../types/enums';

@Component({
    selector: 'app-modal-newfare',
    templateUrl: './modal-newfare.component.html',
    styleUrls: ['./modal-newfare.component.scss'],
})
export class ModalNewfareComponent implements OnInit {
    private closeRef: boolean;
    public isEnable: boolean = true;
    public companies: Company[];
    public destinyArray = [];
    public fareForm: FormGroup;
    public vehicleTypes = [];
    public originArray = [];
    public recordArray = [];
    public submit = false;
    public user: User;
    municipalities: string[] = [];
    filteredOrigins: Observable<string[]>[] = [];
    filteredDestinies: Observable<string[]>[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public fareData: any,
        private cdRef: ChangeDetectorRef,
        private companyService: CompanyService,
        private fareService: FareService,
        private formBuilder: FormBuilder,
        private handleErrorService: HandleErrorService,
        public dialogRef: MatDialogRef<ModalNewfareComponent>,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.vehicleTypes = Object.keys(VehicleType).map((k) => VehicleType[k]);
        this.getTransportes();
        this.getMunicipalities();
        this.patchValue(this.fareData.fare);
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    get f() {
        return this.fareForm.controls;
    }

    get getDestinies() {
        return this.fareForm.get('destinies') as FormArray;
    }

    get getOrigins() {
        return this.fareForm.get('origins') as FormArray;
    }

    get getRecords() {
        return this.fareForm.get('records') as FormArray;
    }

    filterMunicipality(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.municipalities.filter((name) => name.toLowerCase().includes(filterValue));
    }

    manageOriginLookup(index: number) {
        const origins = this.fareForm.get('origins') as FormArray;
        this.filteredOrigins[index] = origins
            .at(index)
            .get('nameOrigin')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterMunicipality(value)),
            );
    }

    manageDestinyLookup(index: number) {
        const destinies = this.fareForm.get('destinies') as FormArray;
        this.filteredDestinies[index] = destinies
            .at(index)
            .get('nameDestiny')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterMunicipality(value)),
            );
    }

    public addOrigin() {
        const control = this.fareForm.controls['origins'] as FormArray;
        control.push(
            this.formBuilder.group({
                idOrigin: [],
                nameOrigin: ['', [Validators.required]],
            }),
        );

        this.manageOriginLookup(control.length - 1);
    }

    public addDestiny() {
        const control = this.fareForm.controls['destinies'] as FormArray;
        control.push(
            this.formBuilder.group({
                idDestiny: [],
                nameDestiny: ['', [Validators.required]],
            }),
        );

        this.manageDestinyLookup(control.length - 1);
    }

    public addRecord() {
        const control = <FormArray>this.fareForm.controls['records'];

        if (control.value.length < 6) {
            control.push(
                this.formBuilder.group({
                    idRecord: [],
                    vehicleType: ['', [Validators.required]],
                    tonnagePrice: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                    tripPrice: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                    roundTripPrice: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                }),
            );
            this.isEnable = true;
        } else {
            this.isEnable = false;
        }
    }

    public onClose(): void {
        this.dialogRef.close(this.fareData);
    }

    public onSubmit() {
        if (this.fareForm.invalid) {
            return;
        }

        this.fillArray();
        this.submit = true;

        const data = {
            transporterId: this.fareForm.get('transporterId').value,
            records: this.recordArray.length > 0 ? this.recordArray : [],
            origins: this.originArray.length > 0 ? this.originArray : [],
            destinies: this.destinyArray.length > 0 ? this.destinyArray : [],
        };

        if (this.fareData.fare.id) {
            this.fareService.updateFare(this.fareData.fare.id, data).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                        this.closeRef = res;
                        if (this.closeRef) this.onClose();
                        this.submit = false;
                    });
                    this.fareData.refresh = true;
                },
                (err) => {
                    this.handleErrorService.onFailure(err);
                    this.submit = false;
                },
            );
        } else {
            this.fareService.createFare(data).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                        this.closeRef = res;
                        if (this.closeRef) this.onClose();
                        this.submit = false;
                    });
                    this.fareData.refresh = true;
                },
                (err) => {
                    this.handleErrorService.onFailure(err);
                    this.submit = false;
                },
            );
        }
    }

    public removeOrigin(index: number) {
        const control = <FormArray>this.fareForm.controls['origins'];
        control.removeAt(index);
        this.filteredOrigins.splice(index, 1);
    }

    public removeDestiny(index: number) {
        const control = <FormArray>this.fareForm.controls['destinies'];
        control.removeAt(index);
        this.filteredDestinies.splice(index, 1);
    }

    public removeRecord(index: number) {
        const control = <FormArray>this.fareForm.controls['records'];

        control.controls.length <= 6 ? (this.isEnable = true) : (this.isEnable = false);
        control.removeAt(index);
    }

    private createForm() {
        this.fareForm = this.formBuilder.group({
            transporterId: ['', [Validators.required]],
            origins: this.formBuilder.array([]),
            destinies: this.formBuilder.array([]),
            records: this.formBuilder.array([]),
        });
        this.addOrigin();
        this.addDestiny();
        this.addRecord();
    }

    private fillArray() {
        this.getDestinies.value.forEach((destiny) => {
            this.destinyArray.push({
                id: destiny.idDestiny,
                name: destiny.nameDestiny === '' ? '' : destiny.nameDestiny,
            });
        });

        this.getOrigins.value.forEach((origin) => {
            this.originArray.push({
                id: origin.idOrigin,
                name: origin.nameOrigin === '' ? '' : origin.nameOrigin,
            });
        });

        this.getRecords.value.forEach((record) => {
            this.recordArray.push({
                id: record.idRecord,
                vehicleType: record.vehicleType,
                tonnagePrice: record.tonnagePrice,
                tripPrice: record.tripPrice,
                roundTripPrice: record.roundTripPrice,
            });
        });
    }

    private getTransportes(): void {
        this.companyService.getAllTransporters(0, 0).subscribe((res) => {
            this.companies = [...res.data.records];
        });
    }

    getMunicipalities() {
        this.companyService.getCompanyMuniciaplities().subscribe((res) => {
            this.municipalities = res.data.records;
        });
    }

    private patchValue(data) {
        this.updateOrigins(data);
        this.updateDestinies(data);
        this.updateRecords(data);
        this.fareForm.patchValue({
            transporterId: data.transporterId,
        });
    }

    private updateOrigins(data) {
        const originControls = this.fareForm.controls['origins'] as FormArray;
        for (let controlIndex = originControls.length - 1; controlIndex >= 0; controlIndex--) {
            this.removeOrigin(controlIndex);
        }

        if (data.origins != null) {
            const origins = data.origins.map((o) => o);

            for (let originIndex = 0; originIndex < origins.length; originIndex++) {
                this.addOrigin();
                originControls.at(originIndex).setValue({
                    idOrigin: origins[originIndex].id,
                    nameOrigin: origins[originIndex].name,
                });
            }
        } else {
            this.addOrigin();
        }
    }

    private updateDestinies(data) {
        const destiniesControls = this.fareForm.controls['destinies'] as FormArray;
        for (let controlIndex = destiniesControls.length - 1; controlIndex >= 0; controlIndex--) {
            this.removeDestiny(controlIndex);
        }

        if (data.destinies != null) {
            const destinies = data.destinies?.map((d) => d);

            for (let destinyIndex = 0; destinyIndex < destinies.length; destinyIndex++) {
                this.addDestiny();
                destiniesControls.at(destinyIndex).setValue({
                    idDestiny: destinies[destinyIndex].id,
                    nameDestiny: destinies[destinyIndex].name,
                });
            }
        } else {
            this.addDestiny();
        }
    }

    private updateRecords(data) {
        const recordControls = this.fareForm.controls['records'] as FormArray;
        for (let controlIndex = recordControls.length - 1; controlIndex >= 0; controlIndex--) {
            this.removeRecord(controlIndex);
        }

        if (data.records != null) {
            const records = data.records.map((o) => o);

            for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
                this.addRecord();
                recordControls.at(recordIndex).setValue({
                    idRecord: records[recordIndex].id,
                    vehicleType: records[recordIndex].vehicleType,
                    tripPrice: records[recordIndex].tripPrice,
                    roundTripPrice: records[recordIndex].roundTripPrice,
                    tonnagePrice: records[recordIndex].tonnagePrice,
                });
            }
        } else {
            this.addRecord();
        }
    }

    private onFailure(err) {
        this.submit = false;
        Swal.fire({
            icon: 'error',
            title: 'Error de operación',
            html: err.error,
        });
    }
}
