import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';

import { ComponentsModule } from '../components/components.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { PrincipalComponent } from './principal/principal.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MapRoutesComponent } from './principal/map-routes/map-routes.component';
import { DirectivesModule } from '../services/directives/directives.module';

@NgModule({
    declarations: [HomeComponent, NavbarComponent, PrincipalComponent, MapRoutesComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        HomeRoutingModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        SharedModule,
        TranslateModule,
        DirectivesModule
    ],
})
export class HomeModule {}
