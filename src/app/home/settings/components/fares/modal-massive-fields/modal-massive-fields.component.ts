import Swal from 'sweetalert2';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Company } from '@apptypes/entities/company';
import { FareService, CompanyService, UserService } from '@services/index';
import { VehicleType } from '@apptypes/enums';

@Component({
    selector: 'app-modal-massive-fields',
    templateUrl: './modal-massive-fields.component.html',
    styleUrls: ['./modal-massive-fields.component.scss'],
})
export class ModalMassiveFieldsComponent implements OnInit {
    public massiveForm: FormGroup;
    private closeRef: boolean;
    public submit: boolean;
    public companies: Company[];
    public vehicleType = VehicleType;
    /* Arrays */
    public turboArray = [];
    public simpleArray = [];
    public troqueArray = [];
    public miniArray = [];
    public tractoArray = [];
    public camaArray = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public fieldsMassiveData: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ModalMassiveFieldsComponent>,
        private fareService: FareService,
        private companyService: CompanyService,
        private userService: UserService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getTransporters();
        this.getFieldsRelation();
    }

    onClose() {
        this.dialogRef.close(true);
    }

    get f() {
        return this.massiveForm.controls;
    }

    public getRecordsArray() {
        this.turboArray.push({
            vehicleType: this.vehicleType.TURBOCHARGE,
            roundTripPrice: this.massiveForm.get('turboRound').value,
            tripPrice: this.massiveForm.get('turboTrip').value,
            tonnagePrice: this.massiveForm.get('turboTonnage').value,
        });
        this.simpleArray.push({
            vehicleType: this.vehicleType.SIMPLE,
            roundTripPrice: this.massiveForm.get('simpleRound').value,
            tonnagePrice: this.massiveForm.get('simpleTonnage').value,
            tripPrice: this.massiveForm.get('simpleTrip').value,
        });
        this.troqueArray.push({
            vehicleType: this.vehicleType.FOUR_WHEEL_DRIVE,
            roundTripPrice: this.massiveForm.get('troqueRound').value,
            tonnagePrice: this.massiveForm.get('troqueTonnage').value,
            tripPrice: this.massiveForm.get('troqueTrip').value,
        });
        this.miniArray.push({
            vehicleType: this.vehicleType.TRUNKING_RIG_MINI,
            roundTripPrice: this.massiveForm.get('miniRound').value,
            tonnagePrice: this.massiveForm.get('miniTonnage').value,
            tripPrice: this.massiveForm.get('miniTrip').value,
        });
        this.tractoArray.push({
            vehicleType: this.vehicleType.TRUNKING_RIG,
            roundTripPrice: this.massiveForm.get('tractoRound').value,
            tonnagePrice: this.massiveForm.get('tractoTonnage').value,
            tripPrice: this.massiveForm.get('tractoTrip').value,
        });
        this.camaArray.push({
            vehicleType: this.vehicleType.LOW_BOY_TRUCK,
            roundTripPrice: this.massiveForm.get('camaRound').value,
            tonnagePrice: this.massiveForm.get('camaTonnage').value,
            tripPrice: this.massiveForm.get('camaTrip').value,
        });
        return [
            this.turboArray[0],
            this.simpleArray[0],
            this.troqueArray[0],
            this.miniArray[0],
            this.tractoArray[0],
            this.camaArray[0],
        ];
    }

    public onSubmit() {
        this.submit = true;
        const data = {
            transporterId: this.massiveForm.get('transporterId').value,
            origins: this.massiveForm.get('origins').value,
            destinies: this.massiveForm.get('destinies').value,
            records: this.getRecordsArray(),
        };

        if (this.massiveForm.invalid) {
            return;
        }

        let mapper = this.massiveForm.value;
        mapper['origins'] = mapper['origins'].join('|-|');
        mapper['destinies'] = mapper['destinies'].join('|-|');

        this.fareService.massive(data).subscribe(
            (res) => {
                this.closeRef = res;
                if (res.code < 1000) this.onFailure(res);
                else this.onSuccess();

                this.updateFieldsRelation(mapper);
                this.submit = false;

                this.onClose();
            },
            (err) => {
                this.submit = false;
                this.onFailure(err);
                this.updateFieldsRelation(mapper);
            },
        );

        this.emptyArray();
    }

    private createForm() {
        this.massiveForm = this.formBuilder.group({
            transporterId: ['N/A'],
            turboRound: ['N/A'],
            turboTonnage: ['N/A'],
            turboTrip: ['N/A'],
            simpleRound: ['N/A'],
            simpleTonnage: ['N/A'],
            simpleTrip: ['N/A'],
            troqueRound: ['N/A'],
            troqueTonnage: ['N/A'],
            troqueTrip: ['N/A'],
            miniRound: ['N/A'],
            miniTonnage: ['N/A'],
            miniTrip: ['N/A'],
            tractoRound: ['N/A'],
            tractoTonnage: ['N/A'],
            tractoTrip: ['N/A'],
            camaRound: ['N/A'],
            camaTonnage: ['N/A'],
            camaTrip: ['N/A'],
            destinies: [['N/A'], [Validators.required]],
            origins: [['N/A'], [Validators.required]],
        });
    }

    private patchValue(data) {
        this.massiveForm.patchValue({
            transporterId: data.transporterId,
            turboRound: data.turboRound,
            turboTonnage: data.turboTonnage,
            turboTrip: data.turboTrip,
            simpleRound: data.simpleRound,
            simpleTonnage: data.simpleTonnage,
            simpleTrip: data.simpleTrip,
            troqueRound: data.troqueRound,
            troqueTonnage: data.troqueTonnage,
            troqueTrip: data.troqueTrip,
            miniRound: data.miniRound,
            miniTonnage: data.miniTonnage,
            miniTrip: data.miniTrip,
            tractoRound: data.tractoRound,
            tractoTonnage: data.tractoTonnage,
            tractoTrip: data.tractoTrip,
            camaRound: data.camaRound,
            camaTonnage: data.camaTonnage,
            camaTrip: data.camaTrip,
            destinies: data.destinies.split('|-|'),
            origins: data.origins.split('|-|'),
        });
    }

    private emptyArray() {
        this.turboArray = [];
        this.simpleArray = [];
        this.troqueArray = [];
        this.miniArray = [];
        this.tractoArray = [];
        this.camaArray = [];
    }

    private getTransporters(): void {
        this.companyService.getAllTransporters(0, 0).subscribe((res) => {
            this.companies = [...res.data.records];
        });
    }

    /**
     * API CALLS
     */
    private getFieldsRelation() {
        this.userService.relationsOfFare().subscribe((res) => {
            if (res.data) this.patchValue(res.data);
        });
    }

    private updateFieldsRelation(mapper: any) {
        this.fareService.saveMassiveRelations(mapper).subscribe((res) => {});
    }

    private onSuccess() {
        Swal.fire({
            icon: 'success',
            title: 'Cargue exitoso',
            text: 'El cargue masivo de los campos fue exitoso!',
        });
    }

    private onFailure(err) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el Cargue',
            html: err.error,
        });
    }
}
