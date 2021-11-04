import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    UserService,
    GlobalService,
    AuthenticationService,
    CustomFieldService,
    CompanyService,
    OfferService,
    YardService,
} from '@services/index';
import { Fare, User, CustomField, Publication } from '@entities/index';
import * as moment from 'moment';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMAT } from '@utils/moment-format.util';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-modal-newpublication',
    templateUrl: './modal-newpublication.component.html',
    styleUrls: ['./modal-newpublication.component.scss'],
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
export class ModalNewPublicationComponent implements OnInit {
    public clipboardDisabled: boolean;
    public dataClipboard = {};
    public contracted: boolean = false;
    public isGenerator: boolean = false;
    public negotiable: boolean = true;
    public publicationForm: FormGroup;
    public submit: boolean = false;

    public bodyworkType = BodyworkType;
    public fareType = FareType;
    public loadType = LoadType;
    public publicationType = PublicationType;
    public tripModality = TripModality;
    public tripType = TripType;
    public vehicleType = VehicleType;
    public datatype = Datatype;

    public companyIdArray = [];
    public coordinatesDownload = [null];
    public coordinatesLoad = [null];
    public downloadArray = [];
    public loadArray = [];
    public offerArray = [];
    public customFieldArray = [];

    public user: User;
    public publicationCopy: Publication = null;
    public fares: Fare[];
    public customFields: CustomField[];
    public yards: string[] = [];

    municipalities: string[] = [];
    filteredOrigins: Observable<string[]>[] = [];
    filteredDestinies: Observable<string[]>[] = [];
    public filteredLoadPlaces: Observable<string[]>[] = [];
    public filteredDownloadPlaces: Observable<string[]>[] = [];

    /* Arrays al momento de publicar */
    public offersId = [];
    public originsId = [];
    public destiniesId = [];

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

    constructor(
        @Inject(MAT_DIALOG_DATA) public companyData: any,
        @Inject(MAT_DIALOG_DATA) public requestData: any,
        private authService: AuthenticationService,
        private customFieldService: CustomFieldService,
        private fareService: FareService,
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private handleErrorService: HandleErrorService,
        private readonly yardService: YardService,
        private publicationService: PublicationService,
        private userService: UserService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ModalNewcompanyComponent>,
        private readonly offerService: OfferService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.isGenerator = company.type === CompanyType.GENERATOR;
        const token = this.globalService.getToken();
        this.user = this.authService.getDecodedAccessToken(token);

        this.companyData.companies?.forEach((element) => {
            this.companyIdArray.push(element.id);
        });
        this.getFareNamesOfGenerator();
        this.getAATimes();
        this.getPublicationCustomFields();
        this.getMunicipalities();
        this.getYards();
        if (this.requestData.editPublication) this.getPublication(this.requestData.editPublication.option.id);

        /* Paste clipboard */
        this.clipboardDisabled = true;
        this.dataClipboard = JSON.parse(localStorage.getItem('cargoapp.clipboard'));
        this.dataClipboard === null ? (this.clipboardDisabled = true) : (this.clipboardDisabled = false);
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

    get getOffers() {
        return this.publicationForm.get('offers') as FormArray;
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

    public addOffer() {
        const control = <FormArray>this.publicationForm.controls['offers'];
        control.push(
            this.formBuilder.group({
                id: [''],
                vehicleLimit: [0, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],
                vehicleType: ['', [Validators.required]],
                vehicleBodywork: [BodyworkType.DOES_NOT_APPLY],
                proposedFare: [0, [Validators.pattern('^[0-9]+$')]],
                maximumFare: [0, [Validators.pattern('^[0-9]+$')]],
            }),
        );
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

    public fareChange($event) {
        this.changeFareType($event.value);
    }

    public onClose(): void {
        let close = true;
        this.companyIdArray = [];
        this.dialogRef.close({ close: close, data: this.requestData });
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
    }

    /* Delete coordinates from the array at the indicated position */
    public removeCoordLoad(index: number) {
        delete this.coordinatesLoad[index];
    }

    public removeOffer(index: number) {
        this.offersId = [];
        const control = <FormArray>this.publicationForm.controls['offers'];

        if (index) {
            this.offersId.push(control.value[index].id);
            this.deleteOffer(control.value[index].id);
        }
        control.removeAt(index);
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
            fareType: [FareType.NEGOTIABLE, [Validators.required]],
            requestId: ['', [Validators.minLength(1), Validators.maxLength(50), Validators.required]],
            client: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.required]],
            description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(400)]],
            waitTimeHour: [0, [Validators.pattern('^[0-9]+$')]],
            waitTimeMinute: [0, [Validators.pattern('^[0-9]+$')]],
            toleranceTimeHour: [0, [Validators.pattern('^[0-9]+$')]],
            toleranceTimeMinute: [0, [Validators.pattern('^[0-9]+$')]],
            loads: this.formBuilder.array([]),
            downloads: this.formBuilder.array([]),
            offers: this.formBuilder.array([
                this.formBuilder.group({
                    id: [''],
                    vehicleLimit: [0, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],
                    vehicleType: ['', [Validators.required]],
                    vehicleBodywork: [BodyworkType.DOES_NOT_APPLY, [Validators.required]],
                    proposedFare: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
                    maximumFare: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
                }),
            ]),
            customFields: this.formBuilder.array([]),
            companiesToRequest: [''],
            length: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            width: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            height: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            volume: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            weight: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
        });

        this.addLoad(true);
        this.addDownload();
    }

    private disableAutomatic() {
        this.publicationForm.controls['waitTimeHour'].enable();
        this.publicationForm.controls['waitTimeMinute'].enable();
        this.publicationForm.controls['toleranceTimeHour'].enable();
        this.publicationForm.controls['toleranceTimeMinute'].enable();
    }

    private disableManual() {
        this.publicationForm.controls['waitTimeHour'].disable();
        this.publicationForm.controls['waitTimeMinute'].disable();
        this.publicationForm.controls['toleranceTimeHour'].disable();
        this.publicationForm.controls['toleranceTimeMinute'].disable();
    }

    private fillArray() {
        this.getOffers.value.forEach((offer) => {
            this.offerArray.push({
                publicationId: this.requestData.editPublication?.option.id,
                vehicleLimit: offer.vehicleLimit,
                vehicleType: offer.vehicleType,
                vehicleBodywork: offer.vehicleBodywork,
                proposedFare: offer.proposedFare,
                maximumFare: offer.maximumFare,
            });
        });

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
                publicationId: this.requestData.editPublication?.option.id,
                customFieldId: this.customFields[i].id,
                name: this.customFields[i].name,
                datatype: this.customFields[i].datatype,
                module: this.customFields[i].module,
                value: cf[this.customFields[i].name],
            });
        });
    }

    private patchValue(data) {
        this.companyIdArray = [];
        if (data.id) {
            let transporterId = data.requests.map((t) => t.transporterId);
            this.companyIdArray = transporterId;
        }
        let waitTimeHour = this.publicationService.convertFromMilliseconds(data.waitTime).hours;
        let waitTimeMinute = this.publicationService.convertFromMilliseconds(data.waitTime).minutes;
        let toleranceTimeHour = this.publicationService.convertFromMilliseconds(data.toleranceTime).hours;
        let toleranceTimeMinute = this.publicationService.convertFromMilliseconds(data.toleranceTime).minutes;
        this.onOfferSelected(data);
        this.updateOrigins(data);
        this.updateDestinies(data);
        this.updateCustomFields(data);

        this.publicationForm.patchValue({
            typePublication: data.type,
            isParcelService: data.isParcelService,
            type: data.load.type,
            tripType: data.tripType,
            tripModality: data.tripModality,
            fareType: data.fareType,
            client: data.client,
            toleranceTime: data.toleranceTime,
            waitTimeHour: waitTimeHour,
            waitTimeMinute: waitTimeMinute,
            toleranceTimeHour: toleranceTimeHour,
            toleranceTimeMinute: toleranceTimeMinute,
            description: data.load.description,
            requestId: data.load.code,
            length: data.load.length,
            width: data.load.width,
            height: data.load.height,
            volume: data.load.volume,
            weight: data.load.weight,
        });
        data.type === PublicationType.MANUAL ? this.disableManual() : this.disableAutomatic();
    }

    /**
     * EVENT HANDLERS
     */
    updateOrigins(data) {
        const originControls = this.publicationForm.controls['loads'] as FormArray;
        for (let controlIndex = originControls.length - 1; controlIndex >= 0; controlIndex--) {
            this.removeLoad(controlIndex);
        }

        const origins = data.origins.map((o) => o);
        for (let originIndex = 0; originIndex < origins.length; originIndex++) {
            this.addLoad(originIndex == 0);
            originControls.at(originIndex).setValue({
                id: origins[originIndex]?.id,
                name: origins[originIndex].name,
                loadPlace: origins[originIndex].loadPlace,
                loadDate: origins[originIndex].loadDate || null,
                latitude: null,
                longitude: null,
            });
        }
    }

    updateDestinies(data) {
        const destiniesControls = this.publicationForm.controls['downloads'] as FormArray;
        for (let controlIndex = destiniesControls.length - 1; controlIndex >= 0; controlIndex--) {
            this.removeDownload(controlIndex);
        }

        const destinies = data.destinies.map((d) => d);
        for (let destinyIndex = 0; destinyIndex < destinies.length; destinyIndex++) {
            this.addDownload();
            destiniesControls.at(destinyIndex).setValue({
                id: destinies[destinyIndex]?.id,
                name: destinies[destinyIndex].name,
                downloadPlace: destinies[destinyIndex].downloadPlace,
                downloadDate: destinies[destinyIndex].downloadDate || null,
                latitude: null,
                longitude: null,
            });
        }
    }

    updateCustomFields(data) {
        const customFields = data.customFields.map((cf) => cf);
        const customFieldsControls = this.publicationForm.controls['customFields'] as FormArray;
        const customFieldsNames = customFieldsControls.value.map((v) => Object.keys(v)[0]);

        for (const customField of customFields) {
            const controlIndex = customFieldsNames.indexOf(customField.name);
            if (controlIndex != -1) {
                customFieldsControls.at(controlIndex).setValue({
                    [customField.name]: customField.value,
                });
            }
        }
    }

    onOfferSelected(data) {
        const offerControl = <FormArray>this.publicationForm.controls['offers'];
        for (let controlIndex = offerControl.length - 1; controlIndex >= 0; controlIndex--) {
            this.removeOffer(controlIndex);
        }

        const offers = data.offers.map((o) => o);
        for (let locationIndex = 0; locationIndex < offers.length; locationIndex++) {
            this.changeFareType(data.fareType);
            this.addOffer();
            offerControl.at(locationIndex).setValue({
                id: offers[locationIndex]?.id,
                vehicleLimit: offers[locationIndex].vehicleLimit,
                vehicleType: offers[locationIndex].vehicleType,
                vehicleBodywork: offers[locationIndex].vehicleBodywork,
                proposedFare: offers[locationIndex].proposedFare,
                maximumFare: offers[locationIndex].maximumFare,
            });
        }
    }

    public publicationChange($event) {
        if ($event.value === PublicationType.MANUAL) {
            this.publicationForm.controls['waitTimeHour'].setValue('');
            this.publicationForm.controls['waitTimeMinute'].setValue('');
            this.publicationForm.controls['toleranceTimeHour'].setValue('');
            this.publicationForm.controls['toleranceTimeMinute'].setValue('');
            this.disableManual();
        } else {
            this.publicationForm.controls['waitTimeHour'].setValue(0);
            this.publicationForm.controls['waitTimeMinute'].setValue(0);
            this.publicationForm.controls['toleranceTimeHour'].setValue(0);
            this.publicationForm.controls['toleranceTimeMinute'].setValue(0);
            this.disableAutomatic();
        }
    }

    public onContentPaste() {
        this.patchValue(this.dataClipboard);
    }

    /**
     * API CALLS
     */
    private getAATimes() {
        this.userService.getAAConfigTimes(this.user).subscribe((res) => {
            const waitHours = Math.floor(+res.data.waitTime / (1000 * 60 * 60));
            const waitMinutes = Math.ceil((+res.data.waitTime - waitHours * 60 * 60 * 1000) / (1000 * 60 * 60));
            const toleranceHours = Math.floor(+res.data.toleranceTime / (1000 * 60 * 60));
            const toleranceMinutes = Math.ceil(
                (+res.data.toleranceTime - toleranceHours * 60 * 60 * 1000) / (1000 * 60 * 60),
            );

            this.publicationForm.controls['waitTimeHour'].setValue(waitHours);
            this.publicationForm.controls['waitTimeMinute'].setValue(waitMinutes);
            this.publicationForm.controls['toleranceTimeHour'].setValue(toleranceHours);
            this.publicationForm.controls['toleranceTimeMinute'].setValue(toleranceMinutes);
        });
    }

    private getFareNamesOfGenerator() {
        this.fareService.getAll(0, 0).subscribe((res) => {
            this.fares = res.data.records;
        });
    }

    private getPublication(id) {
        this.publicationCopy = null;
        this.publicationService.getById(id).subscribe((res) => {
            this.publicationCopy = res.data;
            this.patchValue(this.publicationCopy);
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

        let waitTime = this.publicationService.convertToMilliseconds(
            this.publicationForm.get('waitTimeHour').value,
            this.publicationForm.get('waitTimeMinute').value,
        );
        let toleranceTime = this.publicationService.convertToMilliseconds(
            this.publicationForm.get('toleranceTimeHour').value,
            this.publicationForm.get('toleranceTimeMinute').value,
        );

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
                type: this.publicationForm.get('typePublication').value,
                tripType: this.publicationForm.get('tripType').value,
                tripModality: this.publicationForm.get('tripModality').value,
                fareType: this.publicationForm.get('fareType').value,
                client: this.publicationForm.get('client').value,
                date: date,
                waitTime: waitTime,
                toleranceTime: toleranceTime,
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
            offers: this.offerArray.length > 0 ? this.offerArray : [],
            origins: this.loadArray.length > 0 ? this.loadArray : [],
            destinies: this.downloadArray.length > 0 ? this.downloadArray : [],
            companiesToRequest:
                this.companyData.companiesToRequest?.length > 0
                    ? this.companyData.companiesToRequest
                    : this.companyIdArray,
            sendRequestToEveryone: !this.companyData.companyType,
            customFields: this.customFieldArray,
        };

        if (this.publicationCopy) {
            data.publication['id'] = this.publicationCopy.id;
            data.publication['generatorUserId'] = this.publicationCopy.generatorUserId;
            data.load['id'] = this.publicationCopy.load.id;
            data.load['publicationId'] = this.publicationCopy.id;

            const copies = [];
            this.publicationCopy.customFields.forEach((custom) => {
                if (!copies.find((cus) => cus.customFieldId === custom.customFieldId)) {
                    copies.push(custom);
                }
            });
            for (let index = 0; index < copies.length; index++) {
                data.customFields[index]['id'] = copies[index].id;
                data.customFields[index]['publicationId'] = this.publicationCopy.id;
                data.customFields[index]['customFieldId'] = copies[index].customFieldId;
            }

            const destinyCopies = [];
            this.publicationCopy.destinies.forEach((destinyCopy) => {
                if (!this.destiniesId.find((destinyId) => destinyCopy.id === destinyId)) {
                    destinyCopies.push(destinyCopy);
                }
            });
            for (let index = 0; index < destinyCopies.length; index++) {
                data.destinies[index]['id'] = destinyCopies[index].id;
                data.destinies[index]['publicationId'] = this.publicationCopy.id;
            }

            const originCopies = [];
            this.publicationCopy.origins.forEach((originCopy) => {
                if (!this.originsId.find((originId) => originCopy.id === originId)) {
                    originCopies.push(originCopy);
                }
            });
            for (let index = 0; index < originCopies.length; index++) {
                data.origins[index]['id'] = originCopies[index].id;
                data.origins[index]['publicationId'] = this.publicationCopy.id;
            }

            const offerCopies = [];
            this.publicationCopy.offers.forEach((offerCopy) => {
                if (!this.offersId.find((offerId) => offerCopy.id === offerId)) {
                    offerCopies.push(offerCopy);
                }
            });
            for (let index = 0; index < offerCopies.length; index++) {
                data.offers[index]['id'] = offerCopies[index].id;
                data.offers[index]['publicationId'] = this.publicationCopy.id;
            }
        }

        if (this.requestData.editPublication) {
            this.publicationService.updatePublication(this.requestData.editPublication.option.id, data).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((_res) => {
                        this.requestData.refresh = true;
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
        } else {
            this.publicationService.createPublication(data).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((_res) => {
                        this.requestData.refresh = true;
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
        }

        this.emptyArray();
    }

    private emptyArray() {
        this.loadArray = [];
        this.downloadArray = [];
        this.offerArray = [];
        this.customFieldArray = [];
    }

    /* Métodos para eliminar sobre la publicación */
    private deleteDestiny(id) {
        this.publicationService.removeDestiny(id).subscribe(() => {});
    }

    private deleteOrigin(id) {
        this.publicationService.removeOrigin(id).subscribe(() => {});
    }

    private deleteOffer(id) {
        this.offerService.removeOffer(id).subscribe(() => {});
    }

    private changeFareType(fareType: string) {
        switch (fareType) {
            case FareType.NEGOTIABLE:
                this.negotiable = true;
                this.contracted = false;
                break;
            case FareType.CONTRACTED:
                this.contracted = true;
                this.negotiable = false;
                break;
            default:
                this.negotiable = false;
                this.contracted = false;
        }
    }
}
