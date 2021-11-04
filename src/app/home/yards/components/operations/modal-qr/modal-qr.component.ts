import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-modal-qr',
    templateUrl: './modal-qr.component.html',
    styleUrls: ['./modal-qr.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ModalQrComponent implements OnInit {
    public availableDevices: MediaDeviceInfo[];
    public currentDevice: MediaDeviceInfo = null;
    public hasDevices: boolean;
    public hasPermission: boolean;
    public qrResultId: string;
    public qrResultTripId: string;
    public qrResultPlate: string;
    public formatsEnabled: BarcodeFormat[] = [
        BarcodeFormat.CODE_128,
        BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.EAN_13,
        BarcodeFormat.QR_CODE,
    ];
    public torchEnabled = false;
    public torchAvailable$ = new BehaviorSubject<boolean>(false);

    constructor(public dialogRef: MatDialogRef<ModalQrComponent>, private toastr: ToastrService) {}

    ngOnInit(): void {}

    public onClose(data: any): void {
        this.dialogRef.close(data);
    }

    public onCamerasFound(devices: MediaDeviceInfo[]): void {
        this.availableDevices = devices;
        this.hasDevices = Boolean(devices && devices.length);
    }

    public onCodeResult(resultString: any) {
        let stringFormatted;
        let lengthId;
        let lengthPlate;

        if (resultString !== null) {
            stringFormatted = resultString.split(', ', 3);
            /* Cédula */
            lengthId = stringFormatted[0].length;
            this.qrResultId = stringFormatted[0].slice(9, lengthId);

            /* Placa */
            lengthPlate = stringFormatted[1].length;
            this.qrResultPlate = stringFormatted[1].slice(7, lengthPlate);

            /* Publicación */
            this.qrResultTripId = stringFormatted[2].slice(8, -1);

            this.onClose({
                cedula: this.qrResultId,
                placa: this.qrResultPlate,
                tripId: this.qrResultTripId,
            });
        }
    }

    public onDeviceSelectChange(selected: string) {
        const device = this.availableDevices.find((x) => x.deviceId === selected);
        this.currentDevice = device || null;
    }

    public onHasPermission(has: boolean) {
        this.hasPermission = has;
    }

    public onTorchCompatible(isCompatible: boolean): void {
        this.torchAvailable$.next(isCompatible || false);
    }

    public toggleTorch(): void {
        this.torchEnabled = !this.torchEnabled;
    }
}
