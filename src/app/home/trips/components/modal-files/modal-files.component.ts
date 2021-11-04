import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalPreviewFilesComponent } from 'src/app/components/modal-preview-files/modal-preview-files.component';

@Component({
    selector: 'app-modal-files',
    templateUrl: './modal-files.component.html',
    styleUrls: ['./modal-files.component.scss'],
})
export class ModalFilesComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<ModalFilesComponent>,
        @Inject(MAT_DIALOG_DATA) public filesData: any,
        public dialog: MatDialog,
    ) {}

    ngOnInit(): void {}

    public onClose(): void {
        this.dialogRef.close();
    }

    public preview(file: any) {
        this.dialog
            .open(ModalPreviewFilesComponent, {
                width: '750px',
                height: '770px',
                disableClose: false,
                data: file.imageUrl,
            })
            .afterClosed()
            .subscribe((result) => {});
    }
}
