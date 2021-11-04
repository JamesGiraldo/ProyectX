import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CustomField } from '@apptypes/entities/index';
import { CustomFieldService } from '@services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalNewCustomFieldComponent } from './modal-new-custom-field/modal-new-custom-field.component';

@Component({
    selector: 'app-custom-field',
    templateUrl: './custom-field.component.html',
    styleUrls: ['./custom-field.component.scss'],
})
export class CustomFieldComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    empty: boolean = false;
    loading: boolean = true;
    colNames: string[];
    translateKeys: string[] = ['NAME', 'TYPE', 'MODULE', 'STAGE', 'ACTIONS'];
    customFields: CustomField[] = [];

    /* Pagination */
    public page: number = 1;
    public totalPages: number;
    public elementPages: number;
    public currentElements: number = 12;

    constructor(public dialog: MatDialog, private readonly customFieldService: CustomFieldService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.setColumnNames();
        this.getCustomFields(this.page, this.currentElements);
    }

    setColumnNames() {
        this.colNames = [];
        for (let index = 0; index < this.translateKeys.length; index++) {
            this.colNames.push(`GENERAL_WORD.${this.translateKeys[index]}`);
        }
    }

    /**
     * EVENT HANLDERS
     */
    public onOpenModal() {
        this.dialog
            .open(ModalNewCustomFieldComponent, {
                width: '850px',
                height: '600px',
                disableClose: true,
                data: new CustomField(),
            })
            .afterClosed()
            .subscribe((result) => {
                this.getCustomFields(this.page, this.currentElements);
            });
    }

    onCustomFieldRemove(customFieldId: number) {
        const indexToRemove = this.customFields.findIndex((cf) => cf.id == customFieldId);
        this.customFields.splice(indexToRemove, 1);
    }

    public onUpdate() {
        this.getCustomFields(this.page, this.currentElements);
    }

    public goToPage(page: number) {
        this.blockUI.start('Loading...');
        this.page = page;

        this.getCustomFields(this.page, this.currentElements);
    }

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;
        this.blockUI.start('Loading...');

        this.getCustomFields(this.page, this.currentElements);
        this.blockUI.stop();
    }

    /**
     * API CALLS
     */
    private getCustomFields(page, elements): void {
        this.customFieldService.getCustomfields(page, elements).subscribe((res) => {
            this.customFields = [...res.data.records];
            this.elementPages = this.customFields.length;
            this.totalPages = res.data.totalPages;

            this.loading = false;
            res.data.elementsPerPage > 0 ? (this.empty = false) : (this.empty = true);
        });

        this.blockUI.stop();
    }
}
