import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AuthenticationService, CompanyService, GlobalService, HandleErrorService } from '@services/index';
import { User } from '@apptypes/entities';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public generalForm: FormGroup;
    public user: User;

    constructor(
        private formBuilder: FormBuilder,
        private readonly companyService: CompanyService,
        private readonly globalService: GlobalService,
        private readonly authService: AuthenticationService,
        private handleErrorService: HandleErrorService,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        const token = this.globalService.getToken();
        this.user = this.authService.getDecodedAccessToken(token);
        this.getyearsVehValid(this.user.company.id);
    }

    public onSubmit() {
        this.blockUI.start('Loading...');
        const data = {
            yearsVehValid: this.generalForm.get('yearsVehValid').value,
            reportedVehicles: this.generalForm.get('reportedVehicles').value,
            verifyCourseSecurity: this.generalForm.get('verifyCourseSecurity').value,
            minutesBetweenYards: this.generalForm.get('minutesBetweenYards').value,
            minutesNextShift: this.generalForm.get('minutesNextShift').value,
        };

        this.companyService.updateValidationYear(this.user.company.id, data).subscribe(
            (res) => {
                this.blockUI.stop();
                this.handleErrorService.controlError(res);
            },
            (err) => {
                this.handleErrorService.onFailure(err);
                this.blockUI.stop();
            },
        );
    }

    private createForm() {
        this.generalForm = this.formBuilder.group({
            yearsVehValid: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            reportedVehicles: [''],
            verifyCourseSecurity: [''],
            minutesBetweenYards: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            minutesNextShift: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        });
    }

    private getyearsVehValid(id: number) {
        this.companyService.getAllValidationYear(id).subscribe((res) => {
            this.patchValue(res.data);

            this.blockUI.stop();
        });
    }

    private patchValue(data: any) {
        this.generalForm.patchValue({
            yearsVehValid: data?.yearsVehValid,
            reportedVehicles: data?.reportedVehicles,
            verifyCourseSecurity: data?.verifyCourseSecurity,
            minutesBetweenYards: data?.minutesBetweenYards,
            minutesNextShift: data?.minutesNextShift,
        });
    }
}
