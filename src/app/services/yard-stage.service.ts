import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Api } from '../shared/api';
import { GlobalService } from './global.service';

@Injectable({
    providedIn: 'root',
})
export class YardStageService {
    constructor(private globalService: GlobalService) {}

    public getVehiclesInStage(yardStageId: number) {
        return this.globalService.get(Api.Endpoints.YARD_STAGE.VEHICLES_ON_STAGE(yardStageId)).pipe(
            map((res) => {
                return res;
            }),
        );
    }
}
