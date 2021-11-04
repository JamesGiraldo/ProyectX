import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    constructor(private router: Router) {}

    ngOnInit(): void {
        if (this.router.url === '/') {
            this.router.navigateByUrl('/home');
        }
    }
}
