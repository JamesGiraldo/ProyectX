import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { YardService } from '../../../../../../services';

@Component({
    selector: 'app-track-detail',
    templateUrl: './track-detail.component.html',
    styleUrls: ['./track-detail.component.scss'],
})
export class TrackDetailComponent implements OnInit {
    @Input() yard;
    stages = [];

    constructor(public readonly yardService: YardService) {}

    ngOnInit(): void {}

    public getStages() {
        this.getStagesWithVechiles(this.yard.id);
    }

    /**
     * API REQUESTS
     */
    getStagesWithVechiles(yardId: number) {
        this.yardService.getStagesWithVehicleCount(yardId).subscribe((res) => {
            if (res.data) this.stages = res.data;
        });
    }
}
