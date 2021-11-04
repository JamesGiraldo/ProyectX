import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListDriversComponent } from './components/list-drivers/list-drivers.component';

const routes: Routes = [
    {
        path: '',
        component: ListDriversComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DriversRoutingModule {}
