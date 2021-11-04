import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CompanyService, HandleErrorService } from '@services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { take } from 'rxjs/internal/operators/take';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-assignament-trips',
    templateUrl: './assignament-trips.component.html',
    styleUrls: ['./assignament-trips.component.scss'],
})
export class AssignamentTripsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    loading: boolean = true;
    public submit: boolean = false;
    public assignamentForm: FormGroup;
    public waitTimes;

    constructor(
        private formBuilder: FormBuilder,
        private companyService: CompanyService,
        private handleErrorService: HandleErrorService,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        this.getTimeBlock();
    }

    get f() {
        return this.assignamentForm.controls;
    }

    public onSubmit() {
        this.blockUI.start('Loading...');
        this.submit = true;

        this.companyService.updateBlockage({ waitTime: this.assignamentForm.get('waitTime').value }).subscribe(
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
        this.assignamentForm = this.formBuilder.group({
            waitTime: ['', [Validators.required]],
        });
    }

    private getTimeBlock() {
        this.companyService.getBlockage().subscribe((res) => {
            this.waitTimes = res.data;

            this.patchValue(res.data);
            this.loading = false;
        });
        this.blockUI.stop();
    }

    private patchValue(data) {
        this.assignamentForm.patchValue({
            waitTime: data.waitTime,
        });
    }
}
