import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-modal-format',
    templateUrl: './modal-format.component.html',
    styleUrls: ['./modal-format.component.scss'],
})
export class ModalFormatComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<ModalFormatComponent>) {}

    ngOnInit(): void {}

    public onClose() {
        this.dialogRef.close();
    }

    public downloadExplanationFormat() {
        const url =
            'https://res.cloudinary.com/nativ-ant/raw/upload/v1621551144/files/Formato_para_cargue_masivo_maazdg.xlsx';
        if (url !== null) {
            window.open(url, '_blank').focus();
        }
    }

    public downloadExampleFormat() {
        const url =
            'https://res.cloudinary.com/nativ-ant/raw/upload/v1621551143/files/Plantilla_ejemplo_cargue_masivo_pk2frr.csv';
        if (url !== null) {
            window.open(url, '_blank').focus();
        }
    }
}
