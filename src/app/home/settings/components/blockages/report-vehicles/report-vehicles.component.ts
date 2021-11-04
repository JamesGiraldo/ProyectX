import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-vehicles',
  templateUrl: './report-vehicles.component.html',
  styleUrls: ['./report-vehicles.component.scss']
})
export class ReportVehiclesComponent implements OnInit {
  loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
