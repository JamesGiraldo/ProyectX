import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { AuthenticationService, GlobalService, HandleErrorService, CustomFieldService } from '@services/index';
import { User } from '@entities/index';
import { Datatype, Module } from '../../../../../types/enums';

@Component({
    selector: 'app-modal-new-custom-field',
    templateUrl: './modal-new-custom-field.component.html',
    styleUrls: ['./modal-new-custom-field.component.scss'],
})
export class ModalNewCustomFieldComponent implements OnInit {
    private closeRef: boolean;
    public IsEnable: boolean = true;
    public IsVisible: boolean = false;
    public customFieldForm: FormGroup;
    public optionsArray = [];
    public user: User;
    public submit = false;
    public types: string[] = Object.keys(Datatype).map((key) => Datatype[key]);
    public modules: string[] = Object.keys(Module).map((key) => Module[key]);
    public stages: string[] = [];
    public isVisible: boolean = false;
    companyId: number;

    unique_value: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public customFieldData: any,
        private cdRef: ChangeDetectorRef,
        private customFieldService: CustomFieldService,
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private handleErrorService: HandleErrorService,
        public dialogRef: MatDialogRef<ModalNewCustomFieldComponent>,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        const { company } = this.globalService.getDecodedToken();
        this.companyId = company.id;

        this.patchValue(this.customFieldData);
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    private createForm() {
        this.customFieldForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            datatype: ['', [Validators.required]],
            module: ['', [Validators.required]],
            stage: [''],
            options: this.formBuilder.array([]),
        });
    }

    get f() {
        return this.customFieldForm.controls;
    }

    get getOptions() {
        return this.customFieldForm.get('options') as FormArray;
    }

    public addOption(value: string = '') {
        const control = this.customFieldForm.controls['options'] as FormArray;
        control.push(
            this.formBuilder.group({
                value: [value, [Validators.required]],
                customFieldId: [],
                id: [],
            }),
        );
    }

    public onOptionsSelected(event) {
        if (event.value === Module.YARD_CONTROL) {
            this.isVisible = true;
            this.customFieldForm.get('stage').setValidators([Validators.required]);
            this.allStages(this.companyId);
        } else {
            this.customFieldForm.get('stage').setValidators(null);
            this.isVisible = false;
        }

        this.customFieldForm.get('stage').updateValueAndValidity();

        const options = this.customFieldForm.controls['options'] as FormArray;
        if (options.length == 0 && event.value === Datatype.LIST) this.addOption(this.unique_value);
        if (options.length == 1 && event.value !== Datatype.LIST) {
            this.unique_value = options.at(0).value.value;
            this.removeOption(0);
        }
    }

    public onOptionsSelectedType($event) {
        if ($event.value !== Datatype.LIST) {
            this.optionsArray = [];
            this.removeOption(0);
        }
    }

    public removeOption(index: number) {
        this.optionsArray = [];
        const control = this.customFieldForm.controls['options'] as FormArray;
        control.removeAt(index);
    }

    private allStages(companyId: number) {
        this.customFieldService.getCustomfieldsByStage(companyId).subscribe((res) => {
            this.stages = res;
        });
    }

    private fillArray() {
        this.getOptions.value.forEach((option) => {
            this.optionsArray.push({
                value: option.value === '' ? '' : option.value,
                customFieldId: this.customFieldData.id,
                id: option.id,
            });
        });
    }

    /**
     * EVENT HANDLERS
     */

    public onClose(): void {
        this.dialogRef.close(this.customFieldData);
    }

    /**
     * API CALLS
     */

    public onSubmit() {
        if (this.customFieldForm.invalid) {
            return;
        }

        this.fillArray();

        this.submit = true;

        const data = {
            name: this.customFieldForm.get('name').value,
            datatype: this.customFieldForm.get('datatype').value,
            module: this.customFieldForm.get('module').value,
            controlStage: this.customFieldForm.get('stage').value,
            options: this.optionsArray.length > 0 ? this.optionsArray : [],
        };

        const dataEdit = {
            name: this.customFieldForm.get('name').value,
            datatype: this.customFieldForm.get('datatype').value,
            module: Module.YARD_CONTROL,
            controlStage: this.customFieldForm.get('stage').value,
            options: this.optionsArray.length > 0 ? this.optionsArray : [],
        };

        if (this.customFieldData.id !== null) {
            this.customFieldService.edit(this.customFieldData.id, dataEdit).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                        this.closeRef = res;
                        if (this.closeRef) this.onClose();
                        this.submit = false;
                    });
                    this.customFieldData.refresh = true;
                },
                (err) => {
                    this.handleErrorService.onFailure(err);
                    this.submit = false;
                },
            );
        } else {
            this.customFieldService.createCustomField(data).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                        this.closeRef = res;
                        if (this.closeRef) this.onClose();
                        this.submit = false;
                    });
                    this.customFieldData.refresh = true;
                },
                (err) => {
                    this.handleErrorService.onFailure(err);
                    this.submit = false;
                },
            );
        }
    }

    private updateOptions(data) {
        const optionControl = this.customFieldForm.controls['options'] as FormArray;
        for (let controlIndex = optionControl.length - 1; controlIndex >= 0; controlIndex--) {
            this.removeOption(controlIndex);
        }

        const options = data?.options.map((o) => o);
        for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
            this.addOption();
            optionControl.at(optionIndex).setValue({
                customFieldId: options[optionIndex].customFieldId,
                id: options[optionIndex]?.id,
                value: options[optionIndex].value,
            });
        }
    }

    private patchValue(data) {
        data.id ? this.f['module'].disable() : this.f['module'].enable();

        if (data.id !== null) {
            this.isVisible = true;
            this.customFieldForm.get('stage').setValidators([Validators.required]);
            this.allStages(this.companyId);
            this.updateOptions(data);
        }

        this.customFieldForm.patchValue({
            name: data.name,
            datatype: data.datatype,
            module: data.module,
            stage: data.controlStage,
        });
    }
}
