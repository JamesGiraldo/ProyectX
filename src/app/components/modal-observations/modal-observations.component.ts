import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-modal-observations',
    templateUrl: './modal-observations.component.html',
    styleUrls: ['./modal-observations.component.scss'],
})
export class ModalObservationsComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<ModalObservationsComponent>,
        @Inject(MAT_DIALOG_DATA) public dataDescription: string,
    ) {}

    ngOnInit(): void {}

    public onClose() {
        this.dialogRef.close();
    }
}
