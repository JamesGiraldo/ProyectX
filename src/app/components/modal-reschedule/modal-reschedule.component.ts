import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HandleErrorService } from '@services/handle-error.service';
import { YardService } from '@services/yard.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-modal-reschedule',
    templateUrl: './modal-reschedule.component.html',
    styleUrls: ['./modal-reschedule.component.scss'],
})
export class ModalRescheduleComponent implements OnInit {
    public rescheduleForm: FormGroup;
    public submit = false;
    public minDate;
    public yards;
    private closeRef: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ModalRescheduleComponent>,
        private formBuilder: FormBuilder,
        private readonly yardService: YardService,
        private handleErrorService: HandleErrorService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.minDate = this.getFormattedMin();
    }

    get f() {
        return this.rescheduleForm.controls;
    }

    public formatTime(time: any) {
        let formatted = moment(time, 'HH:mm:ss').format('LT');

        return formatted;
    }

    public onClose() {
        this.dialogRef.close(true);
    }

    public onSubmit() {
        if (this.rescheduleForm.invalid) {
            return;
        }

        this.submit = true;

        const data = {
            tripId: this.data.yard,
            report: {
                loadDate: this.rescheduleForm.get('loadDate').value,
                shiftSchedule: this.rescheduleForm.get('shiftSchedule').value,
                vehiclePlate: '',
                driverIdCard: '',
                driverName: '',
                driverPhone: '',
            },
        };

        this.yardService.reschedule(this.data.id, data).subscribe(
            (res) => {
                this.handleErrorService.controlError(res);
                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                    this.closeRef = res;
                    if (this.closeRef) this.onClose();
                    this.submit = false;
                });
            },
            (err) => {
                this.handleErrorService.onFailure(err);
            },
        );
    }

    private createForm() {
        this.rescheduleForm = this.formBuilder.group({
            loadDate: ['', [Validators.required]],
            shiftSchedule: [null, [Validators.required]],
        });
    }

    private getFormattedMin(): string {
        const instant = moment(new Date()).add(1, 'd');
        return instant.format('YYYY-MM-DD');
    }

    public getWeekday() {
        let loadDate = this.rescheduleForm.get('loadDate').value;

        let day = new Date(loadDate).toLocaleDateString('en-us', {
            weekday: 'long',
        });
        this.getSearch(day);
    }

    private getSearch(day) {
        this.yardService.search(this.data.name).subscribe((res) => {
            if (res.code > 1000) {
                this.yards = res.data.schedules?.filter((yard) => yard.day === 'WEEKDAY.' + day.toUpperCase());
            }
        });
    }
}
