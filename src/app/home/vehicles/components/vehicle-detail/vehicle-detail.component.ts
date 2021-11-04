import Swal from 'sweetalert2';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ModalNewvehicleComponent } from '../modal-newvehicle/modal-newvehicle.component';
import { VehicleService } from '@services/vehicle.service';
import { OwnershipVehicle } from '../../../../types/enums/ownership.enum';
import { ModalDetailsFilesComponent } from 'src/app/components/modal-details-files/modal-details-files.component';
import { HandleErrorService } from '@services/handle-error.service';

@Component({
    selector: '[vehicle-detail]',
    templateUrl: './vehicle-detail.component.html',
    styleUrls: ['./vehicle-detail.component.scss'],
})
export class VehicleDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('vehicle') vehicle: any;
    @Input('columns') columns: any[];
    @Output() refresh = new EventEmitter<boolean>();
    driverName: string;
    public ratings: string[];
    public countDocuments;
    public vehicleType = [
        { id: 1, name: 'turbo' },
        { id: 2, name: 'simple' },
        { id: 3, name: 'doble troque' },
        { id: 4, name: 'mini mula' },
        { id: 5, name: 'mula' },
        { id: 6, name: 'cama baja' },
    ];

    ownership = OwnershipVehicle;

    constructor(
        public dialog: MatDialog,
        private vehicleService: VehicleService,
        private handleErrorService: HandleErrorService,
    ) {}

    ngOnInit(): void {}

    public getDriverName() {
        return this.vehicle.drivingRecords.length > 0
            ? `${this.vehicle.drivingRecords[0].driver.firstName} ${this.vehicle.drivingRecords[0].driver.lastName}`
            : 'Conductor no asignado';
    }

    public openDialog(): void {
        this.dialog
            .open(ModalNewvehicleComponent, {
                width: '650px',
                height: '540px',
                disableClose: true,
                data: { vehicle: this.vehicle, refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.refresh) this.refresh.emit(true);
            });
    }

    public openDialogDetailsFiles(type: string): void {
        this.dialog
            .open(ModalDetailsFilesComponent, {
                width: '750px',
                height: '450px',
                disableClose: true,
                data: { data: { type: type, data: this.vehicle } },
            })
            .afterClosed()
            .subscribe((result) => {
                this.refresh.emit(true);
            });
    }

    public async removeVehicle(id: any) {
        await Swal.fire({
            title: 'Está seguro?',
            text: 'Sí elimina el registro no lo podrá recuperar!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, deseo eliminar!',
        }).then((result) => {
            if (result.value) {
                this.blockUI.start('Loading...');
                this.vehicleService.deleteVehicle(id).subscribe(
                    () => {
                        Swal.fire('Eliminado!', 'El vehículo fue eliminado exitosamente.', 'success');
                        this.refresh.emit(true);
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            }
            this.blockUI.stop();
        });
    }

    get ownershipValue() {
        return this.vehicle.ownerships.length > 0 ? this.vehicle.ownerships[0].ownership : OwnershipVehicle.LOYAL;
    }
}
