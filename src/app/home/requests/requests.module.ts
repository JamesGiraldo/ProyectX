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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';

import { ComponentsModule } from 'src/app/components/components.module';
import { ListRequestsComponent } from './components/list-requests/list-requests.component';
import { PipeModule } from '@services/pipes/pipe.module';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';
import { RequestsComponent } from './requests.component';
import { RequestsRoutingModule } from './requests-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalOptionsComponent } from './components/modal-options/modal-options.component';
import { ModalColumnsComponent } from './components/modal-columns/modal-columns.component';
import { DirectivesModule } from './../../services/directives/directives.module';

@NgModule({
    declarations: [
        RequestsComponent,
        ListRequestsComponent,
        RequestDetailComponent,
        ModalOptionsComponent,
        ModalColumnsComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DragDropModule,
        FormsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatListModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        PipeModule.forRoot(),
        ReactiveFormsModule,
        RequestsRoutingModule,
        TranslateModule,
        DirectivesModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
})
export class RequestsModule {}
