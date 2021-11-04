import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { ListVehiclesComponent } from './components/list-vehicles/list-vehicles.component';
import { ModalNewvehicleComponent } from './components/modal-newvehicle/modal-newvehicle.component';
import { PipeModule } from '@services/pipes/pipe.module';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { VehiclesComponent } from './vehicles.component';
import { VehiclesRoutingModule } from './vehicles-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    declarations: [VehiclesComponent, ListVehiclesComponent, VehicleDetailComponent, ModalNewvehicleComponent],
    imports: [
        CommonModule,
        MatAutocompleteModule,
        ComponentsModule,
        FormsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        PipeModule.forRoot(),
        ReactiveFormsModule,
        VehiclesRoutingModule,
        TranslateModule,
    ],
})
export class VehiclesModule {}
