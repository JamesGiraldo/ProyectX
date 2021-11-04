import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as Mapboxgl from 'mapbox-gl';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { environment } from 'src/environments/environment';
import { Country } from '@apptypes/enums';
import { GlobalService } from '@services/global.service';

@Component({
    selector: 'app-modal-map',
    templateUrl: './modal-map.component.html',
    styleUrls: ['./modal-map.component.scss'],
})
export class ModalMapComponent implements OnInit {
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

    constructor(public dialogRef: MatDialogRef<ModalMapComponent>, private readonly globalService: GlobalService) {}

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

        this.marketMap(this.lng, this.lat);

        let geocoder = new MapboxGeocoder({
            accessToken: Mapboxgl.accessToken,
            types: 'poi',
            render: function (item) {
                var maki = item.properties.maki || 'marker';
                return (
                    "<div class='geocoder-dropdown-item'><img class='geocoder-dropdown-icon' src='https://unpkg.com/@mapbox/maki@6.1.0/icons/" +
                    maki +
                    "-15.svg'><span class='geocoder-dropdown-text'>" +
                    item.text +
                    '</span></div>'
                );
            },
            mapboxgl: Mapboxgl,
        });

        this.map.addControl(geocoder);

        // Add zoom and rotation controls to the map.
        this.map.addControl(new Mapboxgl.NavigationControl());
    }

    public marketMap(lng: number, lat: number) {
        const marker = new Mapboxgl.Marker({
            draggable: true,
        })
            .setLngLat([lng, lat])
            .addTo(this.map);

        marker.on('dragend', () => {
            this.coordinatesLng = marker.getLngLat().lng;
            this.coordinatesLat = marker.getLngLat().lat;
            this.coordinatesLng ? (this.submit = false) : (this.submit = true);
        });
    }

    public onClose(): void {
        this.dialogRef.close();
    }

    public onSubmit() {
        this.dialogRef.close({ lat: this.coordinatesLat, lng: this.coordinatesLng });
    }
}
