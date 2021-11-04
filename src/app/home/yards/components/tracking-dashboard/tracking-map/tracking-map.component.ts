import * as Mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GlobalService, YardService } from '../../../../../services';
import { environment } from 'src/environments/environment';
import { Country } from '@apptypes/enums';

@Component({
    selector: 'app-tracking-map',
    templateUrl: './tracking-map.component.html',
    styleUrls: ['./tracking-map.component.scss'],
})
export class TrackingMapComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @Input() refreshManual: Observable<void>;
    public submit: boolean = true;
    public yards = [];
    private eventsSubscription: any;

    /* Map Colombia */
    public map;
   
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

    constructor(public readonly yardService: YardService, private readonly globalService: GlobalService) {
        this.blockUI.start('Loading...');
    }

    ngOnInit(): void {
        this.user = this.globalService.getDecodedToken().company.country?.id;

        if (this.user === this.country.PERU) {
            this.lng = this.coordinates[1].lng;
            this.lat = this.coordinates[1].lat;
        } else {
            this.lng = this.coordinates[0].lng;
            this.lat = this.coordinates[0].lat;
        }

        this.eventsSubscription = this.refreshManual.subscribe(() => this.getYards());

        (Mapboxgl as any).accessToken = environment.apiKeyMapbox;
        this.map = new Mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [this.lng, this.lat],
            zoom: 6,
        });

        this.getYards();
    }

    public showDetails() {}

    /**
     * API CALLS
     */
    private getYards() {
        this.yardService.getYardsTracking().subscribe((res) => {
            if (res.data) this.yards = res.data;

            for (let index = 0; index < this.yards.length; index++) {
                var el = document.createElement('div');
                el.className = 'marker';

                this.markerMap(this.yards[index]);
            }

            this.blockUI.stop();
        });
    }

    private markerMap(yard: any) {
        new Mapboxgl.Marker({
            draggable: false,
        })
            .setPopup(
                new Mapboxgl.Popup({ closeOnClick: true, offset: 25 }).setHTML(
                    '<h3 style="font-weight: bold;">' +
                        yard.name +
                        '</h3><p style="font-weight: bold;">Ocupación: ' +
                        this.selectCapacity(yard.capacity, yard.occupancyMaximun, yard.occupancyMinimun) +
                        ' - ' +
                        yard.capacity.toFixed(2) +
                        '%</p>',
                ),
            )
            .setLngLat([yard.longitude, yard.latitude])
            .addTo(this.map);
    }

    private selectCapacity(capacity: number, occupancyMaximun: number, occupancyMinimun: number) {
        if (capacity >= 0 && capacity <= occupancyMinimun) {
            return 'Bajo';
        } else if (capacity > occupancyMinimun && capacity <= occupancyMaximun) {
            return 'Normal';
        } else {
            return 'Alto';
        }
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
}
