import Swal from 'sweetalert2';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PublicationService } from '@services/publication.service';
import { CustomFieldService, UserService } from '../../../../services';
import { CustomField } from '../../../../types/entities';
import { Module } from '../../../../types/enums';
import { MatSnackBar } from '@angular/material/snack-bar';

class CustomFieldMap {
    as: string;
    from: string;
}

class MetaCustomFieldMap {
    formField: string;
    fileColumn: string;
}

@Component({
    selector: 'app-modal-massive-fields',
    templateUrl: './modal-massive-fields.component.html',
    styleUrls: ['./modal-massive-fields.component.scss'],
})
export class ModalMassiveFieldsComponent implements OnInit {
    public massiveForm: FormGroup;
    private closeRef: boolean;
    public submit: boolean;
    public customFields: CustomField[];
    public companyIdArray = [];
    public customfieldRelationsNew = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public fieldsMassiveData: any,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private publicationService: PublicationService,
        private customFieldService: CustomFieldService,
        public dialogRef: MatDialogRef<ModalMassiveFieldsComponent>,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getPublicationCustomFields();
        this.getFieldsRelation();

        this.fieldsMassiveData.data.companies?.forEach((element) => {
            this.companyIdArray.push(element.id);
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    get f() {
        return this.massiveForm.controls;
    }

    get getCustomFields() {
        return this.massiveForm.get('customFields') as FormArray;
    }

    public getFormControlName(control: AbstractControl) {
        const keys = Object.keys((control as FormGroup).controls);
        return keys[0];
    }

    getCustomFieldsArray() {
        const customFieldsArray: CustomFieldMap[] = [];
        this.getCustomFields.value.forEach((cf, i) => {
            customFieldsArray.push({
                as: this.customFields[i].name,
                from: cf[this.customFields[i].name],
            });
        });
        return customFieldsArray;
    }

    getCustomFieldsMetaArray() {
        const customFieldsArray: MetaCustomFieldMap[] = [];
        this.getCustomFields.value.forEach((cf, i) => {
            customFieldsArray.push({
                formField: this.customFields[i].name,
                fileColumn: cf[this.customFields[i].name],
            });
        });
        return customFieldsArray;
    }

    onSubmit(isVisible?: boolean) {
        this.submit = true;
        let origins = {
            name: this.massiveForm.get('nameOrigin').value,
            place:
                this.massiveForm.get('placeOrigin').value.length == 0 ? [] : this.massiveForm.get('placeOrigin').value,
            date: this.massiveForm.get('dateOrigin').value.length == 0 ? [] : this.massiveForm.get('dateOrigin').value,
        };
        let destinies = {
            name: this.massiveForm.get('nameDestiny').value,
            place:
                this.massiveForm.get('placeDestiny').value.length == 0
                    ? []
                    : this.massiveForm.get('placeDestiny').value,
            date:
                this.massiveForm.get('dateDestiny').value.length == 0 ? [] : this.massiveForm.get('dateDestiny').value,
        };

        const customFieldArray = this.getCustomFieldsArray();

        const data = {
            isVisible: isVisible ? isVisible : false,
            sendRequestToEveryone: !this.fieldsMassiveData.data.companyType,
            companiesToRequest:
                this.fieldsMassiveData.data.companiesToRequest?.length > 0
                    ? this.fieldsMassiveData.data.companiesToRequest
                    : this.companyIdArray,
            extraHours:
                +new Date()
                    .toString()
                    .match(/GMT-[0-9]+/)[0]
                    .split('-')
                    .slice(-1) / 100,
            map: {
                tripType: this.massiveForm.get('tripType').value,
                isParcelService: this.massiveForm.get('isParcelService').value,
                client: this.massiveForm.get('client').value,
                fareType: this.massiveForm.get('fareType').value,
                tripModality: this.massiveForm.get('tripModality').value,
                date: this.massiveForm.get('date').value,
                load: {
                    description: this.massiveForm.get('description').value,
                    type: this.massiveForm.get('typeLoad').value,
                    length: this.massiveForm.get('length').value,
                    width: this.massiveForm.get('width').value,
                    height: this.massiveForm.get('height').value,
                    weight: this.massiveForm.get('weight').value,
                    volume: this.massiveForm.get('volume').value,
                    code: this.massiveForm.get('requestId').value,
                },
                offer: {
                    vehicleType: this.massiveForm.get('vehicleType').value,
                    vehicleLimit: this.massiveForm.get('vehicleLimit').value,
                    vehicleBodywork: this.massiveForm.get('vehicleBodywork').value,
                    proposedFare: this.massiveForm.get('proposedFare').value,
                    maximumFare: this.massiveForm.get('maximumFare').value,
                },
                origins: origins,
                destinies: destinies,
                customFields: customFieldArray,
            },
        };

        if (this.massiveForm.invalid) {
            return;
        }

        let mapper = this.massiveForm.value;
        mapper['nameOrigin'] = mapper['nameOrigin'].join('|-|');
        mapper['placeOrigin'] = mapper['placeOrigin'].join('|-|');
        mapper['dateOrigin'] = mapper['dateOrigin'].join('|-|');
        mapper['nameDestiny'] = mapper['nameDestiny'].join('|-|');
        mapper['placeDestiny'] = mapper['placeDestiny'].join('|-|');
        mapper['dateDestiny'] = mapper['dateDestiny'].join('|-|');
        delete mapper['customFields'];
        mapper['customfieldRelations'] = this.getCustomFieldsMetaArray();

        this.publicationService.massive(data).subscribe(
            (res) => {
                this.closeRef = res;
                if (res.code < 1000) this.onFailure(res);
                else this.onSuccess();

                this.updateFieldsRelation(mapper);
                this.submit = false;

                this.onClose();
            },
            (err) => {
                this.submit = false;
                this.onFailure(err);
                this.updateFieldsRelation(mapper);
            },
        );
    }

    private createForm() {
        this.massiveForm = this.formBuilder.group({
            tripType: ['N/A', [Validators.required]],
            isParcelService: ['N/A'],
            client: ['N/A'],
            requestId: ['N/A'],
            fareType: ['N/A', [Validators.required]],
            tripModality: ['N/A', [Validators.required]],
            date: ['N/A', [Validators.required]],
            description: ['N/A', [Validators.required]],
            typeLoad: ['N/A', [Validators.required]],
            length: ['N/A'],
            width: ['N/A'],
            height: ['N/A'],
            weight: ['N/A'],
            volume: ['N/A'],
            vehicleType: ['N/A', [Validators.required]],
            vehicleLimit: ['N/A', [Validators.required]],
            vehicleBodywork: ['N/A'],
            vehicleCapacity: ['N/A'],
            proposedFare: ['N/A', [Validators.required]],
            maximumFare: ['N/A', [Validators.required]],
            nameOrigin: [['N/A'], [Validators.required]],
            placeOrigin: [['N/A']],
            dateOrigin: [['N/A']],
            nameDestiny: [['N/A'], [Validators.required]],
            placeDestiny: [['N/A']],
            dateDestiny: [['N/A']],
            customFields: this.formBuilder.array([]),
        });
    }

    private patchValue(data) {
        this.massiveForm.patchValue({
            tripType: data.tripType,
            isParcelService: data.isParcelService,
            client: data.client,
            requestId: data.requestId,
            fareType: data.fareType,
            tripModality: data.tripModality,
            date: data.date,
            description: data.description,
            typeLoad: data.typeLoad,
            length: data.length,
            width: data.width,
            height: data.height,
            weight: data.weight,
            volume: data.volume,
            vehicleType: data.vehicleType,
            vehicleLimit: data.vehicleLimit,
            vehicleBodywork: data.vehicleBodywork,
            vehicleCapacity: data.vehicleCapacity,
            proposedFare: data.proposedFare,
            maximumFare: data.maximumFare,
            nameOrigin: data.nameOrigin.split('|-|'),
            placeOrigin: data.placeOrigin.split('|-|'),
            dateOrigin: data.dateOrigin.split('|-|'),
            nameDestiny: data.nameDestiny.split('|-|'),
            placeDestiny: data.placeDestiny.split('|-|'),
            dateDestiny: data.dateDestiny.split('|-|'),
        });

        const customFieldArray = this.massiveForm.get('customFields') as FormArray;
        customFieldArray.controls.map((control: FormGroup) => {
            const formField = Object.keys(control.value)[0];
            const customFieldField = control.controls[formField];
            const customFieldRelation = data.customfieldRelations.find((relation) => relation.formField === formField);
            if (customFieldRelation?.fileColumn !== undefined) {
                customFieldField.setValue(customFieldRelation.fileColumn);
            } else {
                customFieldField.setValue('N/A');
            }
        });
    }

    /**
     * API CALLS
     */
    private getPublicationCustomFields() {
        this.customFieldService.getCustomfieldsByModule(Module.PUBLICATION).subscribe((res) => {
            for (const customField of res.data.records) {
                const newFormGroup = new FormGroup({ [customField.name]: new FormControl('N/A') });
                (this.massiveForm.get('customFields') as FormArray).push(newFormGroup);
            }
            this.customFields = res.data.records;
        });
    }

    private getFieldsRelation() {
        this.userService.relationsOfPublication().subscribe((res) => {
            if (res.data !== null) {
                this.patchValue(res.data);
            }
        });
    }

    private updateFieldsRelation(mapper: any) {
        this.publicationService.saveMassiveRelations(mapper).subscribe((res) => {});
    }

    private onSuccess() {
        Swal.fire({
            icon: 'success',
            title: 'Cargue exitoso',
            text: 'El cargue masivo de los campos fue exitoso!',
        });
    }

    private onFailure(err) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el Cargue',
            html: err.error,
        });
    }
}
