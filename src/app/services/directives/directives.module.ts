import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleVerifyDirective } from './role-verify.directive';



@NgModule({
  declarations: [RoleVerifyDirective],
  imports: [
    CommonModule
  ],
  exports: [
    RoleVerifyDirective
  ]
})
export class DirectivesModule { }
