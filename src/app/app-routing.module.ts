import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@services/guards/auth.guard';
import { LoginComponent } from './landing/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PasswordRecoveryComponent } from './landing/password-recovery/password-recovery.component';
import { ResetPasswordComponent } from './landing/reset-password/reset-password.component';
import { SafetyCourseComponent } from './landing/safety-course/safety-course.component';
import { TestFormComponent } from './landing/safety-course/test-form/test-form.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    { path: 'passwordRecovery', component: PasswordRecoveryComponent },
    { path: 'resetPassword/:key', component: ResetPasswordComponent },
    {
        path: 'company/:cc/safety-course',
        component: SafetyCourseComponent,
    },
    {
        path: 'company/:cc/safety-course/take/:key',
        component: TestFormComponent,
    },
    {
        path: '',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
