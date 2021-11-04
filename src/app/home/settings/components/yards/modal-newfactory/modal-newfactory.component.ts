import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Options } from '@angular-slider/ngx-slider';
import { take } from 'rxjs/operators';

import { ModalMapComponent } from 'src/app/home/companies/components/modal-map/modal-map.component';
import { YardService, HandleErrorService } from '@services/index';
import { ToastrService } from 'ngx-toastr';
import { Weekday } from '@apptypes/enums/day.enum';

@Component({
    selector: 'app-modal-newfactory',
    templateUrl: './modal-newfactory.component.html',
    styleUrls: ['./modal-newfactory.component.scss'],
})
export class ModalNewfactoryComponent implements OnInit {
    private closeRef: boolean;
    public submit: boolean = false;
    public factoryForm: FormGroup;
    public lat: string = '';
    public lng: string = '';
    public options: Options = {
        floor: 0,
        ceil: 100,
        step: 1,
    };
    public occupancyMaximun = 0;
    public occupancyMinimun = 0;
    public range: boolean = true;
    public schedulesArray = [];
    public timeInvalid = [];
    public days = Weekday;

    constructor(
        @Inject(MAT_DIALOG_DATA) public factoryData: any,
        private formBuilder: FormBuilder,
        private handleErrorService: HandleErrorService,
        private yardService: YardService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ModalNewfactoryComponent>,
        private toastr: ToastrService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        if (this.factoryData.data !== '') this.patchValue(this.factoryData.data);
        this.checkRange(this.occupancyMinimun, this.occupancyMaximun);
    }

    get f() {
        return this.factoryForm.controls;
    }

    get getSchedules() {
        return this.factoryForm.get('schedules') as FormArray;
    }

    public addSchedule() {
        const control = <FormArray>this.factoryForm.controls['schedules'];
        control.push(
            this.formBuilder.group({
                id: [],
                day: ['', [Validators.required]],
                startTime: ['', [Validators.required]],
                endTime: ['', [Validators.required]],
            }),
        );
    }

    public removeSchedule(index: number) {
        const control = <FormArray>this.factoryForm.controls['schedules'];
        control.removeAt(index);
    }

    public onClose(refresh?: boolean) {
        this.dialogRef.close(refresh);
    }

    public sliderMaximun($event) {
        this.occupancyMaximun = $event;

        this.checkRange(this.occupancyMinimun, this.occupancyMaximun);
    }

    public sliderMinimun($event) {
        this.occupancyMinimun = $event;

        this.checkRange(this.occupancyMinimun, this.occupancyMaximun);
    }

    private checkRange(rangeMin: number, rangeMax: number) {
        if (rangeMin > 0 && rangeMax < 100 && rangeMin !== rangeMax) {
            return (this.range = true);
        } else {
            return (this.range = false);
        }
    }

    public onSubmit() {
        if (this.factoryForm.invalid) {
            return;
        }

        this.fillArray();

        if (this.timeInvalid.length > 0) {
            this.toastr.error(
                'El horario inicial debe ser menor al horario final. Por favor, verifique los horarios.',
                'Error de operación',
                {
                    timeOut: 2500,
                },
            );
        } else {
            const data = {
                yard: {
                    vehicleLimit: +this.factoryForm.get('vehicleLimit').value,
                    name: this.factoryForm.get('name').value,
                    latitude: this.lat,
                    longitude: this.lng,
                    occupancyMaximun: this.occupancyMaximun,
                    occupancyMinimun: this.occupancyMinimun,
                },
                schedules: this.schedulesArray,
            };

            if (this.factoryData.data.id) {
                this.yardService.update(this.factoryData.data.id, data).subscribe(
                    (res) => {
                        this.handleErrorService.controlError(res);
                        this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                            this.closeRef = res;
                            if (this.closeRef) this.onClose(true);
                            this.submit = false;
                        });
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            } else {
                this.yardService.create(data).subscribe(
                    (res) => {
                        this.handleErrorService.controlError(res);
                        this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                            this.closeRef = res;
                            if (this.closeRef) this.onClose(true);
                            this.submit = false;
                        });
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
            }
        }
    }

    public openDialogMap() {
        this.dialog
            .open(ModalMapComponent, {
                width: '900px',
                height: '600px',
                disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {
                this.lat = result.lat;
                this.lng = result.lng;
                this.factoryForm.get('ubication').setValue(result.lat + ',' + result.lng);
            });
    }

    private createForm() {
        this.factoryForm = this.formBuilder.group({
            vehicleLimit: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
            name: ['', [Validators.required]],
            ubication: [{ value: '', disabled: true }],
            schedules: this.formBuilder.array([]),
        });

        this.addSchedule();
    }

    private fillArray() {
        let hash = {};
        this.schedulesArray = [];
        this.timeInvalid = [];
        this.getSchedules.value.forEach((schedule) => {
            this.schedulesArray.push({
                id: schedule.id === '' ? '' : schedule.id,
                yardId: this.factoryData.data.id,
                day: schedule.day,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
            });
        });

        this.schedulesArray = this.schedulesArray.filter((element) =>
            hash[element.startTime] ? false : (hash[element.startTime] = true),
        );
        this.schedulesArray = this.schedulesArray.filter((element) =>
            hash[element.endTime] ? false : (hash[element.endTime] = true),
        );

        this.schedulesArray.forEach((x) => {
            if (x.startTime > x.endTime) {
                this.timeInvalid.push(true);
            }
        });
    }

    private updateOptions(data) {
        const optionControl = this.factoryForm.controls['schedules'] as FormArray;
        for (let controlIndex = optionControl.length - 1; controlIndex >= 0; controlIndex--) {
            this.removeSchedule(controlIndex);
        }

        const options = data?.schedules.map((o) => o);
        for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
            this.addSchedule();
            optionControl.at(optionIndex).setValue({
                id: options[optionIndex]?.id,
                day: options[optionIndex].day,
                startTime: options[optionIndex].startTime,
                endTime: options[optionIndex].endTime,
            });
        }
    }

    private patchValue(data) {
        this.occupancyMaximun = data.occupancyMaximun;
        this.occupancyMinimun = data.occupancyMinimun;
        this.updateOptions(data);
        this.factoryForm.patchValue({
            vehicleLimit: data.vehicleLimit,
            name: data.name,
        });
    }
}
