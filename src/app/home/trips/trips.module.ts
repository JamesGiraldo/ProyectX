import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';

import { ListTripsComponent } from './components/list-trips/list-trips.component';
import { TripsComponent } from './trips.component';
import { TripsRoutingModule } from './trips-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from '@services/pipes/pipe.module';
import { TripDetailComponent } from './components/trip-detail/trip-detail.component';
import { ModalOrderComponent } from './components/modal-order/modal-order.component';
import { ModalNotesComponent } from './components/modal-notes/modal-notes.component';
import { ModalQrComponent } from './components/modal-qr/modal-qr.component';
import { ModalFilesComponent } from './components/modal-files/modal-files.component';

@NgModule({
    declarations: [
        TripsComponent,
        ListTripsComponent,
        TripDetailComponent,
        ModalOrderComponent,
        ModalNotesComponent,
        ModalQrComponent,
        ModalFilesComponent,
    ],
    imports: [
        CommonModule,
        TripsRoutingModule,
        TranslateModule,
        CommonModule,
        ComponentsModule,
        FormsModule,
        ClipboardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTooltipModule,
        PipeModule.forRoot(),
        ReactiveFormsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TripsModule {}
