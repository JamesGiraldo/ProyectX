import Swal from 'sweetalert2';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Driver } from '@apptypes/entities/index';
import { DriverService } from '@services/driver.service';
import { ModalNewdriverComponent } from '../modal-newdriver/modal-newdriver.component';
import { OwnershipDriver } from '../../../../types/enums/ownership.enum';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalDetailsFilesComponent } from 'src/app/components/modal-details-files/modal-details-files.component';
import { HandleErrorService } from '@services/handle-error.service';

@Component({
    selector: '[driver-detail]',
    templateUrl: './driver-detail.component.html',
    styleUrls: ['./driver-detail.component.scss'],
})
export class DriverDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('driver') driver: Driver;
    @Input('columns') columns: any[];
    @Input('showActions') showActions: boolean = false;
    @Output() refresh = new EventEmitter<boolean>();
    public ratings: string[];
    public countDocuments: number;
    public ownership = OwnershipDriver;

    constructor(
        public dialog: MatDialog,
        private driverService: DriverService,
        private handleErrorService: HandleErrorService,
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.driver) {
            const driver = <Driver>changes.driver.currentValue;
            this.ratings = this.generateRatings(driver.rating);
        }
    }

    public generateRatings(rating: number): string[] {
        const floor = Math.floor(rating);
        const ceil = Math.ceil(rating);
        let ratings: string[] = [];
        for (let index: number = 0; index < ceil; index++) {
            index < floor ? ratings.push('star') : ratings.push('star_half');
        }
        if (ratings.length < 5) {
            for (let index: number = ratings.length - 1; index < 4; index++) {
                ratings.push('star_border');
            }
        }
        return ratings;
    }

    public openDialog(): void {
        this.dialog
            .open(ModalNewdriverComponent, {
                width: '700px',
                height: '580px',
                disableClose: true,
                data: { driver: this.driver, refresh: false },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.refresh) this.refresh.emit(true);
            });
    }

    public openDialogDetailsFiles(type: string): void {
        this.dialog
            .open(ModalDetailsFilesComponent, {
                width: '750px',
                height: '450px',
                disableClose: true,
                data: { data: { type: type, data: this.driver } },
            })
            .afterClosed()
            .subscribe((result) => {
                this.refresh.emit(true);
            });
    }

    public async removeDriver(id: any) {
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
                this.driverService.deleteDriver(id).subscribe(
                    (res) => {
                        if (res.code >= 1000) {
                            Swal.fire('Eliminado!', 'El conductor fue eliminado exitosamente.', 'success');
                            this.refresh.emit(true);
                        } else {
                            this.handleErrorService.onFailure(res);
                        }
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            }
            this.blockUI.stop();
        });
    }

    get driverName() {
        return this.driver.firstName !== '' ? `${this.driver.firstName} ${this.driver.lastName}` : 'N/A';
    }
    get obj() {
        return JSON.stringify(this.driver);
    }
}
