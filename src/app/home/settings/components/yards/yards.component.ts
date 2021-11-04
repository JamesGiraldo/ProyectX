import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ModalNewfactoryComponent } from './modal-newfactory/modal-newfactory.component';
import { YardService } from '@services/index';

@Component({
    selector: 'app-yards',
    templateUrl: './yards.component.html',
    styleUrls: ['./yards.component.scss'],
})
export class YardsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public factories = [];

    constructor(public dialog: MatDialog, private readonly yardService: YardService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.getFactories();
    }

    public openDialog() {
        this.dialog
            .open(ModalNewfactoryComponent, {
                width: '700px',
                height: '630px',
                disableClose: true,
                data: { data: '' },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) this.getFactories();
            });
    }

    public refresh($event) {
        if ($event) this.getFactories();
    }

    private getFactories() {
        this.yardService.getAll().subscribe((res) => {
            this.factories = [...res.data];
            this.blockUI.stop();
        });
    }
}
