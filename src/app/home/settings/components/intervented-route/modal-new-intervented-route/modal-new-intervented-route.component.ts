import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { User, Fare } from '@apptypes/entities';
import {
    AuthenticationService,
    CompanyService,
    FareService,
    GlobalService,
    HandleErrorService,
    InterventedRouteService,
} from '@services/index';
import { ModalNewfareComponent } from '../../fares/modal-newfare/modal-newfare.component';
import { map, startWith, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-modal-new-intervented-route',
    templateUrl: './modal-new-intervented-route.component.html',
    styleUrls: ['./modal-new-intervented-route.component.scss'],
})
export class ModalNewInterventedRouteComponent implements OnInit {
    private closeRef: boolean;
    public IsEnable: boolean = true;
    public IsVisible: boolean = false;
    public companies;
    public fares: Fare[];
    public destinyArray = [];
    public interventedRouteForm: FormGroup;
    public originArray = [];
    public recordArray = [];
    public user: User;
    public submit = false;

    municipalities: string[] = [];
    filteredOrigins: Observable<string[]>[] = [];
    filteredDestinies: Observable<string[]>[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public interventedRouteData: any,
        private authService: AuthenticationService,
        private cdRef: ChangeDetectorRef,
        private companyService: CompanyService,
        private fareService: FareService,
        private interventedRouteService: InterventedRouteService,
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private handleErrorService: HandleErrorService,
        public dialogRef: MatDialogRef<ModalNewfareComponent>,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getTransportes();
        this.getFareNamesOfGenerator();
        this.getMunicipalities();
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    get f() {
        return this.interventedRouteForm.controls;
    }

    get getDestinies() {
        return this.interventedRouteForm.get('destinies') as FormArray;
    }

    get getOrigins() {
        return this.interventedRouteForm.get('origins') as FormArray;
    }

    filterMunicipality(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.municipalities.filter((name) => name.toLowerCase().includes(filterValue));
    }

    manageOriginLookup(index: number) {
        const origins = this.interventedRouteForm.get('origins') as FormArray;
        this.filteredOrigins[index] = origins
            .at(index)
            .get('nameOrigin')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterMunicipality(value)),
            );
    }

    manageDestinyLookup(index: number) {
        const destinies = this.interventedRouteForm.get('destinies') as FormArray;
        this.filteredDestinies[index] = destinies
            .at(index)
            .get('nameDestiny')
            .valueChanges.pipe(
                startWith<string>(''),
                map((value) => this.filterMunicipality(value)),
            );
    }

    public addDestiny() {
        const control = <FormArray>this.interventedRouteForm.controls['destinies'];
        control.push(
            this.formBuilder.group({
                nameDestiny: [],
            }),
        );

        this.manageDestinyLookup(control.length - 1);
    }

    public addOrigin() {
        const control = <FormArray>this.interventedRouteForm.controls['origins'];
        control.push(
            this.formBuilder.group({
                nameOrigin: [],
            }),
        );

        this.manageOriginLookup(control.length - 1);
    }

    public onClose(): void {
        this.dialogRef.close(this.interventedRouteData);
    }

    public onOptionsSelected(event) {
        event.value !== '' ? (this.IsVisible = true) : (this.IsVisible = false);
    }

    public onFareSelected(event) {
        const originsControl = <FormArray>this.interventedRouteForm.controls['origins'];
        const destiniesControl = <FormArray>this.interventedRouteForm.controls['destinies'];

        this.fareService.getLocationsById(+event.value).subscribe((res) => {
            const origins = res.data.origins.map((l) => l.name);
            const destinies = res.data.destinies.map((l) => l.name);

            for (let controlIndex = originsControl.length - 1; controlIndex >= 0; controlIndex--) {
                this.removeOrigin(controlIndex);
            }
            for (let controlIndex = destiniesControl.length - 1; controlIndex >= 0; controlIndex--) {
                this.removeDestiny(controlIndex);
            }

            for (let locationIndex = 0; locationIndex < origins.length; locationIndex++) {
                this.addOrigin();
                originsControl.at(locationIndex).setValue({ nameOrigin: origins[locationIndex] });
            }
            for (let locationIndex = 0; locationIndex < destinies.length; locationIndex++) {
                this.addDestiny();
                destiniesControl.at(locationIndex).setValue({ nameDestiny: destinies[locationIndex] });
            }
        });
    }

    public onSubmit() {
        if (this.interventedRouteForm.invalid) {
            return;
        }

        this.fillArray();

        this.submit = true;

        const data = {
            interventedRoute: {
                transporterId: this.interventedRouteForm.get('transporterId').value,
            },
            origins: this.originArray.length > 0 ? this.originArray : [],
            destinies: this.destinyArray.length > 0 ? this.destinyArray : [],
        };

        this.interventedRouteService.createInterventedRoute(data).subscribe(
            (res) => {
                this.handleErrorService.controlError(res);
                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                    this.closeRef = res;
                    if (this.closeRef) this.onClose();
                    this.submit = false;
                });
                this.interventedRouteData.refresh = true;
            },
            (err) => {
                this.handleErrorService.onFailure(err);
                this.submit = false;
            },
        );
    }

    public removeDestiny(index: number) {
        const control = <FormArray>this.interventedRouteForm.controls['destinies'];
        control.removeAt(index);
        this.filteredDestinies.splice(index, 1);
    }

    public removeRecord(index: number) {
        const control = <FormArray>this.interventedRouteForm.controls['records'];

        control.controls.length <= 6 ? (this.IsEnable = true) : (this.IsEnable = false);
        control.removeAt(index);
    }

    public removeOrigin(index: number) {
        const control = <FormArray>this.interventedRouteForm.controls['origins'];
        control.removeAt(index);
        this.filteredOrigins.splice(index, 1);
    }

    private createForm() {
        this.interventedRouteForm = this.formBuilder.group({
            transporterId: [''],
            fare: [''],
            origins: this.formBuilder.array([]),
            destinies: this.formBuilder.array([]),
        });

        this.addOrigin();
        this.addDestiny();
    }

    private fillArray() {
        this.getDestinies.value.forEach((destiny) => {
            this.destinyArray.push({
                name: destiny.nameDestiny === '' ? '' : destiny.nameDestiny,
            });
        });

        this.getOrigins.value.forEach((origin) => {
            this.originArray.push({
                name: origin.nameOrigin === '' ? '' : origin.nameOrigin,
            });
        });
    }

    private getTransportes(): void {
        this.companyService.getAllTransporters(0, 0).subscribe((res) => {
            this.companies = res.data.records;
        });
    }

    private getFareNamesOfGenerator() {
        this.fareService.getAll(0, 0).subscribe((res) => {
            this.fares = res.data.records;
        });
    }

    getMunicipalities() {
        this.companyService.getCompanyMuniciaplities().subscribe((res) => {
            this.municipalities = res.data.records;
        });
    }
}
