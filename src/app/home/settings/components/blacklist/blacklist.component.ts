import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Blacklist } from '../../../../types/entities';
import { BlacklistService } from '@services/blacklist.service';
import { Country } from '@apptypes/enums';
import { GlobalService, HandleErrorService } from '../../../../services';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-blacklist',
    templateUrl: './blacklist.component.html',
    styleUrls: ['./blacklist.component.scss'],
})
export class BlacklistComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public blacklistForm: FormGroup;
    public colNames: string[];
    public elementPages: number;
    public currentElements: number = 12;
    public closeRef: boolean;
    public loading: boolean = false;
    public page: number = 1;
    public submit: boolean = false;
    public totalPages: number;
    public blacklists: Blacklist[] = [];
    public translateKeys: string[] = ['Placa', 'Cédula', 'Motivo', 'Eliminar'];
    public country = Country;
    public user;

    constructor(
        private formBuilder: FormBuilder,
        private blacklistService: BlacklistService,
        private handleErrorService: HandleErrorService,
        private readonly globalService: GlobalService,
        private toastr: ToastrService,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        this.user = this.globalService.getDecodedToken().company.country?.id;

        if (this.user === this.country.PERU) {
            this.addValidationvehiclePlatePeru();
        } else {
            this.addValidationvehiclePlateColombia();
        }

        this.loading = true;
        this.setColumnNames();
        this.getBlacklist(this.page, this.currentElements);
    }

    get f() {
        return this.blacklistForm.controls;
    }

    /**
     * HELPERS
     */
    createForm() {
        this.blacklistForm = this.formBuilder.group({
            vehiclePlate: [null],
            driverIdCard: [null, [Validators.min(7), Validators.pattern('^[0-9]+$')]],
            reason: ['', [Validators.required]],
        });
    }

    setColumnNames() {
        this.colNames = [];
        for (let index = 0; index < this.translateKeys.length; index++) {
            this.colNames.push(`${this.translateKeys[index]}`);
        }
    }

    /**
     * EVENT HANDLERS
     */
    public onSubmit() {
        if (this.blacklistForm.invalid) return;

        if (
            this.blacklistForm.get('vehiclePlate').value !== null ||
            this.blacklistForm.get('driverIdCard').value !== null
        ) {
            this.blockUI.start('Loading...');

            this.submit = true;

            this.blacklistService.createBlackListRecord(this.blacklistForm.value).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                        this.submit = false;
                        this.loading = true;
                        this.getBlacklist(this.page, this.currentElements);

                        this.blacklistForm.get('vehiclePlate').setValue(null);
                        this.blacklistForm.get('driverIdCard').setValue(null);
                        this.blacklistForm.get('reason').setValue(null);
                    });
                },
                (err) => {
                    this.handleErrorService.onFailure(err);
                    this.submit = false;
                },
            );
            this.blockUI.stop();
        } else {
            this.toastr.error('Debe agregar la placa de un vehículo o la identificación del conductor', 'Error', {
                timeOut: 2500,
            });
        }
    }

    public searchData($event) {
        this.blockUI.start('Loading...');

        if ($event.length > 0) {
            this.blacklistService.search($event, this.page, this.currentElements).subscribe(
                (res) => {
                    this.blacklists = [...res.data.records];
                    this.elementPages = res.data.records.length;
                    this.totalPages = res.data.totalPages;

                    this.blockUI.stop();
                },
                () => this.blockUI.stop(),
            );
        } else {
            this.getBlacklist(this.page, this.currentElements);
        }
    }

    public goToPage(page: number) {
        this.blockUI.start('Loading...');
        this.page = page;

        this.getBlacklist(this.page, this.currentElements);
    }

    getCurrentElements($event) {
        this.blockUI.start('Loading...');
        this.currentElements = $event;

        if ($event > 12) this.page = 1;

        this.getBlacklist(this.page, this.currentElements);

        this.blockUI.stop();
    }

    public onBlacklistRemoved($event) {
        const blacklistIndex = this.blacklists.findIndex((bl) => bl.id === $event);
        this.blacklists.splice(blacklistIndex, 1);
    }

    /**
     * API CALLS
     */
    getBlacklist(page: number, elementPages: number): void {
        this.blacklistService.getAll(page, elementPages).subscribe((res) => {
            this.blacklists = [...res.data.records];

            this.elementPages = res.data.elementsPerPage;
            this.totalPages = res.data.totalPages;

            this.loading = false;

            this.blockUI.stop();
        });
    }

    /* Validation vehiclePlate */
    private addValidationvehiclePlatePeru() {
        this.clearValidationsvehiclePlate();

        this.blacklistForm.get('vehiclePlate').setValidators([Validators.pattern('^[a-zA-Z0-9]{6}$')]);
        this.blacklistForm.get('vehiclePlate').updateValueAndValidity();
    }

    private addValidationvehiclePlateColombia() {
        this.clearValidationsvehiclePlate();

        this.blacklistForm
            .get('vehiclePlate')
            .setValidators([Validators.pattern('^[a-zA-Z]{3}[0-9]{3}|[a-zA-Z]{3}[0-9]{3}[a-zA-Z]$')]);
        this.blacklistForm.get('vehiclePlate').updateValueAndValidity();
    }

    private clearValidationsvehiclePlate() {
        this.blacklistForm.get('vehiclePlate').setValidators(null);
        this.blacklistForm.get('vehiclePlate').updateValueAndValidity();
    }
}
