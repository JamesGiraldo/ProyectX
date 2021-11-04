import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriverFile, VehicleFile } from '@apptypes/enums/file-type.enum';

import { DriverService } from '@services/driver.service';
import { VehicleService } from '@services/vehicle.service';
import { ModalDetailsFilesComponent } from '../modal-details-files/modal-details-files.component';
import { HandleErrorService } from '@services/handle-error.service';
import * as moment from 'moment';

@Component({
    selector: 'app-modal-files',
    templateUrl: './modal-files.component.html',
    styleUrls: ['./modal-files.component.scss'],
})
export class ModalFilesComponent implements OnInit {
    public filesForm: FormGroup;
    public driverFileType = DriverFile;
    public vehicleFileType = VehicleFile;
    public submit = true;
    public file: Array<File>;
    public fileHasLoaded: boolean;
    public fileName: string;
    public uploadFile: boolean = false;

    /* DatePicker */
    @ViewChild('picker') picker: any;
    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public maxDate: moment.Moment;
    public minDate: moment.Moment = moment(new Date()).add(0, 'd');
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';

    constructor(
        @Inject(MAT_DIALOG_DATA) public fileData: any,
        public dialogRef: MatDialogRef<ModalFilesComponent>,
        private readonly driverService: DriverService,
        private readonly vehicleService: VehicleService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private handleErrorService: HandleErrorService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {}

    get f() {
        return this.filesForm.controls;
    }

    public onClose(): void {
        this.dialogRef.close(false);
    }

    public onFileSelected($event) {
        if ($event.target.files.length > 0) {
            this.submit = false;
            this.fileName = $event.target.files[0].name;
            this.fileHasLoaded = true;

            const [file] = $event.target.files;
            this.filesForm.get('file').setValue(file, { emitModelToViewChange: false });
        } else {
            this.fileHasLoaded = false;
        }
    }

    public onSubmit() {
        if (this.filesForm.invalid) {
            return;
        }

        this.uploadFile = true;

        const formData = new FormData();
        formData.append('fileType', `FILE.TYPE.${this.filesForm.get('fileType').value}`);
        formData.append('description', this.filesForm.get('description').value);
        formData.append('expireDate', new Date(this.filesForm.get('expireDate').value).toISOString());
        formData.append('numberId', this.filesForm.get('numberId').value);
        formData.append('file', this.filesForm.get('file').value);

        if (this.fileData.type === 'driver') {
            this.driverService.uploadFile(this.fileData.data, formData).subscribe(
                (res) => {
                    if (res.code >= 1000) {
                        this.dialogRef.close(true);
                    } else {
                        this.handleErrorService.onFailure(res);
                    }
                },
                (err) => {
                    this.handleErrorService.onFailure(err);
                },
            );
        } else {
            this.vehicleService.uploadFile(this.fileData.data, formData).subscribe(
                (res) => {
                    if (res.code >= 1000) {
                        this.dialogRef.close(true);
                    } else {
                        this.handleErrorService.onFailure(res);
                    }
                },
                (err) => this.handleErrorService.onFailure(err),
            );
        }
    }

    public openDialogDetailsFiles(type: string): void {
        this.dialog
            .open(ModalDetailsFilesComponent, {
                width: '750px',
                height: '450px',
                disableClose: true,
                data: { type: type, data: this.fileData },
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    private createForm() {
        this.filesForm = this.formBuilder.group({
            fileType: ['', [Validators.required]],
            numberId: [''],
            description: ['', [Validators.required]],
            expireDate: ['', [Validators.required]],
            file: ['', [Validators.required]],
        });
    }
}
