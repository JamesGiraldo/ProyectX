import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-modal-preview-files',
    templateUrl: './modal-preview-files.component.html',
    styleUrls: ['./modal-preview-files.component.scss'],
})
export class ModalPreviewFilesComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public pdf: boolean;
    public exensionImages = ['png', 'jpg', 'jpeg'];

    constructor(
        @Inject(MAT_DIALOG_DATA) public urlData: any,
        public dialogRef: MatDialogRef<ModalPreviewFilesComponent>,
        private toastr: ToastrService,
    ) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        if (this.getFileExtension(this.urlData) === 'pdf') {
            this.pdf = true;
        } else if (this.exensionImages.includes(this.getFileExtension(this.urlData))) {
            this.pdf = false;
        } else {
            this.toastr.info(
                'El formato de archivo no permite visualizar el contenido, por lo cual, el archivo se descargará a su computador.',
                'Importante!',
            );
            if (this.urlData !== null) {
                window.open(this.urlData, '_blank').focus();
            }
            this.onClose();
        }
    }

    public onClose(): void {
        this.dialogRef.close();
    }

    public getFileExtension(filename) {
        this.blockUI.stop();
        return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
    }
}
