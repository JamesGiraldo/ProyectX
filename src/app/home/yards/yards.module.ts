import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatRadioModule } from '@angular/material/radio';
import { SignaturePadModule } from 'angular2-signaturepad';

import { ComponentsModule } from '../../components/components.module';
import { ModalQrComponent } from './components/operations/modal-qr/modal-qr.component';
import { OperationsComponent } from './components/operations/operations.component';
import { PipeModule } from '../../services/pipes/pipe.module';
import { ReportDetailComponent } from './components/reports/report-detail/report-detail.component';
import { ReportsComponent } from './components/reports/reports.component';
import { StageDetailComponent } from './components/tracking-dashboard/tracking-map/track-detail/stage-detail/stage-detail.component';
import { TrackDetailComponent } from './components/tracking-dashboard/tracking-map/track-detail/track-detail.component';
import { TrackingDashboardComponent } from './components/tracking-dashboard/tracking-dashboard.component';
import { TrackingDetailsComponent } from './components/tracking-dashboard/tracking-details/tracking-details.component';
import { TrackingMapComponent } from './components/tracking-dashboard/tracking-map/tracking-map.component';
import { VehicleControlModalComponent } from './components/tracking-dashboard/tracking-map/track-detail/stage-detail/vehicle-control-modal/vehicle-control-modal.component';
import { VehicleDetailComponent } from './components/tracking-dashboard/tracking-map/track-detail/stage-detail/vehicle-detail/vehicle-detail.component';
import { YardsComponent } from './yards.component';
import { YardsRoutingModule } from './yards-routing.module';
import { DirectivesModule } from './../../services/directives/directives.module';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { SchedulesDetailComponent } from './components/schedules/schedules-detail/schedules-detail.component';
import { ModalInspectionComponent } from './components/operations/modal-inspection/modal-inspection.component';
import { ModalResponsesComponent } from './components/operations/modal-responses/modal-responses.component';
import { ModalLegalBaseComponent } from './components/operations/modal-legal-base/modal-legal-base.component';

@NgModule({
    declarations: [
        OperationsComponent,
        YardsComponent,
        TrackingDashboardComponent,
        ReportsComponent,
        TrackingDetailsComponent,
        TrackingMapComponent,
        ModalQrComponent,
        TrackDetailComponent,
        StageDetailComponent,
        VehicleDetailComponent,
        VehicleControlModalComponent,
        ReportDetailComponent,
        SchedulesComponent,
        SchedulesDetailComponent,
        ModalInspectionComponent,
        ModalResponsesComponent,
        ModalLegalBaseComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDividerModule,
        ZXingScannerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        ReactiveFormsModule,
        SignaturePadModule,
        TranslateModule,
        YardsRoutingModule,
        MatTooltipModule,
        PipeModule.forRoot(),
        ComponentsModule,
        DirectivesModule
    ],
})
export class YardsModule {}
