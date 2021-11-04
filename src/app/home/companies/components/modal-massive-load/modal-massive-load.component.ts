import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HandleErrorService, PublicationService } from '@services/index';

import { ModalMassiveFieldsComponent } from '../modal-massive-fields/modal-massive-fields.component';
import { ModalFormatComponent } from './modal-format/modal-format.component';

@Component({
    selector: 'app-modal-massive-load',
    templateUrl: './modal-massive-load.component.html',
    styleUrls: ['./modal-massive-load.component.scss'],
})
export class ModalMassiveLoadComponent implements OnInit {
    massiveFile: Array<File>;
    massiveFileHasLoaded: boolean;
    massiveFileName: string;
    uploadForm: FormGroup;
    submit = false;
    fieldMassive;
    isDisabled: boolean = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public companyData: any,
        private publicationService: PublicationService,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ModalMassiveLoadComponent>,
        public dialog: MatDialog,
        private handleErrorService: HandleErrorService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {}

    public onClose() {
        this.dialogRef.close();
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
        this.dialog
            .open(ModalFormatComponent, {
                width: '720px',
                height: '200px',
                disableClose: false,
                data: null,
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    public onUpload() {
        if (this.uploadForm.invalid) {
            return;
        }

        const formData: FormData = new FormData();
        formData.append('file', this.uploadForm.get('massiveFile').value);

        this.publicationService.uploadMassive(formData).subscribe(
            (res) => {
                this.fieldMassive = [...res.data.records];
                this.openDialogFieldMassive(this.fieldMassive);
            },
            (err) => this.handleErrorService.onFailure(err),
        );

        this.onClose();
    }

    createForm() {
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
                data: { fields: fields, data: this.companyData },
            })
            .afterClosed()
            .subscribe((result) => {});
    }
}
