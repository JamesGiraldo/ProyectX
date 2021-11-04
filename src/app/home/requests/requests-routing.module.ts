import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListRequestsComponent } from './components/list-requests/list-requests.component';

const routes: Routes = [
    {
        path: '',
        component: ListRequestsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequestsRoutingModule {}
