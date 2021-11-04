import { Component, Input, OnInit } from '@angular/core';
import { YardStageService } from '../../../../../../../services';

@Component({
    selector: 'app-stage-detail',
    templateUrl: './stage-detail.component.html',
    styleUrls: ['./stage-detail.component.scss'],
})
export class StageDetailComponent implements OnInit {
    @Input() stage;
    @Input() yard;
    vehicles = [];

    constructor(public readonly yardStageService: YardStageService) {}

    ngOnInit(): void {}

    public getVehicles() {
        this.getVechilesOnStage(this.stage.id);
    }

    /**
     * API REQUESTS
     */
    getVechilesOnStage(yardIdStage: number) {
        this.yardStageService.getVehiclesInStage(yardIdStage).subscribe((res) => {
            if (res.data) this.vehicles = res.data;
        });
    }
}
