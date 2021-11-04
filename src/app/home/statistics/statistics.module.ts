import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StatisticsRoutingModule } from './statistics-routing.module';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ChartsModule } from 'ng2-charts';

import { StatisticsComponent } from './statistics.component';
import { ToggleableStatisticsComponent } from './components/toggleable-statistics/toggleable-statistics.component';
import { GeneradoraComponent } from './components/generadora/generadora.component';
import { TransportadoraComponent } from './components/transportadora/transportadora.component';
import { DriverScoreComponent } from './components/driver-score/driver-score.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    declarations: [
        StatisticsComponent,
        ToggleableStatisticsComponent,
        GeneradoraComponent,
        TransportadoraComponent,
        DriverScoreComponent,
    ],
    imports: [
        FormsModule,
        ComponentsModule,
        CommonModule,
        ReactiveFormsModule,
        StatisticsRoutingModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatNativeDateModule,
        MatDividerModule,
        MatButtonModule,
        MatSelectModule,
        MatTooltipModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        ChartsModule,
        TranslateModule,
    ],
})
export class StatisticsModule {}
