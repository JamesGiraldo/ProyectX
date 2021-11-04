import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutomaticComponent } from './components/automatic/automatic.component';
import { BlacklistComponent } from './components/blacklist/blacklist.component';
import { BlockagesComponent } from './components/blockages/blockages.component';
import { CustomFieldComponent } from './components/custom-field/custom-field.component';
import { CustomerServiceComponent } from './components/customer-service/customer-service.component';
import { FaresComponent } from './components/fares/fares.component';
import { GeneralComponent } from './components/general/general.component';
import { InterventedRouteComponent } from './components/intervented-route/intervented-route.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { ReportValidationsComponent } from './components/report-validations/report-validations.component';
import { SettingsComponent } from './settings.component';
import { YardsComponent } from './components/yards/yards.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: 'automatic', component: AutomaticComponent },
            { path: 'service-failure', component: BlacklistComponent },
            { path: 'blockages', component: BlockagesComponent },
            { path: 'custom-fields', component: CustomFieldComponent },
            { path: 'fares', component: FaresComponent },
            { path: 'general', component: GeneralComponent },
            { path: 'intervented-routes', component: InterventedRouteComponent },
            { path: 'permissions', component: PermissionsComponent },
            { path: 'report-validations', component: ReportValidationsComponent },
            { path: 'yards', component: YardsComponent },
            { path: 'customer-service', component: CustomerServiceComponent },
            { path: 'reception-requests', component: CustomerServiceComponent },
            { path: 'adjust-validity', component: CustomerServiceComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
