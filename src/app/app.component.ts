import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    public isConnected: boolean = true;
    public status = '✅ The network connection has been restored!';
    public verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    public maticon = '&#xf108;';

    constructor(
        private connectionService: ConnectionService,
        private deviceService: DeviceDetectorService,
        public snackBar: MatSnackBar,
        public translate: TranslateService,
    ) {
        const isDesktopDevice = this.deviceService.isDesktop();
        translate.addLangs(['es', 'en']);
        this.connectionService.monitor().subscribe((isConnected) => {
            this.isConnected = isConnected;

            if (this.isConnected) {
                this.status = '✅ The network connection has been restored!';
                this.snackBar.open(this.status, '', { duration: 5000, panelClass: ['notif-online'] });
            } else {
                this.status = '🚫 The network connection has been lost...';
                this.snackBar.open(this.status, '', { panelClass: ['notif-offline'] });
            }
        });

        /* Comprobar dispositivo usado */
        if (!isDesktopDevice) {
            Swal.fire({
                icon: 'warning',
                title: 'Recomendación importante',
                html: 'Se recomienda usar la plataforma en dispositivos de escritorio (<img src="../assets/pc.svg" width="18" height="18">) para una mejor experiencia!',
                confirmButtonText: 'Entiendo!',
                showConfirmButton: true,
                allowEscapeKey: false,
                allowOutsideClick: false,
            });
        }
    }
}
