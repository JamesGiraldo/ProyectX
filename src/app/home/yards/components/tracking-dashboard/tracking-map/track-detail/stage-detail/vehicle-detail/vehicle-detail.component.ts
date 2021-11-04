import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleControlModalComponent } from '../vehicle-control-modal/vehicle-control-modal.component';

@Component({
    selector: 'app-vehicle-detail',
    templateUrl: './vehicle-detail.component.html',
    styleUrls: ['./vehicle-detail.component.scss'],
})
export class VehicleDetailComponent implements OnInit {
    @Input() vehicle;
    @Input() yard;

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {}

    openNotesDialog() {
        this.dialog
            .open(VehicleControlModalComponent, {
                width: '650px',
                maxHeight: '550px',
                disableClose: false,
                data: { yard: this.yard, vehiclePlate: this.vehicle.plate, tripId: this.vehicle.tripId },
            })
            .afterClosed()
            .subscribe((data) => {});
    }

    /**
     *  Event handlers
     */
    handleViewVehicleControl() {
        this.openNotesDialog();
    }
}
