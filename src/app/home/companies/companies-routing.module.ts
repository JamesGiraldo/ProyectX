import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCompaniesComponent } from './components/list-companies/list-companies.component';

const routes: Routes = [
    {
        path: '',
        component: ListCompaniesComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CompaniesRoutingModule {}
