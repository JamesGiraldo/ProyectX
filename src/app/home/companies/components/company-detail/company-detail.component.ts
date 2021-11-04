import Swal from 'sweetalert2';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';

import { Company } from '@apptypes/entities/company';
import { CompanyService, HandleErrorService } from '@services/index';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-company-detail',
    templateUrl: './company-detail.component.html',
    styleUrls: ['./company-detail.component.scss'],
})
export class CompanyDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Output() refresh = new EventEmitter<boolean>();
    @Input('company') company: Company;
    @Input('selected') selected: boolean;
    @Output('toggle') toggle: EventEmitter<{ checked: boolean; id: number }> = new EventEmitter();
    @Output('remove') remove: EventEmitter<number> = new EventEmitter();

    ratings: string[];

    constructor(private companyService: CompanyService, private handleErrorService: HandleErrorService) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.company) {
            const company = <Company>changes.company.currentValue;
            this.ratings = this.generateRatings(company.rating);
        }
    }

    public generateRatings(rating: number): string[] {
        const floor = Math.floor(rating);
        const ceil = Math.ceil(rating);
        let ratings: string[] = [];
        for (let index: number = 0; index < ceil; index++) {
            index < floor ? ratings.push('star') : ratings.push('star_half');
        }
        if (ratings.length < 5) {
            for (let index: number = ratings.length - 1; index < 4; index++) {
                ratings.push('star_border');
            }
        }
        return ratings;
    }

    /**
     * EVENT HANDLERS
     */
    public onCheckboxChanged($event) {
        this.toggle.emit({ checked: $event.checked, id: this.company.id });
    }

    /**
     * API REQUESTS
     */
    public removeLoyalTransporter() {
        Swal.fire({
            title: '¿Estas seguro que deseas remover esta transportadora de tus fidelizadas?',
            text:
                'En caso de querer añadir esta transportadora nuevamente se tendra que hacer la solicitud de fidelización nuevamente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remover',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.blockUI.start('Loading...');
                this.companyService.removeGeneratorTransporterRelation(this.company).subscribe(
                    (res) => {
                        if (res.code >= 1000) {
                            if (res.code == 1042) {
                                Swal.fire(
                                    '¡Transportadora Desafiliada!',
                                    'La transportadora ha sido removida satisfactoriamente de sus transportadoras afiliadas.',
                                    'success',
                                );
                                this.remove.emit(this.company.id);
                            }
                        } else {
                            this.handleErrorService.onFailure(res);
                        }
                    },
                    (err) => this.handleErrorService.onFailure(err),
                );
                this.blockUI.stop();
            }
        });
    }
}
