import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
    MAT_COLOR_FORMATS,
    NgxMatColorPickerModule,
    NGX_MAT_COLOR_FORMATS,
} from '@angular-material-components/color-picker';

import { AutomaticComponent } from './components/automatic/automatic.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FareDetailComponent } from './components/fares/fare-detail/fare-detail.component';
import { FaresComponent } from './components/fares/fares.component';
import { ModalNewfareComponent } from './components/fares/modal-newfare/modal-newfare.component';
import { ModalNewpermissionComponent } from './components/permissions/modal-newpermission/modal-newpermission.component';
import { PermissionDetailComponent } from './components/permissions/permission-detail/permission-detail.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { PipeModule } from '@services/pipes/pipe.module';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { InterventedRouteComponent } from './components/intervented-route/intervented-route.component';
import { InterventedRouteDetailComponent } from './components/intervented-route/intervented-route-detail/intervented-route-detail.component';
import { ModalNewInterventedRouteComponent } from './components/intervented-route/modal-new-intervented-route/modal-new-intervented-route.component';
import { FareSubscriptionDetailComponent } from './components/fares/fare-subscription-detail/fare-subscription-detail.component';
import { CustomFieldComponent } from './components/custom-field/custom-field.component';
import { CustomFieldDetailComponent } from './components/custom-field/custom-field-detail/custom-field-detail.component';
import { ModalNewCustomFieldComponent } from './components/custom-field/modal-new-custom-field/modal-new-custom-field.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { BlacklistComponent } from './components/blacklist/blacklist.component';
import { BlacklistDetailComponent } from './components/blacklist/blacklist-detail/blacklist-detail.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ModalMassiveFareComponent } from './components/fares/modal-massive-fare/modal-massive-fare.component';
import { ModalMassiveFieldsComponent } from './components/fares/modal-massive-fields/modal-massive-fields.component';
import { BlockagesComponent } from './components/blockages/blockages.component';
import { ReportVehiclesComponent } from './components/blockages/report-vehicles/report-vehicles.component';
import { AssignamentTripsComponent } from './components/blockages/assignament-trips/assignament-trips.component';
import { YardsComponent } from './components/yards/yards.component';
import { YardDetailComponent } from './components/yards/yard-detail/yard-detail.component';
import { ModalNewfactoryComponent } from './components/yards/modal-newfactory/modal-newfactory.component';
import { ModalNewstageComponent } from './components/yards/modal-newstage/modal-newstage.component';
import { ReportValidationsComponent } from './components/report-validations/report-validations.component';
import { GeneralComponent } from './components/general/general.component';
import { ModalVehiclesTimeComponent } from './components/yards/modal-vehicles-time/modal-vehicles-time.component';
import { CustomerServiceComponent } from './components/customer-service/customer-service.component';

@NgModule({
    declarations: [
        AutomaticComponent,
        FareDetailComponent,
        FaresComponent,
        ModalNewfareComponent,
        ModalNewpermissionComponent,
        PermissionDetailComponent,
        PermissionsComponent,
        SettingsComponent,
        InterventedRouteComponent,
        InterventedRouteDetailComponent,
        ModalNewInterventedRouteComponent,
        FareSubscriptionDetailComponent,
        CustomFieldComponent,
        CustomFieldDetailComponent,
        ModalNewCustomFieldComponent,
        BlacklistComponent,
        BlacklistDetailComponent,
        ModalMassiveFareComponent,
        ModalMassiveFieldsComponent,
        BlockagesComponent,
        ReportVehiclesComponent,
        AssignamentTripsComponent,
        YardsComponent,
        YardDetailComponent,
        ModalNewfactoryComponent,
        ModalNewstageComponent,
        ReportValidationsComponent,
        GeneralComponent,
        ModalVehiclesTimeComponent,
        CustomerServiceComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        FormsModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        NgxMatColorPickerModule,
        MatIconModule,
        MatInputModule,
        DragDropModule,
        MatAutocompleteModule,
        MatListModule,
        MatProgressBarModule,
        MatSelectModule,
        NgxSliderModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        PipeModule.forRoot(),
        ReactiveFormsModule,
        SettingsRoutingModule,
        TranslateModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
})
export class SettingsModule {}
