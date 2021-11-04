import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';

@Component({
    selector: 'app-modal-qr',
    templateUrl: './modal-qr.component.html',
    styleUrls: ['./modal-qr.component.scss'],
})
export class ModalQrComponent implements OnInit {
    public title: string;
    public titleFormat: string;
    public imageQR: any;
    public year = new Date().getFullYear();
    constructor(public dialogRef: MatDialogRef<ModalQrComponent>, @Inject(MAT_DIALOG_DATA) public tripData: any) {}

    ngOnInit(): void {
        this.imageQR = this.tripData.qrcode;

        if (this.tripData['Descripcion de la carga'] !== undefined) {
            this.titleFormat = this.titleCaseWord(this.tripData['Descripcion de la carga']);
        } else if (this.tripData['Placa'] !== undefined) {
            this.titleFormat = `Viaje placa ${this.tripData['Placa']}`;
        } else if (this.tripData['Fecha de publicación'] !== undefined) {
            this.titleFormat = `Viaje fecha publicación ${this.tripData['Fecha de publicación']}`;
        } else {
            this.titleFormat = new Date().toString();
        }
        this.title = `Vista previa código QR - ${this.titleFormat}`;
    }

    public async generateQR() {
        const doc = new jsPDF();
        /* Title */
        doc.setFontSize(18);
        doc.text('Código QR - Descripción del Viaje', 100, 20, null, 'center');
        doc.setTextColor(150);
        doc.text(this.titleFormat, 100, 30, null, 'center');

        /* Line */
        doc.setLineWidth(0.1);
        doc.setDrawColor(189, 189, 189);
        doc.setLineDashPattern([1, 1.5, 1, 1.5, 1, 1.5, 3, 2, 3, 2, 3, 2], 7.5);
        doc.line(10, 40, 200, 40);
        doc.addImage(this.imageQR, 'PNG', 55, 50, 100, 100);

        /* Description image */
        doc.setFontSize(12);
        doc.text(`Código generado por CargoApp - ${this.year}`, 104, 150, null, 'center');

        doc.save(`${this.title}.pdf`);
        setTimeout(() => {
            this.onClose();
        }, 1000);
    }

    public onClose() {
        this.dialogRef.close();
    }

    private titleCaseWord(word: string) {
        if (!word) return word;
        return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
}
