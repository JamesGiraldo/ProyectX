import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// ANGULAR Material
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// NG
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [],
    imports: [
        HttpClientModule,
        FormsModule,
        NgbModule,
        // ANGULAR
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        // Ngb
        NgbDatepickerModule,
    ],
    exports: [
        ReactiveFormsModule,
        TranslateModule,
        NgbModule,
        FormsModule,
        // ANGULAR
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        // Ngb
        NgbDatepickerModule,
    ],
})
export class SharedModule {}
