import { Component, OnInit, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { take } from 'rxjs/operators';

import { Driver } from '@apptypes/entities/driver';
import { DriverService, HandleErrorService } from '@services/index';
import { OwnershipDriver } from '@apptypes/enums/ownership.enum';
import { ModalFilesComponent } from '../../../../components/modal-files/modal-files.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-modal-newdriver',
    templateUrl: './modal-newdriver.component.html',
    styleUrls: ['./modal-newdriver.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class ModalNewdriverComponent implements OnInit {
    private closeRef: boolean;
    public driverDataCopy: Driver;
    public driverForm: FormGroup;
    public hidePwd: boolean;
    public loading = false;
    public ownershipType = OwnershipDriver;
    public submit: boolean = false;
    public healthList;
    public riskList;

    constructor(
        @Inject(MAT_DIALOG_DATA) public driverData: any,
        private driverService: DriverService,
        private formBuilder: FormBuilder,
        private handleErrorService: HandleErrorService,
        public dialogRef: MatDialogRef<ModalNewdriverComponent>,
        public dialog: MatDialog,
        private toastr: ToastrService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.driverDataCopy = new Driver(this.driverData.driver.id ? this.driverData.driver : null);
        this.hidePwd = true;
        this.patchValue();
        this.getHealth();
        this.getRisk();
    }

    get f() {
        return this.driverForm.controls;
    }

    public onClose(): void {
        this.dialogRef.close(this.driverData);
    }

    public onSubmit() {
        const data = {
            ownershipRelation: this.driverForm.get('ownershipRelation').value,
            driver: {
                firstName: this.driverForm.get('firstName').value,
                lastName: this.driverForm.get('lastName').value,
                idCard: this.driverForm.get('idCard').value,
                healthEntityId: this.driverForm.get('healthEntity').value,
                riskManagerId: this.driverForm.get('riskManager').value,
                phone: this.driverForm.get('phone').value,
                password: '',
                available: this.driverForm.get('available').value ? true : false,
                enabled: this.driverForm.get('enabled').value ? true : false,
            },
        };

        if (this.driverData.driver.id) {
            if (this.driverForm.invalid) {
                return;
            }

            this.submit = true;

            this.driverService.updateDriver(this.driverData.driver.id, data).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                        this.closeRef = res;
                        if (this.closeRef) this.onClose();
                        this.submit = false;
                    });
                    this.driverData.refresh = true;
                },
                (err) => {
                    this.handleErrorService.onFailure(err);
                    this.submit = false;
                },
            );
        } else {
            if (this.driverForm.invalid) {
                return;
            }

            this.submit = true;
            this.driverService.createDriver(data).subscribe((res) => {
                const id = res.data;

                this.handleErrorService.controlError(res);
                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe(
                    (res) => {
                        this.closeRef = res;
                        this.submit = false;

                        this.openDialogFiles('driver', id);
                    },
                    (err) => {
                        this.handleErrorService.onFailure(err);
                        this.submit = false;
                    },
                );
                this.driverData.refresh = true;
            });
        }
    }

    public openDialogFiles(type: string, data?: any): void {
        this.dialog
            .open(ModalFilesComponent, {
                width: '650px',
                height: '460px',
                disableClose: true,
                data: { type: type, data: data === undefined ? this.driverDataCopy : data },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.driverData.refresh = true;
                    this.onClose();
                    this.toastr.success('Archivos subidos exitosamente', 'Operación exitosa!', {
                        timeOut: 2500,
                    });
                } else {
                    this.onClose();
                }
            });
    }

    public getHealth() {
        this.driverService.getHealth().subscribe((res) => {
            this.healthList = res.data;
        });
    }

    public getRisk() {
        this.driverService.getRisk().subscribe((res) => {
            this.riskList = res.data;
        });
    }

    private createForm() {
        this.driverForm = this.formBuilder.group({
            ownershipRelation: ['', [Validators.required]],
            idCard: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(11),
                    Validators.minLength(4),
                    Validators.pattern('^[0-9]{3,10}$'),
                ],
            ],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            healthEntity: [null],
            riskManager: [null],
            phone: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.minLength(7),
                    Validators.pattern('^[0-9]+$'),
                ],
            ],
            available: [false],
            enabled: [false],
        });
    }

    private patchValue() {
        this.driverForm.patchValue({
            ownershipRelation: this.driverDataCopy.companyOwnerships
                ? this.driverDataCopy.companyOwnerships[0].ownership
                : '',
            firstName: this.driverDataCopy.firstName,
            lastName: this.driverDataCopy.lastName,
            idCard: this.driverDataCopy.idCard,
            phone: this.driverDataCopy.phone,
            available: this.driverDataCopy.available,
            enabled: this.driverDataCopy.enabled,
        });
    }
}
