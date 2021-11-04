import { Component, Inject, OnInit, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMatColorPickerInput, Color } from '@angular-material-components/color-picker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { HandleErrorService, PublicationService, YardService } from '@services/index';
import { ModalVehiclesTimeComponent } from '../modal-vehicles-time/modal-vehicles-time.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-modal-newstage',
    templateUrl: './modal-newstage.component.html',
    styleUrls: ['./modal-newstage.component.scss'],
})
export class ModalNewstageComponent implements OnInit {
    @ViewChild(NgxMatColorPickerInput, { static: false }) pickerInput: NgxMatColorPickerInput;
    @Output() refresh = new EventEmitter<boolean>();
    private closeRef: boolean;
    public order: number;
    public stageForm: FormGroup;
    public stages = [];
    public stagesArray = [];
    public submit: boolean = false;
    public timeVehicles: any[] = [];
    public timeVehiclesEdit: any[] = [];
    public postionReplace = {
        fourWheelDrive: 0,
        lowBoyTruck: 0,
        simple: 0,
        timeUnit: 'TIME_UNIT.MINUTE',
        trunkingRig: 0,
        trunkingRigMini: 0,
        turbo: 0,
    };
    public stateModal = [null];

    constructor(
        @Inject(MAT_DIALOG_DATA) public factory: any,
        private formBuilder: FormBuilder,
        private handleErrorService: HandleErrorService,
        private yardService: YardService,
        public dialogRef: MatDialogRef<ModalNewstageComponent>,
        private changeRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private toastr: ToastrService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.factory.id !== null ? this.verifyOrder() : this.patchValue(this.factory.data);
    }

    ngAfterViewChecked(): void {
        this.changeRef.detectChanges();
    }

    ngAfterViewInit(): void {
        const temp = this.hexToRgb(this.getStages.at(0).get('color').value);
        if (temp !== null) this.pickerInput.value = new Color(temp.r, temp.g, temp.b);
    }

    get getStages() {
        return this.stageForm.get('stages') as FormArray;
    }

    public addstage() {
        const control = <FormArray>this.stageForm.controls['stages'];
        control.push(
            this.formBuilder.group({
                name: ['', [Validators.required]],
                color: ['', [Validators.required]],
                timeEstimated: [''],
            }),
        );
        this.timeVehicles.push(this.postionReplace);
        this.stateModal.push(null);
    }

    public onClose(refresh?: boolean) {
        this.dialogRef.close(refresh);
    }

    public openDialogVehiclesTypes(index: number) {
        this.dialog
            .open(ModalVehiclesTimeComponent, {
                width: '750px',
                height: '660px',
                disableClose: true,
                data: '',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.toastr.success(
                        `Tiempos agregados a los vehículos de la etapa ${this.getStages.at(index).get('name').value}`,
                        'Operación exitosa!',
                        {
                            timeOut: 2500,
                        },
                    );
                    this.addTimes(index, this.timeVehicles, result);
                    this.addTimes(index, this.stateModal, result);
                }
            });
    }

    public openDialogEditVehiclesTypes() {
        this.timeVehiclesEdit = [];
        this.dialog
            .open(ModalVehiclesTimeComponent, {
                width: '750px',
                height: '660px',
                disableClose: true,
                data: this.factory.data?.averageTimes,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.toastr.success(
                        `Tiempos editados a los vehículos de la etapa ${this.getStages.at(0).get('name').value}`,
                        'Operación exitosa!',
                        {
                            timeOut: 2500,
                        },
                    );

                    this.timeVehiclesEdit = result;
                }
            });
    }

    public onSubmit() {
        if (this.stageForm.invalid) {
            return;
        }

        this.fillArray();
        this.verifyArray(this.timeVehicles);

        const data = {
            name: this.getStages.at(0).get('name').value,
            color: this.getStages.at(0).get('color').value.hex,
            yardId: this.factory.yard,
            timeEstimated: +this.getStages.at(0).get('timeEstimated').value,
            averageTimes: this.timeVehiclesEdit,
        };

        if (this.factory.data?.id) {
            this.yardService.updateStage(+this.factory.data.id, data).subscribe(
                (res) => {
                    this.handleErrorService.controlError(res);
                    this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                        this.closeRef = res;
                        if (this.closeRef) this.onClose(true);
                        this.submit = false;
                    });
                },
                () => {
                    this.stagesArray = [];
                    this.timeVehicles = [];
                },
            );
        } else {
            this.yardService
                .createStage(+this.factory.id, { stages: this.stagesArray, times: this.timeVehicles })
                .subscribe(
                    (res) => {
                        this.handleErrorService.controlError(res);
                        this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                            this.closeRef = res;
                            if (this.closeRef) this.onClose(true);
                            this.submit = false;
                        });
                    },
                    () => {
                        this.stagesArray = [];
                        this.timeVehicles = [];
                    },
                );
        }

        this.stagesArray = [];
        this.timeVehicles = [];
    }

    private addTimes(index: number, array: any, value: any) {
        return (array[index] = value);
    }

    public removeStage(index: number) {
        this.timeVehicles.splice(index, 1);
        this.stateModal.splice(index, 1);
        const control = <FormArray>this.stageForm.controls['stages'];

        control.removeAt(index);
    }

    public removeState(index: number) {
        delete this.stateModal[index];
        delete this.timeVehicles[index];
    }

    private verifyArray(arrayTimes) {
        for (let index = 0; index < arrayTimes.length; index++) {
            if (arrayTimes[index] === undefined || arrayTimes[index] === null) {
                arrayTimes[index] = this.postionReplace;
            }
        }
    }

    private createForm() {
        this.stageForm = this.formBuilder.group({
            stages: this.formBuilder.array([]),
        });

        this.addstage();
    }

    private hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    }

    private verifyOrder() {
        this.yardService.getById(this.factory.id).subscribe((res) => {
            this.stages = [...res.data.stages].sort((a, b) => a.order - b.order);

            this.stages.filter((x) => {
                this.order = Math.max(x.order);
            });
        });
    }

    private fillArray() {
        this.getStages.value.forEach((stage, i) => {
            this.stateModal.push(i);
            let index = i + 1;
            let order = this.order + index;
            this.stagesArray.push({
                name: stage.name,
                color: stage.color.hex,
                order: this.order ? order : index,
            });
        });
    }

    public patchValue(data) {
        this.getStages.patchValue([
            {
                name: data.name,
                color: data.color,
                timeEstimated: data.timeEstimated,
            },
        ]);
    }
}
