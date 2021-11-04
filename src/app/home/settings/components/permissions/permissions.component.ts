import { Component, OnInit } from '@angular/core';

import { RightToSee } from '@apptypes/entities';
import { UserService } from '@services/user.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public colNames: string[];
    public elementPages: number;
    public page: number = 1;
    public totalPages: number;
    public users: RightToSee[] = [];
    public currentElements: number = 12;
    public isSearch;
    public searchArray: any[] = [];
    public sortArray: any[] = [];
    public sortFields = [{ key: '', value: '' }];
    public statusOrder: boolean = true;

    constructor(private userService: UserService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.colNames = ['GENERAL_WORD.NAME', 'GENERAL_WORD.LASTNAME', 'GENERAL_WORD.EMAIL', 'GENERAL_WORD.WATCH'];
        this.getUsers(this.page, this.currentElements);
    }

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;
        this.blockUI.start('Loading...');
        this.isSearch
            ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
            : this.getUsers(this.page, this.currentElements);
        this.blockUI.stop();
    }

    public sortData($event) {
        this.sortArray = [];
        this.statusOrder = !this.statusOrder;
        let order = this.sortFields.find((x) => x.key === $event.srcElement.id);
        this.sortArray.push(order);

        this.search(this.searchArray[this.searchArray.length - 1], this.sortArray, this.statusOrder);
    }

    public searchData($event) {
        $event.length > 0 ? (this.isSearch = true) : (this.isSearch = false);
        this.searchArray.push($event);

        if ($event.length === 0) this.searchArray = [];
        this.search(this.searchArray[this.searchArray?.length - 1], this.sortArray);
    }

    public search(searchData: any, sortData: any, statusOrder?: boolean) {}

    public goToPage(page: number) {
        this.page = page;
        this.getUsers(this.page, this.currentElements);
    }

    public refresh($event) {
        if ($event) this.getUsers(this.page, this.currentElements);
    }

    private getUsers(page: number, currentElements: number): void {
        this.userService.getAll(page, currentElements).subscribe((res) => {
            this.users = [...res.data.records];
            this.elementPages = this.users.length;
            this.totalPages = res.data.totalPages;
            this.blockUI.stop();
        });
    }
}
