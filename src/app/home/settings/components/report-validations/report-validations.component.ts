import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthenticationService, CompanyService, GlobalService, HandleErrorService } from '@services/index';
import { User } from '@apptypes/entities';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-report-validations',
    templateUrl: './report-validations.component.html',
    styleUrls: ['./report-validations.component.scss'],
})
export class ReportValidationsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public configForm: FormGroup;
    public user: User;

    constructor(
        private formBuilder: FormBuilder,
        private readonly authService: AuthenticationService,
        private readonly companyService: CompanyService,
        private readonly globalService: GlobalService,
        private handleErrorService: HandleErrorService,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        const token = this.globalService.getToken();
        this.user = this.authService.getDecodedAccessToken(token);
        this.getValidationsReport(this.user.company.id);
    }

    public onSubmit() {
        const data = {
            requiredFiles: this.configForm.get('required_files').value,
            notRetryReport: this.configForm.get('blockage').value,
            verifyCompliments: this.configForm.get('verifyCompliments').value,
            estimatedDays: this.configForm.get('estimatedDays').value,
        };
        this.blockUI.start('Loading...');
        this.companyService.updateValidationReport(this.user.company.id, data).subscribe(
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
        this.configForm = this.formBuilder.group({
            required_files: [''],
            blockage: [''],
            verifyCompliments: [''],
            estimatedDays: [''],
        });
    }

    private getValidationsReport(id: number) {
        this.companyService.getValidationReport(id).subscribe((res) => {
            this.patchValue(res.data);
            this.blockUI.stop();
        });
    }

    private patchValue(data: any) {
        this.configForm.patchValue({
            required_files: data.requiredFiles,
            blockage: data.notRetryReport,
            verifyCompliments: data.verifyCompliments,
            estimatedDays: data.estimatedDays,
        });
    }
}
