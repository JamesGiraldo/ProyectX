import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RightToSee, User } from '@apptypes/entities';
import { HandleErrorService, UserService } from '@services/index';

@Component({
    selector: 'app-modal-newpermission',
    templateUrl: './modal-newpermission.component.html',
    styleUrls: ['./modal-newpermission.component.scss'],
})
export class ModalNewpermissionComponent implements OnInit {
    public loading: boolean = false;
    public rights: RightToSee[];
    public selected;
    public selectedOptions;

    constructor(
        @Inject(MAT_DIALOG_DATA) public rightData: any,
        private cdRef: ChangeDetectorRef,
        private userService: UserService,
        private handleErrorService: HandleErrorService,
        public dialogRef: MatDialogRef<ModalNewpermissionComponent>,
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getUsers(this.rightData);
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    public onClose() {
        this.dialogRef.close();
    }

    public onChangeRightToSee(right) {
        this.selectedOptions = right.option.value;
        this.selected = right.option.selected;

        const data = {
            rights: [
                {
                    id: this.selectedOptions.id,
                    companyId: this.selectedOptions.companyId,
                    ownerId: this.selectedOptions.ownerId,
                    targetId: this.selectedOptions.targetId,
                    isVisible: this.selected,
                },
            ],
        };
        this.userService.updateRightToSee(data).subscribe(
            () => {},
            (err) => this.handleErrorService.onFailure(err),
        );
    }

    private getUsers(id: User): void {
        this.userService.getRightToSee(id).subscribe((res) => {
            this.loading = false;
            this.rights = [...res.data];
        });
    }
}
