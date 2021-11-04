import { CommonModule, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';
import { HistoryComponent } from './components/history/history.component';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { ModalOptionsDownloadComponent } from './components/modal-options-download/modal-options-download.component';
import { PipeModule } from '../../services/pipes/pipe.module';
import { RecordRoutingModule } from './record-routing.module';
import { RecordsComponent } from './records.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExporterService } from '@services/exporter.service';

@NgModule({
    declarations: [RecordsComponent, HistoryComponent, HistoryDetailComponent, ModalOptionsDownloadComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        ComponentsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatProgressBarModule,
        MatRadioModule,
        MatSnackBarModule,
        MatTooltipModule,
        PipeModule.forRoot(),
        RecordRoutingModule,
        SharedModule,
    ],
    providers: [DatePipe, ExporterService],
})
export class RecordModule {}
