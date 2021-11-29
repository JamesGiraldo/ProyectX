import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { TripType } from '@apptypes/enums';
import { TripService } from '@services/trip.service';

declare var google: any;

@Component({
  selector: 'app-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.scss']
})
export class CardMapComponent implements OnInit {
  @Input('trip') trip: any;
  tripType = TripType;
  cargando = false;

  public trips: string[] = [];
  public endDate;
  public startDate;

  // initial center position for the map
  zoom: number = 8;
  lat: number = 51.673858;
  lng: number = 7.815982;

  constructor(private tripService: TripService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.startDate = this.getFormattedLastMonths();
    this.endDate = this.getFormattedTomorrow();
    this.getTrips(1, 4, this.startDate, this.endDate);
  }

  public getTrips(page: number, currentElements: number, startDate: string, endDate: string) {
    this.tripService.All(page, currentElements, startDate, endDate).subscribe( (res) => {
        this.trips = res.data.records;
        this.cargando = false;
    });
  }
  public getFormattedTomorrow(): string {
      const instant = moment(new Date()).add(3, 'd');
      return instant.format('YYYY-MM-DD');
  }

  public getFormattedLastMonths(): string {
      const instant = moment(new Date()).add(-5, 'M');
      return instant.format('YYYY-MM-DD');
  }

}
