import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalNewpermissionComponent } from '../modal-newpermission/modal-newpermission.component';
import { RightToSee } from '@apptypes/entities';

@Component({
    selector: 'app-permission-detail',
    templateUrl: './permission-detail.component.html',
    styleUrls: ['./permission-detail.component.scss'],
})
export class PermissionDetailComponent implements OnInit {
    @Input('user') user: RightToSee;

    constructor(public dialog: MatDialog) {}

    ngOnInit() {}

    public openDialog() {
        this.dialog.open(ModalNewpermissionComponent, {
            width: '650px',
            height: '500px',
            disableClose: true,
            data: this.user,
        });
    }
}
