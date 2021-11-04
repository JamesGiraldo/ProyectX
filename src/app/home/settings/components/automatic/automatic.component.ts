import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { Assigment, User } from '@apptypes/entities/index';
import {
    UserService,
    GlobalService,
    AuthenticationService,
    HandleErrorService,
    PublicationService,
} from '@services/index';

@Component({
    selector: 'app-automatic',
    templateUrl: './automatic.component.html',
    styleUrls: ['./automatic.component.scss'],
})
export class AutomaticComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public configAssigment: Assigment;
    public configForm: FormGroup;
    public hours: number;
    public loading: boolean = false;
    public minutes: number;
    public submit: boolean = false;
    public user: User;

    constructor(
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private handleErrorService: HandleErrorService,
        private publicationService: PublicationService,
        private userService: UserService,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        this.loading = true;
        const token = this.globalService.getToken();
        this.user = this.authService.getDecodedAccessToken(token);
        this.getUserConfig(this.user);
    }

    get f() {
        return this.configForm.controls;
    }

    //// To be improved
    public changeFare() {
        this.configForm.controls['priorityFare'].disabled
            ? this.configForm.controls['priorityFare'].enable()
            : this.configForm.controls['priorityFare'].disable();
    }

    public changeResponse() {
        this.configForm.controls['priorityResponse'].disabled
            ? this.configForm.controls['priorityResponse'].enable()
            : this.configForm.controls['priorityResponse'].disable();
    }

    public changeRoute() {
        this.configForm.controls['priorityRoute'].disabled
            ? this.configForm.controls['priorityRoute'].enable()
            : this.configForm.controls['priorityRoute'].disable();
    }

    public changeTolerance() {
        if (this.configForm.controls['priorityTolerance'].disabled) {
            this.configForm.controls['priorityTolerance'].enable();
            this.configForm.controls['toleranceTimeHour'].enable();
            this.configForm.controls['toleranceTimeMinute'].enable();
        } else {
            this.configForm.controls['priorityTolerance'].disable();
            this.configForm.controls['toleranceTimeHour'].disable();
            this.configForm.controls['toleranceTimeMinute'].disable();
        }
    }

    public changeWait() {
        if (this.configForm.controls['waitTimeHour'].disabled) {
            this.configForm.controls['waitTimeHour'].enable();
            this.configForm.controls['waitTimeMinute'].enable();
        } else {
            this.configForm.controls['waitTimeHour'].disable();
            this.configForm.controls['waitTimeMinute'].disable();
        }
    }

    public onSubmit() {
        let waitTime = this.publicationService.convertToMilliseconds(
            this.configForm.get('waitTimeHour').value,
            this.configForm.get('waitTimeMinute').value,
        );
        let toleranceTime = this.publicationService.convertToMilliseconds(
            this.configForm.get('toleranceTimeHour').value,
            this.configForm.get('toleranceTimeMinute').value,
        );

        const data = {
            aaConfig: {
                id: this.configAssigment.id,
                ownerId: this.configAssigment.ownerId,
                isEnabled: this.configForm.get('isEnabled').value,
                waitTime: waitTime,
                toleranceTime: toleranceTime,
            },
            aaFilters: [
                {
                    id: this.configAssigment.filters[0].id,
                    aaConfigurationId: this.configAssigment.id,
                    isEnabled: this.configForm.get('enabledTolerance').value,
                    priority: this.configForm.get('priorityTolerance').value,
                    type: this.configAssigment.filters[0].type,
                },
                {
                    id: this.configAssigment.filters[1].id,
                    aaConfigurationId: this.configAssigment.id,
                    isEnabled: this.configForm.get('enabledRoute').value,
                    priority: this.configForm.get('priorityRoute').value,
                    type: this.configAssigment.filters[1].type,
                },
                {
                    id: this.configAssigment.filters[2].id,
                    aaConfigurationId: this.configAssigment.id,
                    isEnabled: this.configForm.get('enabledFare').value,
                    priority: this.configForm.get('priorityFare').value,
                    type: this.configAssigment.filters[2].type,
                },
                {
                    id: this.configAssigment.filters[3].id,
                    aaConfigurationId: this.configAssigment.id,
                    isEnabled: this.configForm.get('enabledResponse').value,
                    priority: this.configForm.get('priorityResponse').value,
                    type: this.configAssigment.filters[3].type,
                },
            ],
        };

        this.submit = true;
        this.blockUI.start('Loading...');
        this.userService.updateAssigment(this.user, data).subscribe(
            (res) => {
                this.handleErrorService.controlError(res);
                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe(() => {
                    this.submit = false;
                });
            },
            (err) => {
                this.handleErrorService.onFailure(err);
                this.submit = false;
            },
        );
      this.blockUI.stop();
    }

    private createForm() {
        this.configForm = this.formBuilder.group({
            ownerId: [''],
            toleranceTime: [''],
            toleranceTimeHour: [''],
            toleranceTimeMinute: [''],
            isEnabled: [''],
            waitTime: [''],
            waitTimeHour: [''],
            waitTimeMinute: [''],
            idFilter: [''],
            aaConfigurationId: [''],
            enabledTolerance: [''],
            enabledRoute: [''],
            enabledFare: [''],
            enabledResponse: [''],
            priorityTolerance: [''],
            priorityRoute: [''],
            priorityFare: [''],
            priorityResponse: [''],
            type: [''],
        });
    }

    private getUserConfig(id: User) {
        let filters;
        this.userService.getAssignment(id).subscribe((res) => {
            this.configAssigment = res.data;
            filters = res.data?.filters;

            //// To be improved
            if (!this.configAssigment.isEnabled) {
                this.configForm.controls['waitTimeHour'].disable();
                this.configForm.controls['waitTimeMinute'].disable();
            }
            if (filters[0].type === 'tolerance_time' && !filters[0].isEnabled) {
                this.configForm.controls['priorityTolerance'].disable();
                this.configForm.controls['toleranceTimeHour'].disable();
                this.configForm.controls['toleranceTimeMinute'].disable();
            }

            filters[1].type === 'intervented_routes' && !filters[1].isEnabled
                ? this.configForm.controls['priorityRoute'].disable()
                : '';

            filters[2].type === 'fare_value' && !filters[2].isEnabled
                ? this.configForm.controls['priorityFare'].disable()
                : '';

            filters[3].type === 'response_time' && !filters[3].isEnabled
                ? this.configForm.controls['priorityResponse'].disable()
                : '';

            this.loading = false;
            this.patchValue(this.configAssigment);
        });
    }

    private patchValue(data) {
        let waitTimeHour = this.publicationService.convertFromMilliseconds(data.waitTime).hours;
        let waitTimeMinute = this.publicationService.convertFromMilliseconds(data.waitTime).minutes;

        let toleranceTimeHour = this.publicationService.convertFromMilliseconds(data.toleranceTime).hours;
        let toleranceTimeMinute = this.publicationService.convertFromMilliseconds(data.toleranceTime).minutes;
        this.configForm.patchValue({
            isEnabled: data.isEnabled,
            waitTimeHour: waitTimeHour,
            waitTimeMinute: waitTimeMinute,
            enabledTolerance: data.filters[0].isEnabled,
            toleranceTimeHour: toleranceTimeHour,
            toleranceTimeMinute: toleranceTimeMinute,
            priorityTolerance: data.filters[0].priority,
            enabledRoute: data.filters[1].isEnabled,
            priorityRoute: data.filters[1].priority,
            enabledFare: data.filters[2].isEnabled,
            priorityFare: data.filters[2].priority,
            enabledResponse: data.filters[3].isEnabled,
            priorityResponse: data.filters[3].priority,
        });

        this.blockUI.stop();
    }
}
