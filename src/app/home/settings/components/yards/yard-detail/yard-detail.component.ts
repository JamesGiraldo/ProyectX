import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalNewfactoryComponent } from '../modal-newfactory/modal-newfactory.component';
import { ModalNewstageComponent } from '../modal-newstage/modal-newstage.component';
import { YardService } from '@services/yard.service';
import { HandleErrorService } from '@services/handle-error.service';

@Component({
    selector: 'app-yard-detail',
    templateUrl: './yard-detail.component.html',
    styleUrls: ['./yard-detail.component.scss'],
})
export class YardDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('factory') factory;
    @Output() refresh = new EventEmitter<boolean>();
    public stages = [];

    constructor(
        private dialog: MatDialog,
        private readonly yardService: YardService,
        private handleErrorService: HandleErrorService,
    ) {}

    ngOnInit(): void {}

    public addStage() {
        this.dialog
            .open(ModalNewstageComponent, {
                width: '850px',
                height: '420px',
                disableClose: true,
                data: { id: this.factory.id, data: null, refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) this.refresh.emit(true);
            });
    }

    public convertTimeElapsed(timeMs: number) {
        let hours = Math.floor((+timeMs / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((+timeMs % 3600000) / 60000);
        let seconds = Math.floor((+timeMs / 1000) % 60);

        return hours + 'h ' + minutes + 'm ' + seconds + 's';
    }

    public drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.stages, event.previousIndex, event.currentIndex);
        const order = event.currentIndex + 1;
        for (let index = 0; index < this.stages.length; index++) {
            const element = this.stages[index];
            const orderDefault = index + 1;

            if (event.currentIndex === index)
                this.yardService
                    .updateStage(+element.id, {
                        order: order,
                    })
                    .subscribe(() => {});
            else
                this.yardService
                    .updateStage(+element.id, {
                        order: orderDefault,
                    })
                    .subscribe(() => {});
        }
    }

    public editFactory(factory) {
        this.dialog
            .open(ModalNewfactoryComponent, {
                width: '700px',
                height: '530px',
                disableClose: true,
                data: { data: factory, refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) this.refresh.emit(true);
            });
    }

    public editStage(stage, yard) {
        this.dialog
            .open(ModalNewstageComponent, {
                width: '750px',
                height: '300px',
                disableClose: true,
                data: { id: null, data: stage, yard: yard, refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) this.refresh.emit(true);
            });
    }

    public getStages() {
        this.yardService.getById(this.factory.id).subscribe((res) => {
            this.stages = [...res.data.stages].sort((a, b) => a.order - b.order);
        });
    }

    public async removeFactory(id: any) {
        await Swal.fire({
            title: 'Está seguro?',
            text: 'Sí elimina el registro no lo podrá recuperar!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, deseo eliminar!',
        }).then((result) => {
            if (result.value) {
                this.blockUI.start('Loading...');
                this.yardService.delete(id).subscribe(
                    () => {
                        Swal.fire('Eliminado!', 'La planta fue eliminada exitosamente.', 'success');
                        this.refresh.emit(true);
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            }
            this.blockUI.stop();
        });
    }

    public async removeStage(id) {
        await Swal.fire({
            title: 'Está seguro?',
            text: 'Sí elimina el registro no lo podrá recuperar!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, deseo eliminar!',
        }).then((result) => {
            if (result.value) {
                this.blockUI.start('Loading...');
                this.yardService.deleteStage(id).subscribe(() => {
                    Swal.fire('Eliminado!', 'La etapa fue eliminada exitosamente.', 'success');
                    this.refresh.emit(true);
                });
            }
            this.blockUI.stop();
        });
    }
}
