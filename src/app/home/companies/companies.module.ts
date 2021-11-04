import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { PipeModule } from '@services/pipes/pipe.module';
import { TranslateModule } from '@ngx-translate/core';

import { CompaniesComponent } from './companies.component';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ListCompaniesComponent } from './components/list-companies/list-companies.component';
import { ModalNewPublicationComponent } from './components/modal-newpublication/modal-newpublication.component';
import { ModalNewcompanyComponent } from './components/modal-newcompany/modal-newcompany.component';
import { ModalNewloyalComponent } from './components/modal-newloyal/modal-newloyal.component';
import { ModalMapComponent } from './components/modal-map/modal-map.component';
import { ModalMassiveLoadComponent } from './components/modal-massive-load/modal-massive-load.component';
import { ModalMassiveFieldsComponent } from './components/modal-massive-fields/modal-massive-fields.component';
import { ModalFormatComponent } from './components/modal-massive-load/modal-format/modal-format.component';
import { ModalPublicationAsTransporterComponent } from './components/modal-publication-as-transporter/modal-publication-as-transporter.component';

@NgModule({
    declarations: [
        CompaniesComponent,
        CompanyDetailComponent,
        ListCompaniesComponent,
        ModalNewPublicationComponent,
        ModalNewcompanyComponent,
        ModalNewloyalComponent,
        ModalMapComponent,
        ModalMassiveLoadComponent,
        ModalMassiveFieldsComponent,
        ModalFormatComponent,
        ModalPublicationAsTransporterComponent,
    ],
    imports: [
        CommonModule,
        CompaniesRoutingModule,
        ComponentsModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMomentDateModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        PipeModule.forRoot(),
        ReactiveFormsModule,
        TranslateModule,
    ],
})
export class CompaniesModule {}
