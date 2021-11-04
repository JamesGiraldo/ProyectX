import Swal from 'sweetalert2';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';

import { InterventedRoute } from '@apptypes/entities';
import { InterventedRouteService, HandleErrorService } from '@services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-intervented-route-detail',
    templateUrl: './intervented-route-detail.component.html',
    styleUrls: ['./intervented-route-detail.component.scss'],
})
export class InterventedRouteDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('interventedRoute') interventedRoute: InterventedRoute;
    @Output() remove: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private interventedRouteService: InterventedRouteService,
        private handleErrorService: HandleErrorService,
    ) {}

    ngOnInit(): void {}

    removeInterventedRoute(routeId: number) {
        Swal.fire({
            title: '¿Estas seguro que deseas remover esta ruta intervenida?',
            text: '¡Esta accion es irreversible!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remover',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.blockUI.start('Loading...');
                this.interventedRouteService.remove(routeId).subscribe((res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe(() => {});

                    if (res.code == 1035) {
                        this.remove.emit(routeId);
                    }
                });
            }
            this.blockUI.start('Loading...');
            this.blockUI.stop();
        });
    }
}
