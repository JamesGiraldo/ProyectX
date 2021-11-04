import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, take } from 'rxjs/operators';

import { DriverService, GlobalService, HandleErrorService, VehicleService } from '@services/index';
import { Vehicle } from '@apptypes/entities';
import { OwnershipVehicle } from '../../../../types/enums/ownership.enum';
import { ModalFilesComponent } from 'src/app/components/modal-files/modal-files.component';
import { Country } from '@apptypes/enums';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-modal-newvehicle',
    templateUrl: './modal-newvehicle.component.html',
    styleUrls: ['./modal-newvehicle.component.scss'],
})
export class ModalNewvehicleComponent implements OnInit {
    private closeRef: boolean;
    public drivers: any[] = [];
    public hidePwd: boolean;
    public submit: boolean = false;
    public vehicleDataCopy: Vehicle;
    public vehicleForm: FormGroup;
    public vehicleType;
    public ownership = OwnershipVehicle;
    public country = Country;
    public user;
    public filteredOptions: Observable<string[]>;
    public driverSelected: any[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public vehicleData: any,
        public dialogRef: MatDialogRef<ModalNewvehicleComponent>,
        private driverService: DriverService,
        private formBuilder: FormBuilder,
        private handleErrorService: HandleErrorService,
        private readonly globalService: GlobalService,
        private toastr: ToastrService,
        private vehicleService: VehicleService,
        public dialog: MatDialog,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.user = this.globalService.getDecodedToken().company.country?.id;

        if (this.user === this.country.PERU) {
            this.addValidationPlatePeru();
        } else {
            this.addValidationPlateColombia();
        }

        this.hidePwd = true;
        this.vehicleDataCopy = new Vehicle(this.vehicleData.vehicle.id ? this.vehicleData.vehicle : null);
        this.getDrivers();

        this.filteredOptions = this.vehicleForm.get('driverId').valueChanges.pipe(
            startWith(''),
            map((value: string) => this._filter(value)),
        );

        this.getVehicleType();
        this.patchValue();
    }

    public onClose(): void {
        this.dialogRef.close(this.vehicleData);
    }

    get f() {
        return this.vehicleForm.controls;
    }

    public onSubmit() {
        let yearLimit = moment(new Date()).add(1, 'years').format('yyyy');

        if (this.vehicleForm.get('vehicleAge').value <= yearLimit) {
            const data = {
                ownershipRelation: this.vehicleForm.get('ownershipRelation').value,
                vehicle: {
                    plate: this.vehicleForm.get('plate').value,
                    type: this.vehicleForm.get('type').value,
                    capacity: this.vehicleForm.get('capacity').value,
                    supplierSatellite: this.vehicleForm.get('supplierSatellite').value,
                    satelliteUser: this.vehicleForm.get('satelliteUser').value,
                    satellitePassword: this.vehicleForm.get('satellitePassword').value,
                    age: this.vehicleForm.get('vehicleAge').value,
                },
            };

            if (this.vehicleForm.invalid) {
                return;
            }

            if (this.vehicleData.vehicle.id !== null) {
                this.submit = true;
                this.vehicleService.updateVehicle(this.vehicleData.vehicle.id, data).subscribe(
                    (res) => {
                        if (this.vehicleForm.get('driverId').value && this.driverSelected.length > 0) {
                            this.assignDriver(this.vehicleData.vehicle.id, this.driverSelected[0].id);
                        }
                        if (res.code < 1000) this.handleRespose(res);
                        else this.handleRespose(res);

                        this.vehicleData.refresh = true;
                        this.submit = false;
                    },
                    (err) => {
                        this.handleErrorService.onFailure(err);
                        this.submit = false;
                    },
                );
            } else {
                this.submit = true;
                this.vehicleService.createVehicle(data).subscribe(
                    (res) => {
                        if (res.code > 1000) {
                            const id = res.data;

                            let vehicleId = res.data?.id;

                            if (this.vehicleForm.get('driverId').value && this.driverSelected.length > 0) {
                                this.vehicleService.assignDriver(vehicleId, this.driverSelected[0]?.id).subscribe(
                                    (drivingRecordRes) => {
                                        if (drivingRecordRes.code < 1000) this.handleRespose(drivingRecordRes);
                                        else this.handleRespose(res);
                                    },
                                    (err) => {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error de asignación',
                                            html: 'La asignación del conductor no se pudo realizó con éxito!',
                                        });
                                    },
                                );
                            }

                            this.handleErrorService.controlError(res);
                            this.handleErrorService.closeEnd$.pipe(take(1)).subscribe(
                                (res) => {
                                    this.closeRef = res;
                                    this.submit = false;

                                    this.openDialogFiles('vehicle', id);
                                },
                                (err) => {
                                    this.handleErrorService.onFailure(err);
                                    this.submit = false;
                                },
                            );
                        } else {
                            this.handleErrorService.onFailure(res);
                            this.submit = false;
                        }
                        this.vehicleData.refresh = true;
                    },
                    (err) => {
                        this.handleErrorService.onFailure(err);
                        this.submit = false;
                    },
                );
            }
        } else {
            this.toastr.error('El año excede el período actual', '', {
                timeOut: 2500,
            });
        }
    }

    public openDialogFiles(type: string, data?: any): void {
        this.dialog
            .open(ModalFilesComponent, {
                width: '650px',
                height: '510px',
                disableClose: true,
                data: { type: type, data: data === undefined ? this.vehicleDataCopy : data },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.vehicleData.refresh = true;
                    this.onClose();
                    this.toastr.success('Archivos subidos exitosamente', 'Operación exitosa!', {
                        timeOut: 2500,
                    });
                } else {
                    this.onClose();
                }
            });
    }

    public selectDriverChange() {
        if (this.driverSelected.length === 0) {
            this.toastr.warning(
                'El conductor no encontrado. Registre previamente un conductor en la sección Conductores.',
                '',
                {
                    timeOut: 2500,
                },
            );
        }
    }

    private handleRespose(res) {
        this.handleErrorService.controlError(res);
        this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((result) => {
            this.closeRef = result;

            this.submit = false;
        });
        this.vehicleData.refresh = true;
    }

    private assignDriver(vehicle: number, driver: number) {
        if (this.vehicleForm.get('driverId').value !== '') {
            this.vehicleService.assignDriver(vehicle, driver).subscribe(
                () => {},
                (err) => this.handleErrorService.onFailure(err),
            );
        }
    }

    private createForm() {
        this.vehicleForm = this.formBuilder.group({
            ownershipRelation: ['', [Validators.required]],
            driverId: [''],
            plate: [''],
            type: ['', [Validators.required]],
            capacity: ['', [Validators.required]],
            supplierSatellite: [''],
            satelliteUser: [''],
            satellitePassword: ['', [Validators.minLength(6)]],
            vehicleAge: [moment(new Date()).format('yyyy'), [Validators.required, Validators.pattern('^[0-9]+$')]],
        });
    }

    private _filter(value: string): string[] {
        this.driverSelected = [];
        const filterValue = value.toLowerCase();

        let data = this.drivers.filter((option) => option.name.toLowerCase().includes(filterValue));
        this.driverSelected = data;

        return data;
    }

    private getDrivers(): void {
        this.driverService.getAll(0, 0).subscribe((res) => {
            res.data.records.forEach((element) => {
                this.drivers.push({
                    name: element.firstName + ' ' + element.lastName,
                    available: element.available,
                    currentLatitude: element.currentLatitude,
                    currentLongitude: element.currentLongitude,
                    email: element.email,
                    enabled: element.enabled,
                    id: element.id,
                    idCard: element.idCard,
                    lang: element.lang,
                    phone: element.phone,
                    rating: element.rating,
                });
            });
        });
    }

    private patchValue() {
        this.vehicleForm.patchValue({
            ownershipRelation:
                this.vehicleDataCopy.ownerships?.length > 0 ? this.vehicleDataCopy.ownerships[0].ownership : '',
            driverId:
                this.vehicleDataCopy.drivingRecords?.length > 0
                    ? this.vehicleDataCopy.drivingRecords[0].driver.firstName +
                      ' ' +
                      this.vehicleDataCopy.drivingRecords[0].driver.lastName
                    : '',
            plate: this.vehicleDataCopy.plate,
            type: this.vehicleDataCopy.vehicleType ? this.vehicleDataCopy.vehicleType.id : '',
            capacity: this.vehicleDataCopy.capacity || 0,
            supplierSatellite: this.vehicleDataCopy.supplierSatellite,
            satelliteUser: this.vehicleDataCopy.satelliteUser,
            satellitePassword: this.vehicleDataCopy.satellitePassword,
            vehicleAge: this.vehicleDataCopy.age,
        });
    }

    private getVehicleType() {
        this.vehicleService.getAllTypes().subscribe((res) => {
            this.vehicleType = res.data?.records;
        });
    }

    get onwershipValue() {
        return this.vehicleDataCopy.ownerships.length > 0 ? this.vehicleDataCopy.ownerships[0].ownership : '';
    }

    /* Validation Plate */
    private addValidationPlatePeru() {
        this.clearValidationsPlate();

        this.vehicleForm.get('plate').setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]);
        this.vehicleForm.get('plate').updateValueAndValidity();
    }

    private addValidationPlateColombia() {
        this.clearValidationsPlate();

        this.vehicleForm
            .get('plate')
            .setValidators([
                Validators.required,
                Validators.pattern('^[a-zA-Z]{3}[0-9]{3}|[a-zA-Z]{3}[0-9]{3}[a-zA-Z]$'),
            ]);
        this.vehicleForm.get('plate').updateValueAndValidity();
    }

    private clearValidationsPlate() {
        this.vehicleForm.get('plate').setValidators(null);
        this.vehicleForm.get('plate').updateValueAndValidity();
    }
}
