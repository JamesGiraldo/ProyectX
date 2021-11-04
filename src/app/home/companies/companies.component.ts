import { Component, OnInit } from '@angular/core';
import { Company } from '@apptypes/entities/company';
import { Item } from '@apptypes/entities/status-item';
import { StatusList } from '@apptypes/entities/status-list';

@Component({
    selector: 'app-companies',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
    selectAll: boolean;
    currentPage: number;
    colNames: string[];
    brokerType: StatusList;
    brokers: Company[];
    pages: Company[][];
    selections: boolean[][];
    totalSelected: number;

    constructor() {}

    ngOnInit(): void {
        this.totalSelected = 0;
        this.selectAll = false;
        this.brokerType = new StatusList();
        this.brokerType.add(new Item(0, 'Afilidiadas', true));
        this.brokerType.add(new Item(1, 'No Afilidiadas'));
    }

    toggleStatus(id: number) {
        for (let type of this.brokerType.items) {
            type.isActive = false;
            if (type.id == id) type.isActive = true;
        }
    }

    updatePage(operation: string = null) {
        if (operation === '+' && this.currentPage < this.pages.length - 1) this.currentPage++;
        if (operation === '-' && this.currentPage > 0) this.currentPage--;
        this.brokers = this.pages[this.currentPage];
        this.selectAll = this.getCurrentPageStatus();
    }

    updateSelectionAt(page: number, index: number) {
        this.selections[page][index] = !this.selections[page][index];
        this.resetSelected();
    }

    toggle() {
        for (let index = 0; index < this.selections[this.currentPage].length; index++) {
            this.selections[this.currentPage][index] = this.selectAll;
        }
        this.resetSelected();
    }

    resetSelected() {
        this.totalSelected = 0;
        for (const page of this.selections) {
            for (const value of page) {
                if (value) this.totalSelected++;
            }
        }
    }

    getCurrentPageStatus(): boolean {
        for (const value of this.selections[this.currentPage]) {
            if (!value) return false;
        }
        return true;
    }

    setPageTo(page: number) {
        this.currentPage = page;
        this.updatePage();
    }

    isFirstPage(): boolean {
        return this.currentPage == 0;
    }

    isLastPage(): boolean {
        return this.currentPage == this.pages.length - 1;
    }

    get totalBrokers() {
        let total = 0;
        for (const page of this.pages) {
            total += page.length;
        }
        return total;
    }
}
