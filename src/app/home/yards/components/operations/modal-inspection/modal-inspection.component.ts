import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignaturePad } from 'angular2-signaturepad';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

import { GlobalService } from '@services/global.service';
import { HandleErrorService } from '@services/handle-error.service';
import { Inspection } from '@apptypes/entities/inspection';
import { ModalLegalBaseComponent } from '../modal-legal-base/modal-legal-base.component';
import { YardService } from '@services/yard.service';

@Component({
    selector: 'app-modal-inspection',
    templateUrl: './modal-inspection.component.html',
    styleUrls: ['./modal-inspection.component.scss'],
})
export class ModalInspectionComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('signatureInspection') signaturePadInspection: SignaturePad;
    @ViewChild('signaturePadDriver') signaturePadDriver: SignaturePad;

    public inspectionForm: FormGroup;
    public inspectionInfo: Inspection;
    public formatPrincipal;
    public formatA;
    public formatB;
    public disabledForm: boolean = true;
    public answersSelectedArrayPrincipal = [];
    public answersSelectedArrayFormatA = [];
    public answersSelectedArrayFormatB = [];
    public submit: boolean = false;
    public user;
    public signatureI;
    public signatureD;
    public headerForm;
    public selectedRadio = 'signDigital';
    public isVisibleSign: boolean = true;
    public flag: boolean = false;
    public formId: number;

    public SIZE_FILE: number = 512000;
    public FORMAT = ['image/png', 'image/jpeg', 'image/jpg'];

    public signaturePadOptions: Object = {
        minWidth: 1,
        canvasWidth: 500,
        canvasHeight: 100,
    };
    constructor(
        @Inject(MAT_DIALOG_DATA) public tripId: number,
        public dialogRef: MatDialogRef<ModalInspectionComponent>,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private readonly yardService: YardService,
        private handleErrorService: HandleErrorService,
        private readonly globalService: GlobalService,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        this.user = this.globalService.getDecodedToken();
        this.getInspection();
        this.getInspectionHeader(this.tripId);
    }

    ngAfterViewInit() {
        this.signaturePadInspection.set('minWidth', 1);
        this.signaturePadDriver.set('minWidth', 1);
    }

    get f() {
        return this.inspectionForm.controls;
    }

    onFileSelectedSign1($event) {
        if ($event.target.files.length > 0) {
            if ($event.target.files[0].size <= this.SIZE_FILE) {
                if (this.FORMAT.includes($event.target.files[0].type)) {
                    this.submit = false;
                    const [file] = $event.target.files;
                    this.inspectionForm.get('signature1').setValue(file, { emitModelToViewChange: false });
                } else {
                    this.onFailure(
                        'La imagen no tiene formato válido. Los formatos permitidos son .png., .jpeg y .jpg.',
                    );
                }
            } else {
                this.onFailure('Excede el tamaño permitido. El tamaño permitido es de 500kb.');
            }
        } else {
            this.onFailure('La imagen de la firma de inspección no se cargó');
        }
    }

    onFileSelectedSign2($event) {
        if ($event.target.files.length > 0) {
            if ($event.target.files[0].size <= this.SIZE_FILE) {
                if (this.FORMAT.includes($event.target.files[0].type)) {
                    this.submit = false;
                    const [file] = $event.target.files;
                    this.inspectionForm.get('signature2').setValue(file, { emitModelToViewChange: false });
                } else {
                    this.onFailure(
                        'La imagen no tiene formato válido. Los formatos permitidos son .png., .jpeg y .jpg.',
                    );
                }
            } else {
                this.onFailure('Excede el tamaño permitido. El tamaño permitido es de 500kb.');
            }
        } else {
            this.onFailure('La imagen de la firma de inspección no se cargó');
        }
    }

    public clearDraw($event) {
        if ($event === 1) {
            this.signaturePadInspection.clear();
            this.signatureI = undefined;
        } else {
            this.signaturePadDriver.clear();
            this.signatureD = undefined;
        }
    }

    public drawCompleteInspection() {
        this.signatureI = this.signaturePadInspection.toDataURL();
    }
    public drawCompleteDriver() {
        this.signatureD = this.signaturePadDriver.toDataURL();
    }

    public onChangeEnabled($event, data) {
        let text = 'TRANSPORTE DE MERCANCIAS PELIGROSAS';
        let upperText = data.toUpperCase();

        if (upperText === text) {
            if ($event.value === '1') {
                this.disabledForm = false;
            } else {
                this.disabledForm = true;
            }
        }
    }

    public radioChange(e) {
        if (this.selectedRadio === 'signDigital') {
            this.isVisibleSign = true;
        } else {
            this.isVisibleSign = false;
            this.signatureD = undefined;
            this.signatureI = undefined;
        }
    }

    public getObservation(caseFormat, item, $event) {
        switch (caseFormat) {
            case 1:
                this.answersSelectedArrayPrincipal.forEach((element, index) => {
                    if (element.itemId === item) {
                        this.answersSelectedArrayPrincipal[index].observation = $event;
                    }
                });
                break;
            case 2:
                this.answersSelectedArrayFormatA.forEach((element, index) => {
                    if (element.itemId === item) {
                        this.answersSelectedArrayFormatA[index].observation = $event;
                    }
                });
                break;
            default:
                this.answersSelectedArrayFormatB.forEach((element, index) => {
                    if (element.itemId === item) {
                        this.answersSelectedArrayFormatB[index].observation = $event;
                    }
                });
        }
    }

    public openInfo() {
        this.dialog
            .open(ModalLegalBaseComponent, {
                width: '1200px',
                height: '700px',
                disableClose: false,
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    public onChecked(caseFormat, item, option) {
        switch (caseFormat) {
            case 1:
                this.answersSelectedArrayPrincipal.forEach((element, index) => {
                    if (element.itemId === item) {
                        this.answersSelectedArrayPrincipal[index].value = +option;
                    }
                });
                break;
            case 2:
                this.answersSelectedArrayFormatA.forEach((element, index) => {
                    if (element.itemId === item) {
                        this.answersSelectedArrayFormatA[index].value = +option;
                    }
                });
                break;
            default:
                this.answersSelectedArrayFormatB.forEach((element, index) => {
                    if (element.itemId === item) {
                        this.answersSelectedArrayFormatB[index].value = +option;
                    }
                });
        }
    }

    public onClose(close) {
        this.dialogRef.close(close);
    }

    public onSubmit() {
        let someNull = this.answersSelectedArrayPrincipal.some((x) => x.value === null);
        let someNullA = this.answersSelectedArrayFormatA.some((x) => x.value === null);
        let someNullB = this.answersSelectedArrayFormatB.some((x) => x.value === null);

        if (this.inspectionForm.invalid || someNull) {
            return;
        }

        let dataComplete;
        if (someNullA && someNullB) {
            dataComplete = this.answersSelectedArrayPrincipal;
        } else if (someNullA && someNullB === false) {
            dataComplete = this.answersSelectedArrayPrincipal.concat(this.answersSelectedArrayFormatB);
        } else if (someNullB && someNullA === false) {
            dataComplete = this.answersSelectedArrayPrincipal.concat(this.answersSelectedArrayFormatA);
        } else {
            let dataFormat = this.answersSelectedArrayPrincipal.concat(this.answersSelectedArrayFormatA);
            dataComplete = dataFormat.concat(this.answersSelectedArrayFormatB);
        }

        const data = {
            formResponse: {
                formId: this.formatPrincipal?.formId,
                tripId: this.tripId,
                generatorId: this.user.id,
            },
            answersSelected: dataComplete,
        };

        const formData1 = new FormData();
        const formData2 = new FormData();
        let signatureInspection;
        let signatureDriver;

        if (this.selectedRadio === 'signDigital') {
            if (this.signatureI === undefined || this.signatureD === undefined) {
                this.onFailure('La firma digital es obligatoria');
                this.submit = false;
                this.flag = false;
            } else {
                this.flag = true;
                signatureInspection = this.dataURLtoFile(this.signatureI, 'image.png');
                formData1.append('file', signatureInspection);
                formData1.append('description', this.inspectionForm.get('generatorName').value);
                formData1.append('fileBy', 'FILE.GENERATOR');

                signatureDriver = this.dataURLtoFile(this.signatureD, 'image.png');
                formData2.append('file', signatureDriver);
                formData2.append('description', this.inspectionForm.get('driverName').value);
                formData2.append('fileBy', 'FILE.DRIVER');
            }
        } else {
            if (
                this.inspectionForm.get('signature1').value === null ||
                this.inspectionForm.get('signature2').value === null
            ) {
                this.onFailure('La imagen de la firma es obligatoria');
                this.submit = false;
                this.flag = false;
            } else {
                this.flag = true;
                formData1.append('file', this.inspectionForm.get('signature1').value);
                formData1.append('description', this.inspectionForm.get('generatorName').value);
                formData1.append('fileBy', 'FILE.GENERATOR');

                formData2.append('file', this.inspectionForm.get('signature2').value);
                formData2.append('description', this.inspectionForm.get('driverName').value);
                formData2.append('fileBy', 'FILE.DRIVER');
            }
        }

        if (this.flag === true) {
            Swal.fire({
                title: 'Está seguro que desea enviar el formulario de inspección?',
                text: 'Tenga en cuenta que este formulario no podrá ser modificado una vez se envíe',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Enviar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.submit = true;
                    this.blockUI.start('Loading...');

                    this.yardService.sendFormResponse(data).subscribe(
                        (res) => {
                            this.inspectionForm.markAsTouched();

                            const fileLoadedInspection = this.yardService.uploadFileResponse(res.data.id, formData1);
                            const fileLoadedDriver = this.yardService.uploadFileResponse(res.data.id, formData2);

                            forkJoin([fileLoadedInspection, fileLoadedDriver]).subscribe((result) => {
                                this.handleErrorService.controlError(res);
                                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((_res) => {
                                    this.submit = false;
                                    if (res.code >= 1000) {
                                        this.onClose(true);
                                    } else {
                                        this.handleErrorService.onFailure(res);
                                    }
                                });
                            });
                        },
                        (err) => {
                            this.handleErrorService.onFailure(err);
                            this.submit = false;
                        },
                    );
                }
                this.blockUI.stop();
            });
        }
    }

    private createForm() {
        this.inspectionForm = this.formBuilder.group({
            observation: [''],
            optionForm: ['', [Validators.required]],
            signature1: [],
            signature2: [],
            generatorName: ['', [Validators.required]],
            driverName: ['', [Validators.required]],
            /* Header */
            transporter: new FormControl({ value: '', disabled: true }),
            plate: new FormControl({ value: '', disabled: true }),
            model: new FormControl({ value: '', disabled: true }),
            brand: new FormControl({ value: '', disabled: true }),
            capacity: new FormControl({ value: '', disabled: true }),
            card_property: new FormControl({ value: '', disabled: true }),
            num_soat: new FormControl({ value: '', disabled: true }),
            date_soat: new FormControl({ value: '', disabled: true }),
            num_tecno: new FormControl({ value: '', disabled: true }),
            date_tecno: new FormControl({ value: '', disabled: true }),
            fullname: new FormControl({ value: '', disabled: true }),
            cc: new FormControl({ value: '', disabled: true }),
            date_license: new FormControl({ value: '', disabled: true }),
            num: new FormControl({ value: '', disabled: true }),
            category: new FormControl({ value: '', disabled: true }),
            phone: new FormControl({ value: '', disabled: true }),
            eps: new FormControl({ value: '', disabled: true }),
            arl: new FormControl({ value: '', disabled: true }),
            found: new FormControl({ value: '', disabled: true }),
            name_contact: new FormControl({ value: '', disabled: true }),
            phone_contact: new FormControl({ value: '', disabled: true }),
        });
    }

    private dataURLtoFile(dataurl, filename) {
        let arr = dataurl?.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    private getInspection() {
        this.yardService.getAllFormInspection().subscribe((res) => {
            this.inspectionInfo = { name: res.data.name };
            this.formatPrincipal = res.data.annexes.find((element) => element.order === 1);
            this.formatA = res.data.annexes.find((element) => element.order === 2);
            this.formatB = res.data.annexes.find((element) => element.order === 3);

            this.formatPrincipal.sections.forEach((element) => {
                element.items.map((x) => {
                    this.answersSelectedArrayPrincipal.push({
                        itemId: x.id,
                        value: null,
                        observation: null,
                    });
                });
            });

            this.formatA.sections.forEach((element) => {
                element.items.map((x) => {
                    this.answersSelectedArrayFormatA.push({
                        itemId: x.id,
                        value: null,
                        observation: null,
                    });
                });
            });

            this.formatB.sections.forEach((element) => {
                element.items.map((x) => {
                    this.answersSelectedArrayFormatB.push({
                        itemId: x.id,
                        value: null,
                        observation: null,
                    });
                });
            });

            this.blockUI.stop();
        });
    }

    private getInspectionHeader(tripId) {
        this.yardService.getAllFormHeader(tripId).subscribe((res) => {
            this.patchValue(res.data);
        });
    }

    private patchValue(data) {
        this.inspectionForm.patchValue({
            transporter: data.transporter,
            plate: data.vehicle.plate,
            model: data.vehicle.age,
            brand: data.vehicle.brand,
            capacity: data.vehicle.capacity,
            card_property: data.vehicle.card_property,
            num_soat: data.vehicle.num_soat,
            date_soat: data.vehicle.date_soat,
            num_tecno: data.vehicle.num_tecno,
            date_tecno: data.vehicle.date_tecno,
            fullname: data.driver.firstName + ' ' + data.driver.lastName,
            cc: data.driver.idCard,
            date_license: data.driver.date_license,
            num: data.driver.num,
            category: data.driver.category,
            phone: data.driver.phone,
            eps: data.driver.eps,
            arl: data.driver.arl,
            found: data.driver.found,
            name_contact: data.driver.name_contact,
            phone_contact: data.driver.phone_contact,
        });
    }

    private onFailure(msj) {
        Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            html: msj,
        });
    }
}
