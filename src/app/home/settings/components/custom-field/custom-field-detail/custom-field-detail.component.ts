import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { CustomField } from '@entities/index';
import { CustomFieldService, HandleErrorService } from '@services/index';
import { Module } from '@apptypes/enums';
import { ModalNewCustomFieldComponent } from '../modal-new-custom-field/modal-new-custom-field.component';

@Component({
    selector: '[custom-field-detail]',
    templateUrl: './custom-field-detail.component.html',
    styleUrls: ['./custom-field-detail.component.scss'],
})
export class CustomFieldDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('customField') customField: CustomField;
    @Output() remove: EventEmitter<number> = new EventEmitter<number>();
    @Output() update: EventEmitter<boolean> = new EventEmitter<boolean>();
    public module = Module;

    constructor(
        private customFieldService: CustomFieldService,
        private handleErrorService: HandleErrorService,
        public dialog: MatDialog,
    ) {}

    ngOnInit(): void {}

    getListOptions() {
        if (this.customField.options.length > 0) {
            const values = this.customField.options.map((cfo) => cfo.value);
            return values.join('\n');
        }
        return '';
    }

    editCustomField() {
        this.dialog
            .open(ModalNewCustomFieldComponent, {
                width: '850px',
                height: '600px',
                disableClose: true,
                data: this.customField,
            })
            .afterClosed()
            .subscribe((result) => {
                this.update.emit(true);
            });
    }

    removeCustomField() {
        Swal.fire({
            title: '¿Estas seguro que deseas remover este campo personalizado?',
            text:
                'En caso de querer añadir este campo personalizado nuevamente se tendra que hacer la solicitud nuevamente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remover',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.blockUI.start('Loading...');
                this.customFieldService.remove(this.customField.id).subscribe(
                    (res) => {
                        this.handleErrorService.controlError(res);
                        this.handleErrorService.closeEnd$.pipe(take(1)).subscribe(() => {});

                        if (res.code == 1138) {
                            this.remove.emit(this.customField.id);
                        }
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            }
            this.blockUI.stop();
        });
    }
}
