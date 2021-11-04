import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Blacklist } from '@entities/blacklist';
import { take } from 'rxjs/operators';
import { HandleErrorService } from '../../../../../services';
import { BlacklistService } from '../../../../../services/blacklist.service';

@Component({
    selector: '[blacklist-detail]',
    templateUrl: './blacklist-detail.component.html',
    styleUrls: ['./blacklist-detail.component.scss'],
})
export class BlacklistDetailComponent implements OnInit {
    @Input('blacklist') blacklist: Blacklist;
    @Output('removed') removed: EventEmitter<number> = new EventEmitter<number>();

    constructor(private blacklistService: BlacklistService, private handleErrorService: HandleErrorService) {}

    ngOnInit(): void {}

    /**
     * EVENT HANDLERS
     */
    public onRemoveClicked() {
        this.removeBlacklist();
    }

    /**
     * API CALLS
     */
    removeBlacklist() {
        this.blacklistService.removeBlackListRecord(this.blacklist.id).subscribe(
            (res) => {
                this.handleErrorService.controlError(res);
                this.handleErrorService.closeEnd$.pipe(take(1)).subscribe((res) => {
                    this.removed.emit(this.blacklist.id);
                });
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }
}
