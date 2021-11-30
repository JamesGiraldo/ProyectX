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
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '../../components/components.module';
import { DriverDetailComponent } from './components/driver-detail/driver-detail.component';
import { DriversComponent } from './drivers.component';
import { DriversRoutingModule } from './drivers-routing.module';
import { ListDriversComponent } from './components/list-drivers/list-drivers.component';
import { ModalNewdriverComponent } from './components/modal-newdriver/modal-newdriver.component';
import { PipeModule } from '@services/pipes/pipe.module';

import { DirectivesModule } from '../../services/directives/directives.module';

@NgModule({
    declarations: [ListDriversComponent, DriversComponent, ModalNewdriverComponent, DriverDetailComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        DriversRoutingModule,
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
        MatMomentDateModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        PipeModule.forRoot(),
        ReactiveFormsModule,
        TranslateModule,
        DirectivesModule
    ],
})
export class DriversModule {}
