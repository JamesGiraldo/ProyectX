import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-yards',
    templateUrl: './yards.component.html',
    styleUrls: ['./yards.component.scss'],
})
export class YardsComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;

    constructor(private router: Router) {
        this.blockUI.start('Loading...');

        setTimeout(() => {
            this.blockUI.stop(); // Stop blocking
        }, 500);
    }

    ngOnInit(): void {
        if (this.router.url === '/yards') {
            this.router.navigateByUrl('/yards/operations');
        }
    }
}
