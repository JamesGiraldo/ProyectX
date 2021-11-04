import * as Mapboxgl from 'mapbox-gl';
import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Country } from '@apptypes/enums';
import { GlobalService } from '@services/global.service';

@Component({
    selector: 'app-map-routes',
    templateUrl: './map-routes.component.html',
    styleUrls: ['./map-routes.component.scss'],
})
export class MapRoutesComponent implements OnInit {
    public map: Mapboxgl.Map;
    public submit: boolean = true;
    public coordinatesLng;
    public coordinatesLat;

    public country = Country;
    public user;
    public coordinates = [
        {
            code: 1,
            lng: -72.3782603,
            lat: 4.5713685,
        },
        {
            code: 2,
            lng: -76.24884,
            lat: -10.327887,
        },
    ];
    public lng;
    public lat;

    constructor(private readonly globalService: GlobalService) {}

    ngOnInit(): void {
        this.user = this.globalService.getDecodedToken().company.country?.id;

        if (this.user === this.country.PERU) {
            this.lng = this.coordinates[1].lng;
            this.lat = this.coordinates[1].lat;
        } else {
            this.lng = this.coordinates[0].lng;
            this.lat = this.coordinates[0].lat;
        }

        (Mapboxgl as any).accessToken = environment.apiKeyMapbox;
        this.map = new Mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [this.lng, this.lat],
            zoom: 6,
        });
    }
}
