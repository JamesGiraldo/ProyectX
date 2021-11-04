import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CompanyService } from '@services/company.service';
import { ModalNewPublicationComponent } from '../modal-newpublication/modal-newpublication.component';
import { ModalNewcompanyComponent } from '../modal-newcompany/modal-newcompany.component';
import { ModalNewloyalComponent } from '../modal-newloyal/modal-newloyal.component';
import { ModalMassiveLoadComponent } from '../modal-massive-load/modal-massive-load.component';
import { StatusList, Item, Company } from '@apptypes/entities';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalPublicationAsTransporterComponent } from '../modal-publication-as-transporter/modal-publication-as-transporter.component';
import { SocketWebService } from '@services/socket-web.service';
import { NamespaceSocket } from '@apptypes/enums/namespaces-socket.enum';

@Component({
    selector: 'app-list-companies',
    templateUrl: './list-companies.component.html',
    styleUrls: ['./list-companies.component.scss'],
})
export class ListCompaniesComponent implements OnInit, OnDestroy {
    @BlockUI() blockUI: NgBlockUI;
    public companies: Company[] = [];
    public companyType: StatusList;
    public currentElements: number = 12;
    public disable: boolean = true;
    public elementPages: number;
    public globalCheck: boolean = false;
    public loyalty: boolean;
    public page: number = 1;
    public selectedTransporters: number[];
    public selectedCompanies: number[];
    public totalPages: number;
    public transporters: Company[] = [];
    public transportersAll: Company[] = [];
    public orderBy: 'ASC' | 'DSC' | 'N/A' = 'N/A';
    public statusOrder: boolean = true;
    public isSearch;
    public searchArray: any[] = [];
    public sortArray: any[] = [];
    public sortFields = [{ key: '', value: '' }];

    /* Socket */
    public socketInstance;

    constructor(
        public dialog: MatDialog,
        private companyService: CompanyService /* private socketService: SocketWebService, */,
    ) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        //this.socketInstance = this.socketService.of(NamespaceSocket.COMPANY);

        this.loyalty = true;
        this.companyType = new StatusList();
        this.companyType.add(new Item(0, 'Fidelizadas', true));
        this.companyType.add(new Item(1, 'Todas'));
        this.selectedTransporters = [];
        this.selectedCompanies = [];

        if (this.companyType.items[0].isActive) {
            this.getTransportersLoyal(this.page, this.currentElements);
        } else {
            this.getCompanies(this.page, this.currentElements);
        }

        /* All */
        this.getTransportersLoyalAll();
    }

    ngOnDestroy() {}

    getCurrentElements($event) {
        this.currentElements = $event;

        if ($event > 12) this.page = 1;

        this.blockUI.start('Loading...');
        if (this.companyType.items[0].isActive) {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getTransportersLoyal(this.page, this.currentElements);
            this.blockUI.stop();
        } else {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getCompanies(this.page, this.currentElements);
            this.blockUI.stop();
        }
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
        this.blockUI.start('Loading...');
        this.page = page;
        this.selectedTransporters = [];
        this.selectedCompanies = [];
        if (this.loyalty) {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getTransportersLoyal(this.page, this.currentElements);
        } else {
            this.isSearch
                ? this.search(this.searchArray[this.searchArray.length - 1], this.sortArray)
                : this.getCompanies(this.page, this.currentElements);
        }
    }

    public openDialogCreate(): void {
        this.dialog
            .open(ModalNewcompanyComponent, {
                width: '650px',
                height: '600px',
                disableClose: true,
                data: { company: new Company(), refresh: false },
            })
            .afterClosed()
            .subscribe(() => {
                this.getCompanies(this.page, this.currentElements);
            });
    }

    public openDialogLoyal(): void {
        this.dialog
            .open(ModalNewloyalComponent, {
                width: '450px',
                height: '300px',
                disableClose: true,
            })
            .afterClosed()
            .subscribe(() => {
                this.getTransportersLoyal(this.page, this.currentElements);
            });
    }

    public openDialogMassive(companyType: any): void {
        if (this.companyType.items[0].isActive) {
            if (this.selectedTransporters.length === 0) {
                this.transportersAll.map((x) => this.selectedTransporters.push(x.id));
            }
        }

        this.dialog
            .open(ModalMassiveLoadComponent, {
                width: '450px',
                height: '220px',
                disableClose: true,
                data: {
                    companiesToRequest: companyType ? this.selectedTransporters : this.selectedCompanies,
                    companies: this.companies,
                    companyType: companyType,
                },
            })
            .afterClosed()
            .subscribe((result) => {
                this.globalCheck = true;

                setTimeout(() => {
                    this.globalCheck = false;
                }, 10);
            });

        this.selectedTransporters = [];
        this.selectedCompanies = [];
    }

    public openDialogPublication(companyType: any): void {
        if (this.companyType.items[0].isActive) {
            if (this.selectedTransporters.length === 0) {
                this.transportersAll.map((x) => this.selectedTransporters.push(x.id));
            }
        }

        this.dialog
            .open(ModalNewPublicationComponent, {
                width: '1000px',
                height: '600px',
                disableClose: true,
                data: {
                    companiesToRequest: companyType ? this.selectedTransporters : this.selectedCompanies,
                    companies: this.companies,
                    companyType: companyType,
                },
            })
            .afterClosed()
            .subscribe(() => {
                this.globalCheck = true;

                setTimeout(() => {
                    this.globalCheck = false;
                }, 10);
            });

        this.selectedTransporters = [];
        this.selectedCompanies = [];
    }

    public openDialogAsTranporter() {
        this.dialog
            .open(ModalPublicationAsTransporterComponent, {
                width: '1000px',
                height: '600px',
                disableClose: true,
                data: '',
            })
            .afterClosed()
            .subscribe(() => {});
    }

    public toggleStatus(id: number) {
        this.blockUI.start('Loading...');
        for (let type of this.companyType.items) {
            type.isActive = false;
            if (type.id == id) type.isActive = true;
        }
        this.page = 1;

        if (this.companyType.items[0].isActive) {
            this.loyalty = true;
            this.getTransportersLoyal(this.page, this.currentElements);
        } else {
            this.loyalty = false;
            this.getCompanies(this.page, this.currentElements);
        }
    }

    sortingFilter(a: Company, b: Company, field, order: 'ASC' | 'DSC' | 'N/A') {
        const actual = a[field].toLowerCase();
        const next = b[field].toLowerCase();
        if (order === 'ASC') {
            if (actual < next) return -1;
            else if (actual > next) return 1;
            else return 0;
        } else if (order === 'DSC') {
            if (actual > next) return -1;
            else if (actual < next) return 1;
            else return 0;
        }
    }

    orderByField(field) {
        this.blockUI.start('Loading...');
        this.statusOrder = !this.statusOrder;
        if (this.statusOrder && this.orderBy === 'ASC') {
            this.orderBy = 'DSC';
        } else if (this.orderBy === 'DSC' || this.orderBy === 'N/A') {
            this.orderBy = 'ASC';
        }

        // FIDELIZADAS
        if (this.companyType.items[0].isActive)
            this.transporters.sort((a, b) => this.sortingFilter(a, b, field, this.orderBy));
        // TODAS
        else this.companies.sort((a, b) => this.sortingFilter(a, b, field, this.orderBy));
        this.blockUI.stop();
    }

    /**
     * GETTERS
     */
    public get transportersToRequest() {
        return this.selectedTransporters.length;
    }

    public get companiesToRequest() {
        return this.selectedCompanies.length;
    }

    public sortByField($event) {
        let field = $event.srcElement.id;
        this.orderByField(field);
    }

    /**
     * EVENT HANDLERS
     */
    public onCheckboxChanged($event) {
        this.globalCheck = $event.checked;

        this.selectedCompanies = $event.checked ? this.companies.map((c) => c.id) : [];
        this.selectedTransporters = $event.checked ? this.transportersAll.map((t) => t.id) : [];
    }

    public onCompanyDetailToggle($event) {
        if ($event.checked) {
            this.selectedCompanies.push($event.id);
            this.selectedTransporters.push($event.id);
        } else {
            const transporterIndex = this.selectedCompanies.indexOf($event.id);
            this.selectedCompanies.splice(transporterIndex, 1);
            this.selectedTransporters.splice(transporterIndex, 1);
        }
    }

    public onCompanyDetailRemove(routeId: number) {
        if (routeId) this.getTransportersLoyal(this.page, this.currentElements);

        const indexToRemove = this.companies.findIndex((c) => c.id == routeId);
        this.companies.splice(indexToRemove, 1);
    }

    private getCompanies(page: number, currentElements: number): void {
        this.companyService.getAllTransporters(page, currentElements).subscribe((res) => {
            this.companies = [...res.data.records];
            this.elementPages = this.companies.length;
            this.totalPages = res.data.totalPages;
            this.disable = false;
            this.orderBy = 'N/A';
            this.blockUI.stop();
        });
    }

    private getTransportersLoyal(page: number, currentElements: number) {
        this.companyService.getGeneratorTransporterRelationOfCompany(page, currentElements).subscribe((res) => {
            this.transporters = [...res.data?.records];
            this.elementPages = this.transporters.length;
            this.totalPages = res.data.totalPages;
            this.disable = false;
            this.orderBy = 'N/A';
            this.blockUI.stop();
        });
    }

    /* All */
    private getTransportersLoyalAll() {
        this.companyService.getGeneratorTransporterRelationOfCompany(0, 0).subscribe((res) => {
            this.transportersAll = [...res.data?.records];
            this.blockUI.stop();
        });
    }
}
