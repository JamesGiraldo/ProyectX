import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTripsComponent } from './components/list-trips/list-trips.component';

const routes: Routes = [
    {
        path: '',
        component: ListTripsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TripsRoutingModule {}
