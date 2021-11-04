import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

import { AuthenticationService, PublicationService, TripService, GlobalService } from '@services/index';

@Component({
    selector: 'app-modal-columns',
    templateUrl: './modal-columns.component.html',
    styleUrls: ['./modal-columns.component.scss'],
})
export class ModalColumnsComponent implements OnInit {
    public columns = [];
    public tokenInfo;

    constructor(
        public dialogRef: MatDialogRef<ModalColumnsComponent>,
        private publicationService: PublicationService,
        private globalService: GlobalService,
        private authService: AuthenticationService,
        private tripService: TripService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        const token = this.globalService.getToken();
        this.tokenInfo = this.authService.getDecodedAccessToken(token);
        this.router.url === '/requests'
            ? this.getColumnsPublication(this.tokenInfo.id)
            : this.getColumnsTrip(this.tokenInfo.id);
    }

    public onClose() {
        this.dialogRef.close(true);
    }

    public drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
        const order = event.currentIndex + 1;
        for (let index = 0; index < this.columns.length; index++) {
            const element = this.columns[index];
            const orderDefault = index + 1;

            if (event.currentIndex === index)
                this.publicationService
                    .setColumns(this.tokenInfo.id, {
                        columnDisplays: [
                            {
                                id: element.id,
                                order: order,
                            },
                        ],
                    })
                    .subscribe(() => {});
            else
                this.publicationService
                    .setColumns(this.tokenInfo.id, {
                        columnDisplays: [
                            {
                                id: element.id,
                                order: orderDefault,
                            },
                        ],
                    })
                    .subscribe(() => {});
        }
    }

    public setColumnsToDisplay(column) {
        this.publicationService
            .setColumns(this.tokenInfo.id, {
                columnDisplays: [
                    {
                        id: column.option.value.id,
                        isEnabled: column.option.selected,
                    },
                ],
            })
            .subscribe(() => {});
    }

    private getColumnsPublication(id) {
        this.publicationService.getColumns(id).subscribe((res) => {
            this.columns = [...res.data].sort((a: any, b: any) => {
                if (a.order < b.order) {
                    return -1;
                } else if (b.order > a.order) {
                    return 1;
                } else {
                    return 0;
                }
            });
        });
    }

    private getColumnsTrip(id) {
        this.tripService.getColumns(id).subscribe((res) => {
            this.columns = [...res.data].sort((a: any, b: any) => {
                if (a.order < b.order) {
                    return -1;
                } else if (b.order > a.order) {
                    return 1;
                } else {
                    return 0;
                }
            });
        });
    }
}
