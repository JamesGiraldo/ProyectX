import * as moment from 'moment';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { map, startWith, take } from 'rxjs/operators';

import { Country, VehicleType } from '@apptypes/enums';
import {
    GlobalService,
    HandleErrorService,
    OfferService,
    PublicationService,
    VehicleService,
    YardService,
} from '@services/index';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Report } from '@entities/report';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, ThemePalette } from '@angular/material/core';
import { DATE_FORMAT } from '../../utils/moment-format.util';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { FareType } from '@apptypes/enums/fare-type.enum';
import { ToastrService } from 'ngx-toastr';

interface Props {
    offerId: number;
    isContrated: boolean;
    idPublication: number;
}

@Component({
    selector: 'app-modal-new-report',
    templateUrl: './modal-new-report.component.html',
    styleUrls: ['./modal-new-report.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
    ],
})
export class ModalNewReportComponent implements OnInit {
    //isGenerator: boolean = null;
    vehicleType = VehicleType;
    reportForm: FormGroup;
    previousCount: number = 0;
    minDate: string;
    reports: Report[];
    submit = false;
    closeRef: boolean;
    plates: string[] = [];
    filteredOptions: Observable<string[]>[] = [];
    minDateCalendar: Date = new Date();
    fareEditable: boolean = true;

    /* DatePicker */
    @ViewChild('picker') picker: any;
    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';

    public isContracted: boolean;

    public country = Country;
    public user;
    public yards;
    public yardSelect: string;
    public isVisible: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Props,
        private formBuilder: FormBuilder,
        private readonly handleErrorService: HandleErrorService,
        private readonly offerService: OfferService,
        private readonly publicationService: PublicationService,
        private readonly vehicleService: VehicleService,
        private readonly yardService: YardService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<ModalNewReportComponent>,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.minDate = this.getTodayFormatted();

        this.getVehiclePlates();
        this.getOfferMetadata();
        this.getPublication(this.data.idPublication);
    }

    createForm() {
        this.reportForm = this.formBuilder.group({
            vehicleCount: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
            fareValue: [0, [Validators.required, Validators.min(1)]],
            reports: this.formBuilder.array([]),
        });
    }

    get f() {
        return this.reportForm.controls;
    }

    get getReports() {
        return this.reportForm.get('reports') as FormArray;
    }

    filterPlate(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.plates.filter((plate) => plate.toLowerCase().includes(filterValue));
    }

    managePlateLookup(index: number) {
        var reports = this.reportForm.get('reports') as FormArray;
        this.filteredOptions[index] = reports
            .at(index)
            .get('vehiclePlate')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterPlate(value)),
            );
    }

    addReport() {
        const control = this.reportForm.controls['reports'] as FormArray;
        control.push(
            this.formBuilder.group({
                vehiclePlate: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]],
                driverName: ['', [Validators.required, Validators.pattern('^[a-záéíóúñA-ZÑ ]+$')]],
                driverIdCard: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(11)]],
                driverPhone: ['',  [Validators.pattern('^[0-9]{7,10}$'), Validators.minLength(7), Validators.maxLength(15)]],
                vehicleCapacity: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
                loadDate: ['', [Validators.required]],
                trailerNumber: '',
                observation: '',
                shiftSchedule: [null],
            }),
        );
        this.managePlateLookup(control.length - 1);
    }

    removeReport(index: number) {
        const control = this.reportForm.controls['reports'] as FormArray;
        control.removeAt(index);
        this.filteredOptions.splice(index, 1);
    }

    removeLastReport() {
        const control = this.reportForm.controls['reports'] as FormArray;
        control.removeAt(control.length - 1);
        this.filteredOptions.splice(control.length - 1, 1);
    }

    fillArray() {
        this.reports = [];
        this.getReports.value.forEach((report) => {
            this.reports.push({
                driverIdCard: report.driverIdCard === '' ? null : report.driverIdCard,
                driverName: report.driverName === '' ? null : report.driverName,
                driverPhone: report.driverPhone === '' ? null : report.driverPhone,
                loadDate: report.loadDate === '' ? null : report.loadDate,
                observation: report.observation === '' ? null : report.observation,
                trailerNumber: report.trailerNumber === '' ? null : report.trailerNumber,
                vehicleCapacity: report.vehicleCapacity === '' ? null : report.vehicleCapacity,
                vehiclePlate: report.vehiclePlate === '' ? null : report.vehiclePlate,
                vehicleType: report.vehicleType === '' ? null : report.vehicleType,
                fareValue: this.f.fareValue.value === '' ? '' : this.f.fareValue.value,
                shiftSchedule: report.shiftSchedule === '' ? '' : report.shiftSchedule,
            } as Report);
        });
    }

    updateReportsLength() {
        const delta = this.f.vehicleCount.value - this.previousCount;

        if (delta > 0) {
            for (let idx = 0; idx < delta; idx++) {
                this.addReport();
            }
        } else if (delta < 0) {
            for (let removal = delta * -1; removal > 0; removal--) {
                this.removeLastReport();
            }
        }

        this.previousCount = this.f.vehicleCount.value;
    }

    getTodayFormatted(): string {
        const instant = moment(new Date());
        return instant.format('YYYY-MM-DD HH:mm');
    }

    /**
     * EVENT HANLDERS
     */
    public onClose(fromSubmit): void {
        this.dialogRef.close(fromSubmit);
    }

    private getPublication(idPublication: number) {
        this.publicationService.getById(idPublication).subscribe((res) => {
            let originsOutMap = res.data?.origins;
            if (originsOutMap !== undefined) {
                this.yardSelect = originsOutMap.map((origin) =>
                    origin?.loadPlace !== null || origin?.loadPlace !== undefined ? origin.loadPlace : '',
                );
            } else {
                this.toastr.warning(
                    'La comprobación de horarios no fue cargada. Por favor vuelva abrir el modal',
                    'Importante!',
                    {
                        timeOut: 5000,
                    },
                );
            }
        });
    }

    public formatTime(time: any) {
        let formatted = moment(time, 'HH:mm:ss').format('LT');

        return formatted;
    }

    public getWeekday(index) {
        const loadDates = this.reportForm.get('reports') as FormArray;
        let loadDate = loadDates.at(index).get('loadDate').value;

        let day = new Date(loadDate).toLocaleDateString('en-us', {
            weekday: 'long',
        });

        this.getSearch(day);
    }

    private getSearch(day) {
        this.yardService.search(this.yardSelect[0]).subscribe((res) => {
            if (res.code > 1000) {
                this.isVisible = true;
                this.yards = res.data?.schedules.filter((yard) => yard.day === 'WEEKDAY.' + day.toUpperCase());
            } else {
                this.isVisible = false;
                this.getReports.value.forEach((_, index) => {
                    this.getShiftValidator(index);
                });
            }
        });
    }

    public alert() {
        this.toastr.info(
            'Está sujeto a disponibilidad más próxima de la planta y será confirmado en la asignación del viaje.',
            'Información de enturnamiento',
            {
                timeOut: 5000,
            },
        );
    }

    public onVehicleCountChanged() {
        this.updateReportsLength();
    }

    public onRemoveReportClicked(index: number) {
        this.removeReport(index);
    }

    public onAddClicked($event: { offerId: number }) {
        this.onSubmit();
    }

    public onVehiclePlateChanged(value: string, index: number) {
        if (value.trim().length == 6) {
            this.getCurrentDriverOfVehicle(value, index);
            this.getVehicleCapacity(value, index);
        }
    }

    /**
     * API CALLS
     */
    getOfferMetadata() {
        this.offerService.getMetadata(this.data.offerId).subscribe((res) => {
            if (!res.data.isFareTable) this.fareEditable = true;
            else this.fareEditable = res.data.fareValue === 0;

            if (res.data.fareType === FareType.CONTRACTED) {
                this.isContracted = true;

                this.reportForm.get('fareValue').setValidators(null);
                this.reportForm.get('fareValue').updateValueAndValidity();
            } else {
                this.isContracted = false;

                this.reportForm.get('fareValue').setValidators([Validators.required, Validators.min(1)]);
                this.reportForm.get('fareValue').updateValueAndValidity();
            }

            this.f.vehicleCount.setValue(res.data.vehicleLimit);
            this.f.fareValue.setValue(res.data.fareValue);
            this.updateReportsLength();
        });
    }

    getVehiclePlates() {
        this.vehicleService.getCompanyVehiclePlates().subscribe((res) => {
            this.plates = res.data.records;
        });
    }

    getCurrentDriverOfVehicle(plate: string, controlIndex: number) {
        this.vehicleService.getVehicleCurrentDriver(plate).subscribe((res) => {
            const formArray = this.reportForm.controls['reports'] as FormArray;
            formArray.at(controlIndex).get('driverIdCard').setValue(res.data.driverIdCard);
            formArray.at(controlIndex).get('driverName').setValue(res.data.driverName);
            formArray.at(controlIndex).get('driverPhone').setValue(res.data.driverPhone);
        });
    }

    getVehicleCapacity(plate: string, controlIndex: number) {
        this.vehicleService.getVehicleCapacity(plate).subscribe((res) => {
            const formArray = this.reportForm.controls['reports'] as FormArray;
            if (res.data > 0) formArray.at(controlIndex).get('vehicleCapacity').setValue(res.data);
            else formArray.at(controlIndex).get('vehicleCapacity').setValue('');
        });
    }

    getShiftValidator(index: number) {
        const formArray = this.reportForm.controls['reports'] as FormArray;
        formArray.at(index).get('shiftSchedule').setValidators(null);
        formArray.at(index).get('shiftSchedule').updateValueAndValidity();
    }

    public onSubmit() {
        if (this.reportForm.invalid) {
            return;
        }

        this.fillArray();

        this.submit = true;

        const data = this.reports.length > 0 ? this.reports : [];
        this.offerService.addReports(this.data.offerId, data).subscribe(
            (res) => {
                if (res.code === 56) {
                    const errorP = `<p style="text-align: left;">${res.error}</p>`;
                    const descP = `<p style="text-align: left;">Reportes bloqueados:</p>`;
                    const recordsP = res.data.records
                        .map((r) => `<p style="text-align: left;">&nbsp;&nbsp;-&nbsp;${r}</p>`)
                        .join('');
                    this.onFailure(`${errorP} ${descP}  ${recordsP}`);
                    this.submit = false;
                } else {
                    if (res.code >= 1000) {
                        if (res.code === 1155) {
                            const errorP = `<p style="text-align: left;">${res.message}</p>`;
                            const descP = `<p style="text-align: left;">Reportes bloqueados:</p>`;
                            const recordsP = res.data.records
                                .map((r) => `<p style="text-align: left;">&nbsp;&nbsp;-&nbsp;${r}</p>`)
                                .join('');
                            this.onWarning(`${errorP} ${descP}  ${recordsP}`);
                            this.submit = false;
                        } else {
                            this.handleErrorService.controlError(res);
                            this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                                this.closeRef = res;
                                if (this.closeRef) this.onClose(true);
                                this.submit = false;
                            });
                        }
                    } else {
                        this.handleErrorService.onFailure(res);
                        this.submit = false;
                    }
                }
            },
            (err) => {
                this.handleErrorService.onFailure(err);
                this.submit = false;
            },
        );
    }

    private onFailure(msj) {
        Swal.fire({
            icon: 'error',
            title: 'Error en la Solicitud',
            html: msj,
        });
    }

    private onWarning(msj) {
        Swal.fire({
            icon: 'warning',
            title: 'Se Publicaron Algunos Reportes',
            html: msj,
        });
    }
}
