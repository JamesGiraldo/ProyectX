import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehicleService } from '@services/vehicle.service';

@Component({
    selector: 'app-modal-vehicles-time',
    templateUrl: './modal-vehicles-time.component.html',
    styleUrls: ['./modal-vehicles-time.component.scss'],
})
export class ModalVehiclesTimeComponent implements OnInit {
    public vehicleTimesForm: FormGroup;
    public vehicleType: string[] = [];
    public submit: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public timeVehicles: any,
        public dialogRef: MatDialogRef<ModalVehiclesTimeComponent>,
        private vehicleService: VehicleService,
        private fb: FormBuilder,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getVehicleType();
        this.patchValue(this.timeVehicles);
    }

    get f() {
        return this.vehicleTimesForm.controls;
    }

    public onClose(data?: any) {
        this.dialogRef.close(data);
    }

    public onSubmit() {
        if (this.vehicleTimesForm.invalid) {
            return;
        }

        if (this.timeVehicles?.id) {
            const data = {
                id: this.timeVehicles?.id,
                fourWheelDrive: this.vehicleTimesForm.get('fourWheelDrive').value,
                lowBoyTruck: this.vehicleTimesForm.get('lowBoyTruck').value,
                simple: this.vehicleTimesForm.get('simple').value,
                timeUnit: 'TIME_UNIT.MINUTE',
                trunkingRig: this.vehicleTimesForm.get('trunkingRig').value,
                trunkingRigMini: this.vehicleTimesForm.get('trunkingRigMini').value,
                turbo: this.vehicleTimesForm.get('turbo').value,
            };

            this.onClose(data);
        } else {
            this.onClose(this.vehicleTimesForm.value);
        }
    }

    private createForm() {
        this.vehicleTimesForm = this.fb.group({
            turbo: ['', [Validators.required]],
            simple: ['', [Validators.required]],
            fourWheelDrive: ['', [Validators.required]],
            trunkingRigMini: ['', [Validators.required]],
            trunkingRig: ['', [Validators.required]],
            lowBoyTruck: ['', [Validators.required]],
            timeUnit: ['TIME_UNIT.MINUTE'],
        });
    }

    private getVehicleType() {
        this.vehicleService.getAllTypes().subscribe((res) => {
            this.vehicleType = res.data?.records;
        });
    }

    private patchValue(data) {
        this.vehicleTimesForm.patchValue({
            turbo: data?.turbo,
            simple: data?.simple,
            fourWheelDrive: data?.fourWheelDrive,
            trunkingRigMini: data?.trunkingRigMini,
            trunkingRig: data?.trunkingRig,
            lowBoyTruck: data?.lowBoyTruck,
        });
    }
}
