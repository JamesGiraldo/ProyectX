import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, startWith, take } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';

import { ModalMapComponent } from '../modal-map/modal-map.component';
import { ModalNewcompanyComponent } from '../modal-newcompany/modal-newcompany.component';
import {
    BodyworkType,
    CompanyType,
    FareType,
    LoadType,
    PublicationType,
    TripModality,
    TripType,
    VehicleType,
    Module,
    Datatype,
} from '@apptypes/enums';
import {
    PublicationService,
    HandleErrorService,
    FareService,
    GlobalService,
    AuthenticationService,
    CustomFieldService,
    CompanyService,
    YardService,
    VehicleService,
} from '@services/index';
import { Fare, User, CustomField, Report } from '@entities/index';
import * as moment from 'moment';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMAT } from '@utils/moment-format.util';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Weekday } from '@apptypes/enums/day.enum';

@Component({
    selector: 'app-modal-publication-as-transporter',
    templateUrl: './modal-publication-as-transporter.component.html',
    styleUrls: ['./modal-publication-as-transporter.component.scss'],
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
export class ModalPublicationAsTransporterComponent implements OnInit {
    public isGenerator: boolean = false;
    public publicationForm: FormGroup;
    public submit: boolean = false;

    public bodyworkType = BodyworkType;
    public loadType = LoadType;
    public publicationType = PublicationType;
    public tripModality = TripModality;
    public tripType = TripType;
    public vehicleType = VehicleType;
    public datatype = Datatype;
    previousCount: number = 0;

    public companyIdArray = [];
    public coordinatesDownload = [null];
    public coordinatesLoad = [null];
    public downloadArray = [];
    public loadArray = [];
    public customFieldArray = [];

    public user: User;
    public fares: Fare[];
    public customFields: CustomField[];
    public plates: string[] = [];
    public municipalities: string[] = [];
    public yards: string[] = [];
    public filteredOrigins: Observable<string[]>[] = [];
    public filteredDestinies: Observable<string[]>[] = [];
    public filteredLoadPlaces: Observable<string[]>[] = [];
    public filteredDownloadPlaces: Observable<string[]>[] = [];
    public filteredOptions: Observable<string[]>[] = [];

    /* Arrays al momento de publicar */
    public originsId = [];
    public destiniesId = [];
    public reports: Report[];
    public isVisible: boolean = false;
    public day;

    /* DatePicker */
    @ViewChild('picker') picker: any;
    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public maxDate: moment.Moment;
    public minDate: string;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';

    constructor(
        private readonly authService: AuthenticationService,
        private readonly customFieldService: CustomFieldService,
        private readonly fareService: FareService,
        private readonly yardService: YardService,
        private formBuilder: FormBuilder,
        private readonly globalService: GlobalService,
        private readonly handleErrorService: HandleErrorService,
        private readonly publicationService: PublicationService,
        private readonly vehicleService: VehicleService,
        private readonly companyService: CompanyService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ModalNewcompanyComponent>,
        private toastr: ToastrService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
        const token = this.globalService.getToken();
        this.user = this.authService.getDecodedAccessToken(token);

        this.minDate = this.getTodayFormatted();

        this.getFareNamesOfGenerator();
        this.getPublicationCustomFields();
        this.getMunicipalities();
        this.getYards();
        this.getVehiclePlates();
        this.getOfferMetadata();
    }

    get f() {
        return this.publicationForm.controls;
    }

    get getDownloads() {
        return this.publicationForm.get('downloads') as FormArray;
    }

    get getLoads() {
        return this.publicationForm.get('loads') as FormArray;
    }

    get getCustomFields() {
        return this.publicationForm.get('customFields') as FormArray;
    }

    get getReports() {
        return this.publicationForm.get('reports') as FormArray;
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

    filterMunicipality(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.municipalities.filter((name) => name.toLowerCase().includes(filterValue));
    }

    filterYards(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.yards.filter((loadPlace: any) => loadPlace.name.toLowerCase().includes(filterValue));
    }

    manageOriginLookup(index: number) {
        const origins = this.publicationForm.get('loads') as FormArray;
        this.filteredOrigins[index] = origins
            .at(index)
            .get('name')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterMunicipality(value)),
            );
    }

    manageDestinyLookup(index: number) {
        const destinies = this.publicationForm.get('downloads') as FormArray;
        this.filteredDestinies[index] = destinies
            .at(index)
            .get('name')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterMunicipality(value)),
            );
    }

    manageLoadPlaceLookup(index: number) {
        const loadPlaces = this.publicationForm.get('loads') as FormArray;
        this.filteredLoadPlaces[index] = loadPlaces
            .at(index)
            .get('loadPlace')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterYards(value)),
            );
    }

    manageDownloadPlaceLookup(index: number) {
        const downloadPlaces = this.publicationForm.get('downloads') as FormArray;
        this.filteredDownloadPlaces[index] = downloadPlaces
            .at(index)
            .get('downloadPlace')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterYards(value)),
            );
    }

    public addDownload() {
        const control = <FormArray>this.publicationForm.controls['downloads'];
        control.push(
            this.formBuilder.group({
                id: [''],
                name: ['', [Validators.required]],
                downloadPlace: [],
                downloadDate: [''],
                latitude: [null],
                longitude: [null],
            }),
        );

        this.coordinatesDownload.push(null);
        this.manageDestinyLookup(control.length - 1);
        this.manageDownloadPlaceLookup(control.length - 1);
    }

    public addLoad(isDateRequired: boolean = false) {
        const control = <FormArray>this.publicationForm.controls['loads'];
        control.push(
            this.formBuilder.group({
                id: [''],
                name: ['', [Validators.required]],
                loadPlace: [''],
                loadDate: isDateRequired ? ['', [Validators.required]] : [''],
                latitude: [null],
                longitude: [null],
            }),
        );

        this.coordinatesLoad.push(null);
        this.manageOriginLookup(control.length - 1);
        this.manageLoadPlaceLookup(control.length - 1);
    }

    public formatTime(time: any) {
        let formatted = moment(time, 'HH:mm:ss').format('LT');

        return formatted;
    }

    /**
     * HELPERS
     */
    public getFormControlName(control: AbstractControl) {
        const keys = Object.keys((control as FormGroup).controls);
        return keys[0];
    }

    public getTodayFormatted(): string {
        const instant = moment(new Date());
        return instant.format('YYYY-MM-DDTHH:mm');
    }

    public getTomorrowFormatted(): string {
        const instant = moment(new Date().getTime() + 24 * 60 * 60 * 1000);
        return instant.format('YYYY-MM-DDTHH:mm');
    }

    public onClose(): void {
        this.dialogRef.close();
    }

    public onFareSelected(event) {
        const loadsControl = <FormArray>this.publicationForm.controls['loads'];
        const downloadsControl = <FormArray>this.publicationForm.controls['downloads'];

        this.fareService.getLocationsById(+event.value).subscribe((res) => {
            if (res.data) {
                const origins = res.data.origins.map((l) => l.name);
                const destinies = res.data.destinies.map((l) => l.name);

                for (let controlIndex = loadsControl.length - 1; controlIndex >= 0; controlIndex--) {
                    this.removeLoad(controlIndex);
                }
                for (let controlIndex = downloadsControl.length - 1; controlIndex >= 0; controlIndex--) {
                    this.removeDownload(controlIndex);
                }

                for (let locationIndex = 0; locationIndex < origins.length; locationIndex++) {
                    this.addLoad();
                    loadsControl.at(locationIndex).setValue({
                        name: origins[locationIndex],
                        loadPlace: '',
                        loadDate: '',
                        latitude: '',
                        longitude: '',
                    });
                }
                for (let locationIndex = 0; locationIndex < destinies.length; locationIndex++) {
                    this.addDownload();
                    downloadsControl.at(locationIndex).setValue({
                        name: destinies[locationIndex],
                        downloadPlace: '',
                        downloadDate: '',
                        latitude: '',
                        longitude: '',
                    });
                }
            }
        });
    }

    public openDialogMap(index: number, load?: boolean): void {
        this.dialog
            .open(ModalMapComponent, {
                width: '900px',
                height: '600px',
                disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {
                // Fill array with map modal coordinates.
                load
                    ? this.addCoordinates(index, this.coordinatesLoad, result)
                    : this.addCoordinates(index, this.coordinatesDownload, result);
            });
    }

    public removeDownload(index: number) {
        this.destiniesId = [];
        const control = <FormArray>this.publicationForm.controls['downloads'];

        if (index) {
            this.destiniesId.push(control.value[index].id);
            this.deleteDestiny(control.value[index].id);
        }
        control.removeAt(index);

        this.coordinatesDownload.splice(index, 1); // Delete coordinates from the array at the indicated position
        this.filteredDestinies.splice(index, 1);
        this.filteredDownloadPlaces.splice(index, 1);
    }

    public removeCoordDownload(index: number) {
        delete this.coordinatesDownload[index];
    }

    public removeLoad(index: number) {
        this.originsId = [];
        const control = <FormArray>this.publicationForm.controls['loads'];

        if (index) {
            this.originsId.push(control.value[index].id);
            this.deleteOrigin(control.value[index].id);
        }
        control.removeAt(index);

        this.coordinatesLoad.splice(index, 1); // Delete coordinates from the array at the indicated position
        this.filteredOrigins.splice(index, 1);
        this.filteredLoadPlaces.splice(index, 1);
    }

    /* Delete coordinates from the array at the indicated position */
    public removeCoordLoad(index: number) {
        delete this.coordinatesLoad[index];
    }

    /* Assign coordinates to the corresponding array */
    private addCoordinates(index: number, array: any, value: any) {
        return (array[index] = value);
    }

    /**
     * FORM METHODS
     */
    private createForm() {
        this.publicationForm = this.formBuilder.group({
            generatorUserId: [''],
            isParcelService: [''],
            isVisible: [''],
            type: ['', [Validators.required]],
            tripType: [TripType.NATIONAL, [Validators.required]],
            tripModality: [TripModality.TONNAGE, [Validators.required]],
            typePublication: [PublicationType.AUTOMATIC, [Validators.required]],
            requestId: ['', [Validators.minLength(1), Validators.maxLength(50), Validators.required]],
            client: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.required]],
            description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(400)]],
            loads: this.formBuilder.array([]),
            downloads: this.formBuilder.array([]),
            /* Offers */
            vehicleLimit: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],
            vehicleType: ['', [Validators.required]],
            vehicleBodywork: [BodyworkType.DOES_NOT_APPLY, [Validators.required]],
            proposedFare: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            customFields: this.formBuilder.array([]),
            length: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            width: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            height: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            volume: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            weight: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            /* Report */
            reports: this.formBuilder.array([]),
        });

        this.addLoad(true);
        this.addDownload();
    }

    public getWeekday(index) {
        const loadDates = this.publicationForm.get('reports') as FormArray;
        let loadDate = loadDates.at(index).get('loadDate').value;

        let day = new Date(loadDate).toLocaleDateString('en-us', {
            weekday: 'long',
        });

        this.getSearch(day);
    }

    public getSearch(day) {
        const loadPlaces = this.publicationForm.get('loads') as FormArray;
        let yard = loadPlaces.at(0).get('loadPlace').value;

        this.yardService.search(yard).subscribe((res) => {
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

    private getShiftValidator(index: number) {
        const formArray = this.publicationForm.controls['reports'] as FormArray;
        formArray.at(index).get('shiftSchedule').setValidators(null);
        formArray.at(index).get('shiftSchedule').updateValueAndValidity();
    }

    private fillArray() {
        this.getLoads.value.forEach((load, i) => {
            let date;
            try {
                date = new Date(load.loadDate.toISOString());
            } catch (error) {
                date = new Date(load.loadDate);
            }

            this.loadArray.push({
                name: load.name,
                loadPlace: load.loadPlace,
                latitude: this.coordinatesLoad[i] ? this.coordinatesLoad[i].lat : null, // It is assigned if there are latitude coordinates in the load
                longitude: this.coordinatesLoad[i] ? this.coordinatesLoad[i].lng : null, // It is assigned if there are longitude coordinates in the load
                loadDate: date,
            });
        });

        this.getDownloads.value.forEach((load, i) => {
            let date;
            try {
                date = new Date(load.downloadDate.toISOString());
            } catch (error) {
                date = new Date(load.downloadDate);
            }

            this.downloadArray.push({
                name: load.name,
                downloadPlace: load.downloadPlace,
                latitude: this.coordinatesDownload[i] ? this.coordinatesDownload[i].lat : null, // It is assigned if there are latitude coordinates in the download
                longitude: this.coordinatesDownload[i] ? this.coordinatesDownload[i].lng : null, // It is assigned if there are longitude coordinates in the download
                downloadDate: date,
            });
        });

        this.getCustomFields.value.forEach((cf, i) => {
            this.customFieldArray.push({
                customFieldId: this.customFields[i].id,
                name: this.customFields[i].name,
                datatype: this.customFields[i].datatype,
                module: this.customFields[i].module,
                value: cf[this.customFields[i].name],
            });
        });

        this.reports = [];
        this.getReports.value.forEach((report) => {
            this.reports.push({
                driverIdCard: report.driverIdCard === '' ? null : report.driverIdCard,
                driverName: report.driverName === '' ? null : report.driverName,
                driverPhone: report.driverPhone === '' ? null : report.driverPhone,
                loadDate: report.loadDate === '' ? null : report.loadDate,
                vehicleCapacity: report.vehicleCapacity === '' ? null : report.vehicleCapacity,
                vehiclePlate: report.vehiclePlate === '' ? null : report.vehiclePlate,
                fareValue: report.fareValue === '' ? null : report.fareValue,
                shiftSchedule: report.shiftSchedule === '' ? null : report.shiftSchedule,
            } as Report);
        });
    }

    /**
     * API CALLS
     */

    private getFareNamesOfGenerator() {
        this.fareService.getAll(0, 0).subscribe((res) => {
            this.fares = res.data.records;
        });
    }

    private getPublicationCustomFields() {
        this.customFieldService.getCustomfieldsByModule(Module.PUBLICATION).subscribe((res) => {
            for (const customField of res.data.records) {
                const newFormGroup = new FormGroup({ [customField.name]: new FormControl('') });
                (this.publicationForm.get('customFields') as FormArray).push(newFormGroup);
            }
            this.customFields = res.data.records;
        });
    }

    getMunicipalities() {
        this.companyService.getCompanyMuniciaplities().subscribe((res) => {
            this.municipalities = res.data.records;
        });
    }

    getYards() {
        this.yardService.getAll().subscribe((res) => {
            this.yards = res.data;
        });
    }

    public onSubmit(isVisible?: any) {
        if (this.publicationForm.invalid) {
            return;
        }

        this.submit = true;

        this.fillArray();

        let date;
        try {
            date = new Date(this.getLoads.controls[0].get('loadDate').value.toISOString());
        } catch (error) {
            date = new Date(this.getLoads.controls[0].get('loadDate').value);
        }

        let data = {
            publication: {
                isParcelService: this.publicationForm.get('isParcelService').value ? true : false,
                isVisible: isVisible ? isVisible : false,
                type: PublicationType.MANUAL,
                tripType: this.publicationForm.get('tripType').value,
                tripModality: this.publicationForm.get('tripModality').value,
                fareType: FareType.CONTRACTED,
                client: this.publicationForm.get('client').value,
                date: date,
                requestId: this.publicationForm.get('requestId').value,
            },
            load: {
                length: this.publicationForm.get('length').value,
                width: this.publicationForm.get('width').value,
                height: this.publicationForm.get('height').value,
                volume: this.publicationForm.get('volume').value,
                weight: this.publicationForm.get('weight').value,
                type: this.publicationForm.get('type').value,
                description: this.publicationForm.get('description').value,
                code: this.publicationForm.get('requestId').value,
            },
            offers: [
                {
                    vehicleLimit: this.publicationForm.get('vehicleLimit').value,
                    vehicleType: this.publicationForm.get('vehicleType').value,
                    vehicleBodywork: this.publicationForm.get('vehicleBodywork').value,
                    proposedFare: this.publicationForm.get('proposedFare').value,
                    maximumFare: 0,
                },
            ],
            origins: this.loadArray.length > 0 ? this.loadArray : [],
            destinies: this.downloadArray.length > 0 ? this.downloadArray : [],
            customFields: this.customFieldArray,
            reports: this.reports.length > 0 ? this.reports : [],
        };

        this.publicationService.createPublicationAsTransporter(data).subscribe(
            (res) => {
                this.handleErrorService.controlError(res);
                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((_res) => {
                    this.submit = false;
                    if (res.code >= 1000) {
                        this.onClose();
                    } else {
                        this.handleErrorService.onFailure(res);
                    }
                });
            },
            (err) => {
                this.handleErrorService.onFailure(err);
                this.submit = false;
            },
        );

        this.emptyArray();
    }

    private emptyArray() {
        this.loadArray = [];
        this.downloadArray = [];
        this.customFieldArray = [];
        this.reports = [];
    }

    /* Métodos para eliminar sobre la publicación */
    private deleteDestiny(id) {
        this.publicationService.removeDestiny(id).subscribe(() => {});
    }

    private deleteOrigin(id) {
        this.publicationService.removeOrigin(id).subscribe(() => {});
    }

    getOfferMetadata() {
        this.f.vehicleLimit.setValue(1);
        this.updateReportsLength();
    }

    public onVehicleCountChanged() {
        this.updateReportsLength();
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

    updateReportsLength() {
        const delta = this.f.vehicleLimit.value - this.previousCount;

        if (delta > 0) {
            for (let idx = 0; idx < delta; idx++) {
                this.addReport();
            }
        } else if (delta < 0) {
            for (let removal = delta * -1; removal > 0; removal--) {
                this.removeLastReport();
            }
        }

        this.previousCount = this.f.vehicleLimit.value;
    }

    getVehiclePlates() {
        this.vehicleService.getCompanyVehiclePlates().subscribe((res) => {
            this.plates = res.data.records;
        });
    }

    getCurrentDriverOfVehicle(plate: string, controlIndex: number) {
        this.vehicleService.getVehicleCurrentDriver(plate).subscribe((res) => {
            const formArray = this.publicationForm.controls['reports'] as FormArray;
            formArray.at(controlIndex).get('driverIdCard').setValue(res.data.driverIdCard);
            formArray.at(controlIndex).get('driverName').setValue(res.data.driverName);
            formArray.at(controlIndex).get('driverPhone').setValue(res.data.driverPhone);
        });
    }

    getVehicleCapacity(plate: string, controlIndex: number) {
        this.vehicleService.getVehicleCapacity(plate).subscribe((res) => {
            const formArray = this.publicationForm.controls['reports'] as FormArray;
            if (res.data > 0) formArray.at(controlIndex).get('vehicleCapacity').setValue(res.data);
            else formArray.at(controlIndex).get('vehicleCapacity').setValue('');
        });
    }

    filterPlate(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.plates.filter((plate) => plate.toLowerCase().includes(filterValue));
    }

    managePlateLookup(index: number) {
        var reports = this.publicationForm.get('reports') as FormArray;
        this.filteredOptions[index] = reports
            .at(index)
            .get('vehiclePlate')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterPlate(value)),
            );
    }

    addReport() {
        const control = this.publicationForm.controls['reports'] as FormArray;
        control.push(
            this.formBuilder.group({
                vehiclePlate: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]],
                driverName: ['', [Validators.required, Validators.pattern('^[a-záéíóúñA-ZÑ ]+$')]],
                driverIdCard: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
                driverPhone: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
                vehicleCapacity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                loadDate: ['', [Validators.required]],
                fareValue: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
                shiftSchedule: [null],
            }),
        );
        this.managePlateLookup(control.length - 1);
    }

    removeReport(index: number) {
        const control = this.publicationForm.controls['reports'] as FormArray;
        control.removeAt(index);
        this.filteredOptions.splice(index, 1);
    }

    removeLastReport() {
        const control = this.publicationForm.controls['reports'] as FormArray;
        control.removeAt(control.length - 1);
        this.filteredOptions.splice(control.length - 1, 1);
    }
}
