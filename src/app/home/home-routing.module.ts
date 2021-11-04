import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { PrincipalComponent } from './principal/principal.component';
import { RoleGuard } from '@services/guards/role.guard';
import { RoleTransporterGuard } from '@services/guards/role-transporter.guard';

const routes: Routes = [
    {
        path: ``,
        component: HomeComponent,
        children: [
            { path: `home`, component: PrincipalComponent },
            {
                path: `companies`,
                loadChildren: () => import('./companies/companies.module').then((m) => m.CompaniesModule),
                canActivate: [RoleGuard],
            },
            {
                path: `drivers`,
                loadChildren: () => import('./drivers/drivers.module').then((m) => m.DriversModule),
                canActivate:[RoleTransporterGuard]
            },
            {
                path: `vehicles`,
                loadChildren: () => import('./vehicles/vehicles.module').then((m) => m.VehiclesModule),
                canActivate:[RoleTransporterGuard]
            },
            {
                path: `requests`,
                loadChildren: () => import('./requests/requests.module').then((m) => m.RequestsModule),
            },
            {
                path: 'trips',
                loadChildren: () => import('./trips/trips.module').then((m) => m.TripsModule),
            },
            {
                path: `statistics`,
                loadChildren: () => import('./statistics/statistics.module').then((m) => m.StatisticsModule),
            },
            {
                path: `history`,
                loadChildren: () => import('./record/record.module').then((m) => m.RecordModule),
            },
            {
                path: `settings`,
                loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
            },
            {
                path: `yards`,
                loadChildren: () => import('./yards/yards.module').then((m) => m.YardsModule),
                canActivate: [RoleGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
