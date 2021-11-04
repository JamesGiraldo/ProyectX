import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
    @Input() public page: number;
    @Input() public totalPages: number;
    @Input() public elementPages: number;
    @Output() pageEmitter: EventEmitter<number> = new EventEmitter();
    @Output() limitEmitter: EventEmitter<number> = new EventEmitter();
    public isTracking: boolean;

    constructor(private router: Router) {}

    ngOnInit(): void {
        if (this.router.url === '/yards/tracking') {
            this.isTracking = true;
        } else {
            this.isTracking = false;
        }
    }

    siguiente() {
        this.page++;
        this.pasarPagina();
    }

    anterior() {
        this.page--;
        this.pasarPagina();
    }

    pasarPagina() {
        this.pageEmitter.emit(this.page);
    }

    onOptionsSelected($event) {
        this.limitEmitter.emit($event);
    }
}
