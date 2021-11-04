import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { YardService } from '../../../../../../../../services';
import { ModalData, VehicleControl } from './vehicle-control.modal.type';

@Component({
    selector: 'app-vehicle-control-modal',
    templateUrl: './vehicle-control-modal.component.html',
    styleUrls: ['./vehicle-control-modal.component.scss'],
})
export class VehicleControlModalComponent implements OnInit {
    public controlInfo: VehicleControl;

    constructor(
        public dialogRef: MatDialogRef<VehicleControlModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ModalData,
        public readonly yardService: YardService,
    ) { }

    ngOnInit(): void {
        this.getVehicleControl();
    }

    /**
     * Event handlers
     */
    public onClose() {
        this.dialogRef.close();
    }

    /**
     * API requests
     */
    getVehicleControl() {
        this.yardService.getCurrentStage(this.data.yard.id, this.data.vehiclePlate, this.data.tripId).subscribe((res) => {
            if (res.data) this.controlInfo = res.data;
        });
    }
}
