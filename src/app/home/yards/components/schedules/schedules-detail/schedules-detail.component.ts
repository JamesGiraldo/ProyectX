import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalRescheduleComponent } from 'src/app/components/modal-reschedule/modal-reschedule.component';

@Component({
    selector: '[schedule-detail]',
    templateUrl: './schedules-detail.component.html',
    styleUrls: ['./schedules-detail.component.scss'],
})
export class SchedulesDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input('shift') shift: any;

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {}

    public openDialogReschedule() {
        this.dialog
            .open(ModalRescheduleComponent, {
                width: '400px',
                height: '350px',
                disableClose: true,
                data: { id: this.shift.id, yard: this.shift.yard?.id, name: this.shift.yard?.name },
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    public formatTime(time: any) {
        let formatted = new Date(time).toUTCString();

        return formatted;
    }
}
