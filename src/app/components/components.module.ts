import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ComponentsRoutingModule } from './components-routing.module';
import { CardMapComponent } from './card-map/card-map.component';
import { PaginationComponent } from './pagination/pagination.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalCargoInfoComponent } from './modal-cargo-info/modal-cargo-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipeModule } from '@services/pipes/pipe.module';
import { ModalOffersComponent } from './modal-offers/modal-offers.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ModalNewReportComponent } from './modal-new-report/modal-new-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ModalReasonsComponent } from './modal-reasons/modal-reasons.component';
import { BlockUIModule } from 'ng-block-ui';
import { ModalFilesComponent } from './modal-files/modal-files.component';
import { ModalDetailsFilesComponent } from './modal-details-files/modal-details-files.component';
import { ModalPreviewFilesComponent } from './modal-preview-files/modal-preview-files.component';
import { ModalObservationsComponent } from './modal-observations/modal-observations.component';
import { SearchComponent } from './search/search.component';
import { ModalRescheduleComponent } from './modal-reschedule/modal-reschedule.component';

@NgModule({
    declarations: [
        CardMapComponent,
        PaginationComponent,
        NotFoundComponent,
        ModalCargoInfoComponent,
        ModalOffersComponent,
        OfferDetailComponent,
        ModalNewReportComponent,
        ReportDetailComponent,
        ModalReasonsComponent,
        ModalFilesComponent,
        ModalDetailsFilesComponent,
        ModalPreviewFilesComponent,
        ModalObservationsComponent,
        SearchComponent,
        ModalRescheduleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsRoutingModule,
        TranslateModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatSelectModule,
        MatRadioModule,
        MatInputModule,
        MatDatepickerModule,
        PdfViewerModule,
        MatMomentDateModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatMomentModule,
        MatSlideToggleModule,
        MatChipsModule,
        PipeModule.forRoot(),
        BlockUIModule.forRoot({
            delayStop: 300,
        }),
    ],
    exports: [
        CardMapComponent,
        PaginationComponent,
        ModalCargoInfoComponent,
        ModalOffersComponent,
        ModalNewReportComponent,
        BlockUIModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatMomentModule,
        SearchComponent,
    ],
})
export class ComponentsModule {}
