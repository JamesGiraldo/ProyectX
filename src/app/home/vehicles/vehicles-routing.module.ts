import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListVehiclesComponent } from "./components/list-vehicles/list-vehicles.component";

const routes: Routes = [
  { path: '', component: ListVehiclesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }
