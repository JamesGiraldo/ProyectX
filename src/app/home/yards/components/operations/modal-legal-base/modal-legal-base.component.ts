import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-modal-legal-base',
    templateUrl: './modal-legal-base.component.html',
    styleUrls: ['./modal-legal-base.component.scss'],
})
export class ModalLegalBaseComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<ModalLegalBaseComponent>) {}

    ngOnInit(): void {}

    public onClose() {
        this.dialogRef.close();
    }
}
