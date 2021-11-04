import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-video-modal',
    templateUrl: './video-modal.component.html',
    styleUrls: ['./video-modal.component.scss'],
})
export class VideoModalComponent implements OnInit {
    @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef;
    public counter = 6;
    public interval = 1000;
    public isLabel: boolean = true;
    public isVisible: boolean = true;
    public setCount;
    public value;

    constructor(
        public dialogRef: MatDialogRef<VideoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public videoData: any,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.setCount = setTimeout(() => {
            this.videoplayer.nativeElement.play();
            this.isLabel = false;
        }, 5000);
    }

    public onClose($event): void {
        clearTimeout(this.setCount);
        this.dialogRef.close($event);
        this.videoplayer.nativeElement.pause();
    }

    public onSubmit($event) {
        this.dialogRef.close($event);
    }

    public videoEnd() {
        this.isVisible = false;
    }

    ngOnDestroy() {
        this.videoplayer.nativeElement.pause();
    }
}
