import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToggleableStatisticsComponent } from './components/toggleable-statistics/toggleable-statistics.component';


const routes: Routes = [
  { path: '', component: ToggleableStatisticsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
