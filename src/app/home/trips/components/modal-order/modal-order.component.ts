import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CompanyType } from '@apptypes/enums';
import { GlobalService, HandleErrorService, TripService } from '@services/index';
import { TripReport } from '@apptypes/enums/trip-report.enum';
import { ThemePalette } from '@angular/material/core';
import { ModalMapComponent } from 'src/app/home/companies/components/modal-map/modal-map.component';
import { take } from 'rxjs/operators';
@Component({
    selector: 'app-modal-order',
    templateUrl: './modal-order.component.html',
    styleUrls: ['./modal-order.component.scss'],
})
export class ModalOrderComponent implements OnInit {
    public orderReportForm: FormGroup;
    public reportStatus = TripReport;
    public isGenerator: boolean = null;
    public submit: boolean = false;
    private closeRef: boolean;
    public origins = [];
    public destinities = [];
    public coordinates = [null];

    reportFile: Array<File>;
    reportFileHasLoaded: boolean;
    reportFileName: string;

    /* Hidden fields */
    kilo: boolean = false;
    dateHour: boolean = false;
    list: boolean = false;
    origin: boolean = false;
    destiny: boolean = false;

    /* DatePicker */
    @ViewChild('picker') picker: any;
    @ViewChild('picker2') picker2: any;
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

    public lat: string = '';
    public lng: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public tripData: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ModalOrderComponent>,
        private readonly globalService: GlobalService,
        private tripService: TripService,
        private handleErrorService: HandleErrorService,
        public dialog: MatDialog,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;

        this.allDestiny(this.tripData.data.id);
        this.allOrigin(this.tripData.data.id);

        this.tripData.data['tripState'] === TripReport.LOADED ? (this.origin = true) : (this.origin = false);
        this.tripData.data['tripState'] === TripReport.UNLOADING ? (this.destiny = true) : (this.destiny = false);
    }

    get f() {
        return this.orderReportForm.controls;
    }

    public onClose() {
        this.dialogRef.close(true);
    }

    public onFileSelected($event) {
        if ($event.target.files.length > 0) {
            this.submit = false;
            this.reportFileName = $event.target.files[0].name;
            this.reportFileHasLoaded = true;

            const [file] = $event.target.files;
            this.orderReportForm.get('reportFile').setValue(file, { emitModelToViewChange: false });
        } else {
            this.reportFileHasLoaded = false;
        }
    }

    public onSubmit() {
        if (this.tripData.cancel) {
            this.addValidationComments();
            this.clearValidationsStatusReport();
            this.clearValidationsReportFile();
            this.clearValidationsOrigin();
            this.clearValidationsDestiny();
            this.clearValidationsLocation();
            this.clearValidationsEstimated();
        } else {
            if (this.orderReportForm.get('statusReport').value === TripReport.CANCELLED) {
                this.addValidationComments();
            } else {
                this.clearValidationsComments();
            }

            if (this.orderReportForm.get('statusReport').value !== TripReport.WAITING_LOAD)
                this.clearValidationsOrigin();
            if (this.orderReportForm.get('statusReport').value !== TripReport.AT_DESTINY)
                this.clearValidationsDestiny();
        }

        if (this.orderReportForm.invalid) {
            return;
        }

        let myTransporter = this.isGenerator ? true : this.tripData.data.myTransporter;

        this.submit = true;
        if (this.tripData.cancel) {
            var formDataCancel: FormData = new FormData();
            const stateReport = this.orderReportForm.get('statusReport').setValue(TripReport.UNLOADING);
            const customFields = [];
            formDataCancel.append('file', this.orderReportForm.get('reportFile').value);
            formDataCancel.append(
                'statusReport',
                JSON.stringify({
                    state: stateReport,
                    loadedTonnage: 0,
                    estimatedTime: 0,
                    latitude: 0,
                    longitude: 0,
                    location: 0,
                    observation: this.orderReportForm.get('comments').value,
                }),
            );
            formDataCancel.append('originId', null);
            formDataCancel.append('destinyId', null);
            formDataCancel.append('customFields', JSON.stringify(customFields));
            formDataCancel.append('myTransporter', myTransporter);
        } else {
            var formData: FormData = new FormData();
            const stateReport = this.orderReportForm.get('statusReport').value;
            const customFields = [];
            formData.append('file', this.orderReportForm.get('reportFile').value);
            formData.append(
                'statusReport',
                JSON.stringify({
                    state: stateReport,
                    loadedTonnage: +this.orderReportForm.get('loadedTonnage').value,
                    estimatedTime: this.orderReportForm.get('estimated').value,
                    latitude: 0,
                    longitude: 0,
                    location: this.orderReportForm.get('location').value,
                    observation: this.orderReportForm.get('comments').value,
                }),
            );
            formData.append('originId', this.orderReportForm.get('originId').value);
            formData.append('destinyId', this.orderReportForm.get('destinyId').value);
            formData.append('customFields', JSON.stringify(customFields));
            formData.append('myTransporter', myTransporter);
        }

        const data = this.tripData.cancel ? formDataCancel : formData;
        this.tripService.addStatus(this.tripData.data.id, data).subscribe(
            (res) => {
                this.handleErrorService.controlError(res);
                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                    this.closeRef = res;
                    if (this.closeRef) this.onClose();
                    this.submit = false;
                });
            },
            (err) => {
                this.handleErrorService.onFailure(err);
                this.submit = false;
            },
        );
    }

    public openDialogMap() {
        this.dialog
            .open(ModalMapComponent, {
                width: '900px',
                height: '600px',
                disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {
                this.lat = result?.lat;
                this.lng = result?.lng;
                this.orderReportForm.get('location').setValue(result.lat + ',' + result.lng);
            });
    }

    public onStateSelected(event) {
        switch (this.tripData.data['tripState']) {
            case TripReport.LOADED:
                this.addValidationOrigin();
                this.origin = true;
                if (event.value === TripReport.LOADED) {
                    this.clearValidationsReportFile();
                    this.clearValidationsDestiny();
                    this.kilo = true;
                    this.dateHour = false;
                    this.list = false;
                    this.destiny = false;
                } else if (event.value === TripReport.AT_DESTINY) {
                    this.addValidationDestiny();
                    this.destiny = true;
                } else if (event.value === TripReport.COMPLETED) {
                    this.addValidationReportFile();
                    this.clearValidationsDestiny();
                    this.dateHour = true;
                    this.list = true;
                    this.kilo = false;
                } else {
                    this.clearValidationsReportFile();
                    this.clearValidationsDestiny();
                    this.dateHour = false;
                    this.list = false;
                    this.kilo = false;
                    this.destiny = false;
                }
                break;
            case TripReport.UNLOADING:
                this.addValidationDestiny();
                this.destiny = true;
                if (event.value === TripReport.LOADED) {
                    this.clearValidationsReportFile();
                    this.clearValidationsOrigin();
                    this.kilo = true;
                    this.dateHour = false;
                    this.list = false;
                    this.origin = false;
                } else if (event.value === TripReport.WAITING_LOAD) {
                    this.addValidationOrigin();
                    this.origin = true;
                } else if (event.value === TripReport.COMPLETED) {
                    this.addValidationReportFile();
                    this.clearValidationsOrigin();
                    this.dateHour = true;
                    this.list = true;
                    this.kilo = false;
                } else {
                    this.clearValidationsReportFile();
                    this.clearValidationsOrigin();
                    this.dateHour = false;
                    this.list = false;
                    this.kilo = false;
                    this.origin = false;
                }
                break;
            default:
                if (event.value === TripReport.LOADED) {
                    this.clearValidationsReportFile();
                    this.clearValidationsOrigin();
                    this.clearValidationsDestiny();
                    this.kilo = true;
                    this.dateHour = false;
                    this.list = false;
                    this.destiny = false;
                    this.origin = false;
                } else if (event.value === TripReport.WAITING_LOAD) {
                    this.addValidationOrigin();
                    this.clearValidationsDestiny();
                    this.destiny = false;
                    this.origin = true;
                } else if (event.value === TripReport.AT_DESTINY) {
                    this.addValidationDestiny();
                    this.clearValidationsOrigin();
                    this.origin = false;
                    this.destiny = true;
                } else if (event.value === TripReport.COMPLETED) {
                    this.addValidationReportFile();
                    this.dateHour = true;
                    this.list = true;
                    this.kilo = false;
                    this.origin = false;
                    this.destiny = false;
                } else {
                    this.clearValidationsReportFile();
                    this.clearValidationsOrigin();
                    this.clearValidationsDestiny();
                    this.dateHour = false;
                    this.list = false;
                    this.kilo = false;
                    this.origin = false;
                    this.destiny = false;
                }
        }
    }

    /* Validation form */
    private addValidationReportFile() {
        this.orderReportForm.get('reportFile').setValidators([Validators.required]);
        this.orderReportForm.get('reportFile').updateValueAndValidity();
    }
    private addValidationOrigin() {
        this.orderReportForm.get('originId').setValidators([Validators.required]);
        this.orderReportForm.get('originId').updateValueAndValidity();
    }
    private addValidationDestiny() {
        this.orderReportForm.get('destinyId').setValidators([Validators.required]);
        this.orderReportForm.get('destinyId').updateValueAndValidity();
    }
    private addValidationComments() {
        this.orderReportForm.get('comments').setValidators([Validators.required]);
        this.orderReportForm.get('comments').updateValueAndValidity();
    }

    private clearValidationsComments() {
        this.orderReportForm.get('comments').setValidators(null);
        this.orderReportForm.get('comments').updateValueAndValidity();
    }
    private clearValidationsStatusReport() {
        this.orderReportForm.get('statusReport').setValidators(null);
        this.orderReportForm.get('statusReport').updateValueAndValidity();
    }
    private clearValidationsReportFile() {
        this.orderReportForm.get('reportFile').setValidators(null);
        this.orderReportForm.get('reportFile').updateValueAndValidity();
    }
    private clearValidationsOrigin() {
        this.orderReportForm.get('originId').setValidators(null);
        this.orderReportForm.get('originId').updateValueAndValidity();
    }
    private clearValidationsDestiny() {
        this.orderReportForm.get('destinyId').setValidators(null);
        this.orderReportForm.get('destinyId').updateValueAndValidity();
    }
    private clearValidationsLocation() {
        this.orderReportForm.get('location').setValidators(null);
        this.orderReportForm.get('location').updateValueAndValidity();
    }
    private clearValidationsEstimated() {
        this.orderReportForm.get('estimated').setValidators(null);
        this.orderReportForm.get('estimated').updateValueAndValidity();
    }
    /* End validation */

    private createForm() {
        this.orderReportForm = this.formBuilder.group({
            statusReport: ['', [Validators.required]],
            originId: ['', [Validators.required]],
            destinyId: ['', [Validators.required]],
            reportFile: [''],
            estimated: ['', [Validators.required, Validators.maxLength(14)]],
            loadedTonnage: [''],
            location: ['', [Validators.required]],
            comments: [''],
            latitude: [''],
            longitude: [''],
            dateLoad: [''],
        });
    }

    private allDestiny(id: number) {
        this.tripService.getAllDestiny(id).subscribe((res) => {
            this.destinities = res.data?.records;
        });
    }

    private allOrigin(id: number) {
        this.tripService.getAllOrigin(id).subscribe((res) => {
            this.origins = res.data?.records;
        });
    }
}
