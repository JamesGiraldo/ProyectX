import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FareService } from '@services/fare.service';
import { HandleErrorService } from '@services/handle-error.service';
import { ModalMassiveFieldsComponent } from '../modal-massive-fields/modal-massive-fields.component';

@Component({
    selector: 'app-modal-massive-fare',
    templateUrl: './modal-massive-fare.component.html',
    styleUrls: ['./modal-massive-fare.component.scss'],
})
export class ModalMassiveFareComponent implements OnInit {
    massiveFile: Array<File>;
    massiveFileHasLoaded: boolean;
    massiveFileName: string;
    uploadForm: FormGroup;
    submit = false;
    fieldMassive;
    isDisabled: boolean = true;

    constructor(
        private fareService: FareService,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ModalMassiveFareComponent>,
        public dialog: MatDialog,
        private handleErrorService: HandleErrorService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {}

    public onClose() {
        this.dialogRef.close(true);
    }

    public onFileSelected($event) {
        if ($event.target.files.length > 0) {
            this.massiveFileName = $event.target.files[0].name;
            this.massiveFileHasLoaded = true;

            const [file] = $event.target.files;
            this.uploadForm.get('massiveFile').setValue(file, { emitModelToViewChange: false });
            this.isDisabled = false;
        } else {
            this.massiveFileHasLoaded = false;
        }
    }

    public onDownload() {
        const url =
            'https://res.cloudinary.com/nativ-ant/raw/upload/v1627598553/files/Formato__para_cargue_masivo_tarifa_meqwao.xlsx';
        if (url !== null) {
            window.open(url, '_blank').focus();
        }
    }

    public onUpload() {
        if (this.uploadForm.invalid) {
            return;
        }

        const formData: FormData = new FormData();
        formData.append('file', this.uploadForm.get('massiveFile').value);

        this.fareService.uploadMassive(formData).subscribe(
            (res) => {
                this.fieldMassive = [...res.data.records];
                this.openDialogFieldMassive(this.fieldMassive);
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }

    private createForm() {
        this.uploadForm = this.formBuilder.group({
            massiveFile: ['', [Validators.required]],
        });
    }

    private openDialogFieldMassive(fields): void {
        this.dialog
            .open(ModalMassiveFieldsComponent, {
                width: '1000px',
                height: '650px',
                disableClose: false,
                data: { fields: fields, refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) this.onClose();
            });
    }
}
