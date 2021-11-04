import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { YardService } from '@services/yard.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalLegalBaseComponent } from '../modal-legal-base/modal-legal-base.component';

@Component({
    selector: 'app-modal-responses',
    templateUrl: './modal-responses.component.html',
    styleUrls: ['./modal-responses.component.scss'],
})
export class ModalResponsesComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public inspectionForm: FormGroup;
    public nameForm: string;
    public formatPrincipal;
    public formatA;
    public formatB;
    public fileGenerator;
    public fileDriver;

    constructor(
        @Inject(MAT_DIALOG_DATA) public tripId: number,
        public dialogRef: MatDialogRef<ModalResponsesComponent>,
        private readonly yardService: YardService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        this.getInspectionHeader(this.tripId);
        this.getResponses(this.tripId);
    }

    public onClose() {
        this.dialogRef.close();
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

    private createForm() {
        this.inspectionForm = this.formBuilder.group({
            observation: [''],
            optionForm: new FormControl({ value: '', disabled: true }),
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
            generatorName: new FormControl({ value: '', disabled: true }),
            driverName: new FormControl({ value: '', disabled: true }),
        });
    }

    private getInspectionHeader(tripId) {
        this.yardService.getAllFormHeader(tripId).subscribe((res) => {
            this.patchValue(res.data);

            this.blockUI.stop();
        });
    }

    private getResponses(tripId) {
        this.yardService.getAllFormResponses(tripId).subscribe((res) => {
            this.nameForm = res.data.form.name;
            this.formatPrincipal = res.data.answers;
            this.fileGenerator = res.data?.files.find((x) => x.fileBy === 'FILE.GENERATOR');
            this.fileDriver = res.data?.files.find((x) => x.fileBy === 'FILE.DRIVER');

            if (res.data?.files.length > 0) this.patchValueSign(res.data?.files);
        });
    }

    private patchValueSign(data) {
        let generator = data.find((x) => x.fileBy === 'FILE.GENERATOR');
        let driver = data.find((x) => x.fileBy === 'FILE.DRIVER');

        this.inspectionForm.patchValue({
            generatorName: generator.description,
            driverName: driver.description,
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
}
