import { CounterDirective } from './counter.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleVerifyDirective } from './role-verify.directive';



@NgModule({
  declarations: [RoleVerifyDirective, CounterDirective],
  imports: [
    CommonModule
  ],
  exports: [
    RoleVerifyDirective,
    CounterDirective
  ]
})
export class DirectivesModule { }
