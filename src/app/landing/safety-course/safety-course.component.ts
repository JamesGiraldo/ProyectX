import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Driver } from '@apptypes/entities';
import { QuizService } from '@services/index';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { Quiz } from '@apptypes/entities/quiz';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-safety-course',
    templateUrl: './safety-course.component.html',
    styleUrls: ['./safety-course.component.scss'],
})
export class SafetyCourseComponent implements OnInit {
    public safetyForm: FormGroup;
    @BlockUI() blockUI: NgBlockUI;
    public seen: boolean = false;
    public exist: Driver;
    public questions: Quiz;
    public loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private readonly quizService: QuizService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    ngOnInit(): void {
        this.getQuestions();
    }

    get f() {
        return this.safetyForm.controls;
    }

    public onSubmit() {
        if (this.safetyForm.invalid) {
            return;
        }
        this.loading = true;

        let cc = this.safetyForm.get('cc').value;
        this.quizService.getDriverInfo(cc, 1, 0).subscribe(
            (res) => {
                this.exist = res.data;
                if (this.exist !== undefined) {
                    this.quizService.createQuiz(+this.exist.id, +this.questions.id).subscribe(
                        (result) => {
                            this.quizService.sendDriverQuizId(result);

                            if (result.data?.viewedVideo === true) {
                                this.goToTest();
                            } else {
                                this.openVideo(result);
                            }
                        },
                        () => {
                            this.loading = false;
                        },
                    );
                    this.loading = false;
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Cónductor no encontrado!',
                        html: 'Al parecer la cédula no fue encontrada',
                        confirmButtonText: 'Entiendo!',
                        showConfirmButton: true,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    });
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            },
        );
    }

    private createForm() {
        this.safetyForm = this.formBuilder.group({
            cc: ['', [Validators.required, Validators.pattern('^([0-9]){7,10}$')]],
        });
    }

    private getQuestions() {
        this.quizService.getAll(+this.route.snapshot.params.cc).subscribe((res) => {
            this.questions = res.data;
            this.blockUI.stop();
        });
    }

    private openVideo(idCourseQuiz) {
        this.dialog
            .open(VideoModalComponent, {
                width: '800px',
                height: '600px',
                disableClose: true,
                data: this.questions,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    let data = { viewedVideo: true, id: +idCourseQuiz.data.id };
                    this.quizService.updateSeen(+idCourseQuiz.data.id, data).subscribe((res) => {
                        this.goToTest();
                    });
                }
            });
    }

    public goToTest() {
        this.router.navigate([`/company/${this.route.snapshot.params.cc}/safety-course/take/${this.exist.idCard}`]);
    }
}
