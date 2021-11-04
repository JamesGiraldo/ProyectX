import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Fare, InterventedRoute } from '@apptypes/entities';
import { InterventedRouteService } from '@services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalNewInterventedRouteComponent } from './modal-new-intervented-route/modal-new-intervented-route.component';

@Component({
    selector: 'app-intervented-route',
    templateUrl: './intervented-route.component.html',
    styleUrls: ['./intervented-route.component.scss'],
})
export class InterventedRouteComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public colNames: string[];
    public translateKeys: string[] = ['TRANSPORTER', 'ROUTE', 'DATE'];
    public empty: boolean;
    public interventedRoutes: InterventedRoute[];
    public displayRoutes: InterventedRoute[];
    public fareData: Fare;

    constructor(public dialog: MatDialog, private interventedRouteService: InterventedRouteService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.setColumnNames();
        this.getInterventedRoutes();
    }

    setColumnNames() {
        this.colNames = [];
        for (let index = 0; index < this.translateKeys.length; index++) {
            this.colNames.push(`GENERAL_WORD.${this.translateKeys[index]}`);
        }
    }

    /**
     * EVENT HANDLERS
     */
    public openDialog() {
        this.dialog
            .open(ModalNewInterventedRouteComponent, {
                width: '850px',
                height: '600px',
                disableClose: true,
                data: new InterventedRoute(),
            })
            .afterClosed()
            .subscribe((result) => {
                this.getInterventedRoutes();
            });
    }

    removeInterventedRoute(routeId: number) {
        const indexToRemoveSource = this.interventedRoutes.findIndex((ir) => ir.id == routeId);
        const indexToRemoveDisplay = this.displayRoutes.findIndex((ir) => ir.id == routeId);
        this.interventedRoutes.splice(indexToRemoveSource, 1);
        this.displayRoutes.splice(indexToRemoveDisplay, 1);
    }

    /**
     * API CALLS
     */
    private getInterventedRoutes(): void {
        this.interventedRouteService.getInterventedRoutes().subscribe((res) => {
            this.interventedRoutes = [...res.data.records];
            this.displayRoutes = [...res.data.records];
            res.data.elementsPerPage > 0 ? (this.empty = false) : (this.empty = true);
            this.blockUI.stop();
        });
    }
}
