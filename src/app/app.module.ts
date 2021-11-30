import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockUIModule } from 'ng-block-ui';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
//translation dependencies
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { AuthGuard } from '@services/guards/auth.guard';
import { AuthInterceptor } from '@services/intercepts/intercept-request.service';
import { AuthenticationService } from '@services/authentication.service';
import { LoginComponent } from './landing/login/login.component';
import { PasswordRecoveryComponent } from './landing/password-recovery/password-recovery.component';
import { ResetPasswordComponent } from './landing/reset-password/reset-password.component';
import { SafetyCourseComponent } from './landing/safety-course/safety-course.component';
import { TestFormComponent } from './landing/safety-course/test-form/test-form.component';
import { VideoModalComponent } from './landing/safety-course/video-modal/video-modal.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DirectivesModule } from './services/directives/directives.module';
import { environment } from 'src/environments/environment';
const config: SocketIoConfig = { url:  environment.socketHost , options: { transports: [ 'websocket' ], query: { token: `Bearer ${localStorage.getItem('token')}` } } };

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        PasswordRecoveryComponent,
        ResetPasswordComponent,
        SafetyCourseComponent,
        TestFormComponent,
        VideoModalComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        BlockUIModule.forRoot({
            delayStop: 300,
        }),
        SocketIoModule.forRoot(config),
        DirectivesModule,
        ToastrModule.forRoot({ preventDuplicates: true }),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB8m_BcijLwI0AKniS7gEGFMEcTtNGGH9A',
        }),
        SharedModule,
        // translation
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => {
                    return new TranslateHttpLoader(http);
                },
                deps: [HttpClient],
            },
        }),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    exports: [BrowserModule],
    providers: [
        AuthGuard,
        AuthenticationService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
