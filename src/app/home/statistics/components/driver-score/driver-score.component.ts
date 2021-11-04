import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Driver } from '@apptypes/entities/driver';

@Component({
    selector: 'app-driver-score',
    templateUrl: './driver-score.component.html',
    styleUrls: ['./driver-score.component.scss'],
})
export class DriverScoreComponent implements OnInit {
    @Input('driver') driver: Driver;
    @Input('place') place: number;
    public ratings: string[];

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.driver) {
            const driver = <Driver>changes.driver.currentValue;
            this.ratings = this.generateRatings(driver.rating);
        }
    }

    public generateRatings(rating: number): string[] {
        const floor = Math.floor(rating);
        const ceil = Math.ceil(rating);
        let ratings: string[] = [];
        for (let index: number = 0; index < ceil; index++) {
            index < floor ? ratings.push('star') : ratings.push('star_half');
        }
        if (ratings.length < 5) {
            for (let index: number = ratings.length - 1; index < 4; index++) {
                ratings.push('star_border');
            }
        }
        return ratings;
    }

    get driverName() {
        return this.driver.firstName !== '' ? `${this.driver.firstName} ${this.driver.lastName}` : '--- Sin nombre ---';
    }
}
