import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { CustomField } from '@apptypes/entities';
import { Datatype } from '@apptypes/enums';
import { ModalQrComponent } from './modal-qr/modal-qr.component';
import { HandleErrorService, YardService } from '@services/index';
import { ThemePalette } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { ModalInspectionComponent } from './modal-inspection/modal-inspection.component';
import { ModalResponsesComponent } from './modal-responses/modal-responses.component';

@Component({
    selector: 'app-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true, displayDefaultIndicatorType: false },
        },
    ],
})
export class OperationsComponent implements OnInit {
    @ViewChild('stepper', { static: false }) stepper: MatStepper;
    @BlockUI() blockUI: NgBlockUI;
    public continue: boolean = true;
    public currentStageId;
    public currentStageName;
    public customFieldArray = [];
    public customFields: CustomField[];
    public datatype = Datatype;
    public filterYard = '';
    public idYard: number;
    public isDate: boolean;
    public isSearch: boolean = true;
    public notSearch: boolean = true;
    public operations;
    public paramSearch;
    public selectedIndex: number;
    public submit: boolean = false;
    public yardForm: FormGroup;
    public yards: string[] = [];
    public tripId: number;
    public tripIdInspection: number;

    /* DatePicker */
    @ViewChild('picker') picker: any;
    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public maxDate: moment.Moment;
    public minDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';

    public flagCode: boolean;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private readonly yardService: YardService,
        private handleErrorService: HandleErrorService,
        private toastr: ToastrService,
    ) {
        this.createForm();
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.getYards();
    }

    getTextOfSubmitByStage() {
        if (!this.operations) return '';
        if (!this.operations.currentStage) return '';
        if (this.operations.stages.length === 0) return '';

        if (this.operations.currentStage.order === 0) return 'Iniciar control';
        if (this.operations.currentStage.order === this.operations.stages.slice(-1).order) return 'Finalizar control';
        return `Registrar ${this.operations.currentStage.name}`;
    }

    get getCustomFields() {
        return this.yardForm.get('customFields') as FormArray;
    }

    public changeYard($event) {
        this.blockUI.start('Loading...');
        this.continue = true;
        if ($event.value > 0) this.isSearch = false;

        this.idYard = $event.value;
        this.filterYard = '';

        this.getOperations(this.idYard, '-');
    }

    public getFormControlName(control: AbstractControl) {
        const keys = Object.keys((control as FormGroup).controls);
        return keys[0];
    }

    public search($event) {
        if ($event.toLowerCase() !== '' && $event.length >= 3) {
            this.blockUI.start('Loading...');

            this.paramSearch = $event.toLowerCase();
            this.getOperations(this.idYard, this.paramSearch);
        } else {
            this.notSearch = true;
        }
    }

    public onSubmit() {
        const fieldControls = this.yardForm.get('customFields') as FormArray;
        this.customFieldArray = [];
        fieldControls.value.forEach((cf, i) => {
            this.customFieldArray.push({
                name: this.customFields[i].name,
                value: cf[this.customFields[i].name],
            });
        });

        const data = {
            report: {
                stageId: this.operations.currentStage?.id,
                customFields: this.customFieldArray,
                tripId: this.tripIdInspection,
            },
        };

        this.yardService.reportControl(this.idYard, this.filterYard, data).subscribe(
            () => {
                this.blockUI.start('Loading...');
                Swal.fire({
                    title: 'Etapa registrada satisfactoriamente',
                    icon: 'success',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.blockUI.start('Actualizando estado de control...');
                        this.getOperations(this.idYard, this.paramSearch);
                    }
                });

                if (this.operations.currentStage.order > 0) this.stepper.next();
                this.blockUI.stop();
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }

    public openModalInspection() {
        this.dialog
            .open(ModalInspectionComponent, {
                width: '1100px',
                height: '670px',
                disableClose: true,
                data: this.tripIdInspection,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getResponses(+this.tripIdInspection);
                }
            });
    }

    public openModalInspectionResponses() {
        this.dialog
            .open(ModalResponsesComponent, {
                width: '1100px',
                height: '670px',
                disableClose: true,
                data: this.tripIdInspection,
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    public showQR() {
        this.dialog
            .open(ModalQrComponent, {
                width: '350px',
                height: '350px',
                disableClose: false,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result !== undefined) {
                    this.tripId = result.tripId;
                    if (result.cedula !== null) {
                        this.filterYard = result.cedula;
                        this.search(result.cedula);
                    } else if (result.cedula !== null) {
                        this.filterYard = result.placa;
                        this.search(result.placa);
                    } else {
                        this.filterYard = '';
                    }
                }
            });
    }

    private clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    };

    private getYards() {
        this.yardService.getAll().subscribe((res) => {
            this.yards = [...res.data];
        });
        this.blockUI.stop();
    }

    private getResponses(tripId) {
        this.yardService.getAllFormResponses(tripId).subscribe((res) => {
            if (res.code > 1000) {
                this.flagCode = true;
            } else {
                this.flagCode = false;
            }
        });
    }

    private getOperations(yard: number, search: any) {
        this.yardService.getCurrentStage(yard, search, this.tripId ? +this.tripId : null).subscribe((res) => {
            this.tripIdInspection = res.data?.tripId;
            if (this.tripIdInspection) this.getResponses(+this.tripIdInspection);

            if (res.data === null) {
                this.notSearch = true;
            } else if (res.code === 26) {
                this.notSearch = true;
                this.toastr.warning('Viaje no encontrado!', '', { timeOut: 2500, positionClass: 'toast-bottom-right' });
            } else {
                if (res.data) {
                    if (this.stepper?.steps === undefined) this.selectedIndex = res.data.currentStage?.order - 1;
                }

                this.notSearch = false;
                this.operations = res.data;

                if (res.data.vehicle.oldVehicle) {
                    this.oldVehicleAlert(res.data);
                }

                /* Clear Form Array */
                const control = this.yardForm.controls['customFields'] as FormArray;
                this.clearFormArray(control);

                for (const customField of res.data.customFields) {
                    const newFormGroup = new FormGroup({ [customField.name]: new FormControl('') });
                    (this.yardForm.get('customFields') as FormArray).push(newFormGroup);
                }

                this.customFields = res.data.customFields;
            }
        });
        this.blockUI.stop();
    }

    private createForm() {
        this.yardForm = this.formBuilder.group({
            customFields: this.formBuilder.array([]),
        });
    }

    private safetyCourseAlert(data) {
        Swal.fire({
            icon: 'warning',
            title: 'Curso vencido',
            html: `El conductor <b>${data?.driver.fullname}</b> tiene el curso de seguridad vencido. Debe renovarlo para iniciar el control de patio.`,
        });
    }

    private oldVehicleAlert(data) {
        Swal.fire({
            icon: 'warning',
            title: 'Vehículo no válido',
            html: `El vehículo con placa <b style="text-transform: uppercase;">${data?.vehicle.plate}</b> ya cumplió los años de validez.`,
        });
    }
}
