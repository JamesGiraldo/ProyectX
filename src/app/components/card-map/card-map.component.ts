import { Component, OnInit } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.scss']
})
export class CardMapComponent implements OnInit {
  zoom: number = 8;

  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;
  constructor() { }

  ngOnInit(): void {
  }

}
