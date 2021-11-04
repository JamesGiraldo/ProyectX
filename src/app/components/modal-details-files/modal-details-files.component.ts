import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DriverService, GlobalService, HandleErrorService, TripService, VehicleService } from '@services/index';
import { ModalPreviewFilesComponent } from '../modal-preview-files/modal-preview-files.component';
import { DriverFile, VehicleFile } from '@apptypes/enums/file-type.enum';
import { CompanyType } from '@apptypes/enums';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-modal-details-files',
    templateUrl: './modal-details-files.component.html',
    styleUrls: ['./modal-details-files.component.scss'],
})
export class ModalDetailsFilesComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public driverFiles: string[] = [];
    public vehicleFiles: string[] = [];
    public driverFileType = DriverFile;
    public vehicleFileType = VehicleFile;
    public submit: boolean = false;
    public currentElements: number = 12;
    public page: number = 1;
    fileForm: FormGroup;
    isGenerator: boolean;
    public tripDriverDisabled;
    public tripVehicleDisabled;

    constructor(
        @Inject(MAT_DIALOG_DATA) public fileDetailsData: any,
        private formBuilder: FormBuilder,
        private handleErrorService: HandleErrorService,
        private readonly driverService: DriverService,
        private readonly globalService: GlobalService,
        private readonly tripService: TripService,
        private readonly vehicleService: VehicleService,
        private router: Router,
        private toastr: ToastrService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ModalDetailsFilesComponent>,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;

        this.getTrip(this.fileDetailsData.data.trip);

        if (this.router.url === '/trips') {
            this.fileDetailsData.data.type === 'driver'
                ? this.getDriverInfo(this.fileDetailsData.data?.data, this.page, this.currentElements)
                : this.getVehicleInfo(this.fileDetailsData.data?.data, this.page, this.currentElements);
        } else {
            if (this.fileDetailsData.data.data?.id !== null) {
                this.fileDetailsData.data.type === 'driver'
                    ? this.getDriverInfo(this.fileDetailsData.data?.data.idCard, this.page, this.currentElements)
                    : this.getVehicleInfo(this.fileDetailsData.data?.data.plate, this.page, this.currentElements);
            } else {
                this.blockUI.stop();
            }
        }
    }

    public onClose(): void {
        this.dialogRef.close();
    }

    changeVerify(type: string) {
        if (type === 'driver') {
            this.tripService.verifyFiles(this.fileDetailsData.data.trip, { driverVerf: true }).subscribe(
                (res) => {
                    Swal.fire('¡Verificación realizada!', res.message, 'success');
                },
                (err) => this.handleErrorService.onFailure(err),
            );
        } else {
            this.tripService.verifyFiles(this.fileDetailsData.data.trip, { vehicleVerf: true }).subscribe(
                (res) => {
                    Swal.fire('¡Verificación realizada!', res.message, 'success');
                },
                (err) => this.handleErrorService.onFailure(err),
            );
        }
    }

    public deleteFile(file: number) {
        this.submit = true;

        if (this.fileDetailsData.data.type === 'driver') {
            setTimeout(() => {
                this.driverService.deleteFile(file).subscribe(
                    (res) => {
                        if (res.code >= 1000) {
                            this.toastr.success('Archivo eliminado exitosamente', 'Operación exitosa!', {
                                timeOut: 2500,
                            });
                            this.submit = false;
                            this.getDriverInfo(this.fileDetailsData.data?.data.idCard, this.page, this.currentElements);
                        } else {
                            this.handleErrorService.onFailure(res);
                        }
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            }, 2500);
        } else {
            setTimeout(() => {
                this.vehicleService.deleteFile(file).subscribe(
                    (res) => {
                        if (res.code >= 1000) {
                            this.toastr.success('Archivo eliminado exitosamente', 'Operación exitosa!', {
                                timeOut: 2500,
                            });
                            this.submit = false;
                            this.getVehicleInfo(this.fileDetailsData.data?.data.plate, this.page, this.currentElements);
                        } else {
                            this.handleErrorService.onFailure(res);
                        }
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            }, 2500);
        }
    }

    public preview(file: any) {
        this.dialog
            .open(ModalPreviewFilesComponent, {
                width: '750px',
                height: '770px',
                disableClose: false,
                data: file.url,
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    private getDriverInfo(id_card: string, page: number, currentElements: number) {
        this.tripService.driverInfo(id_card, page, currentElements).subscribe(
            (res) => {
                this.driverFiles = res.data?.files.length > 0 ? [...res.data?.files] : [];
                this.blockUI.stop();
            },
            () => this.blockUI.stop(),
        );
    }

    private getVehicleInfo(plate: string, page: number, currentElements: number) {
        this.tripService.vehicleInfo(plate, page, currentElements).subscribe(
            (res) => {
                this.vehicleFiles = res.data?.files.length > 0 ? [...res.data?.files] : [];
                this.blockUI.stop();
            },
            () => this.blockUI.stop(),
        );
    }

    private getTrip(id) {
        let tripId = { id: id };

        this.tripService.getById(tripId).subscribe((res) => {
            this.tripDriverDisabled = res.data.driverVerified;
            this.tripVehicleDisabled = res.data.vehicleVerified;
            this.patchValue(res.data);
        });
    }

    private createForm() {
        this.fileForm = this.formBuilder.group({
            verifyCheck: [false],
        });
    }

    private patchValue(data) {
        this.fileForm.patchValue({
            verifyCheck: this.fileDetailsData.data.type === 'driver' ? data.driverVerified : data.vehicleVerified,
        });
    }
}
