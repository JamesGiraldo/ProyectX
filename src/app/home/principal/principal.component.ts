import { Component, OnInit, AfterViewInit } from '@angular/core';

import { StatusList } from '@apptypes/entities/status-list';
import { Item } from '@apptypes/entities/status-item';

@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit, AfterViewInit {
    public routesStatusList: StatusList;
    public routesCount: number = 5;

    constructor() {}

    ngOnInit(): void {
        this.routesStatusList = new StatusList();
        this.routesStatusList.add(new Item(0, 'En ruta', true));
        this.routesStatusList.add(new Item(1, 'Finalizado'));
        this.routesStatusList.add(new Item(2, 'Todas'));
    }

    ngAfterViewInit() {}

    toggleStatus(id: number) {
        for (let status of this.routesStatusList.items) {
            status.isActive = false;
            if (status.id == id) status.isActive = true;
        }
    }
}
