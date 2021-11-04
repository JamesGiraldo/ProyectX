import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnumToArrayPipe } from './enum.pipe';
import { FilterDriverPipe } from './filter-driver.pipe';
import { FormatDriverId } from './format-driver-id.pipe';
import { FormatDate } from './format-date.pipe';
import { ReplaceTypesPipe } from './replace-types.pipe';
import { NaPipe } from './na.pipe';

@NgModule({
    declarations: [FilterDriverPipe, ReplaceTypesPipe, FormatDate, EnumToArrayPipe, NaPipe, FormatDriverId],
    imports: [CommonModule],
    exports: [FilterDriverPipe, ReplaceTypesPipe, FormatDate, EnumToArrayPipe, NaPipe, FormatDriverId],
})
export class PipeModule {
    static forRoot(): ModuleWithProviders<PipeModule> {
        return {
            ngModule: PipeModule,
        };
    }
}
