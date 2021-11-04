import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperationsComponent } from './components/operations/operations.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { TrackingDashboardComponent } from './components/tracking-dashboard/tracking-dashboard.component';
import { YardsComponent } from './yards.component';

const routes: Routes = [
    {
        path: '',
        component: YardsComponent,
        children: [
            { path: 'operations', component: OperationsComponent },
            { path: 'tracking', component: TrackingDashboardComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'schedules', component: SchedulesComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YardsRoutingModule {}
