import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HandleErrorService, QuizService } from '@services/index';
import { Quiz } from '@entities/quiz';
import { Driver } from '@apptypes/entities';

@Component({
    selector: 'app-test-form',
    templateUrl: './test-form.component.html',
    styleUrls: ['./test-form.component.scss'],
})
export class TestFormComponent implements OnInit {
    public dataQuiz: Quiz;
    @BlockUI() blockUI: NgBlockUI;
    public quizForm: FormGroup;
    public today = new Date();
    public driverQuizId;
    public questionArray = [];
    public questionLength;
    public quizInvalid: boolean;
    public driver: Driver;

    constructor(
        private formBuilder: FormBuilder,
        private handleErrorService: HandleErrorService,
        private readonly quizService: QuizService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.blockUI.start('Loading...');
        this.createForm();
    }

    get f() {
        return this.quizForm.controls;
    }

    ngOnInit(): void {
        this.getQuiz();
        this.getDriver(this.route.snapshot.params.key);

        this.quizService.driverQuizIdObservable.subscribe((resId) => (this.driverQuizId = resId));

        if (this.driverQuizId === null) {
            this.onFailure();
        }

        this.quizService.getDriverInfo(this.route.snapshot.params.key, 1, 0).subscribe((res) => {
            if (res.code < 1000)
                Swal.fire({
                    icon: 'warning',
                    title: 'Conductor no encontrado!',
                    html: 'Este conductor no tiene examen asignado',
                    confirmButtonText: 'Entiendo!',
                    showConfirmButton: true,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.router.navigate([`/company/${this.route.snapshot.params.cc}/safety-course`]);
                    }
                });
        });
    }

    get getQuestions(): FormArray {
        return this.quizForm.get('questions') as FormArray;
    }

    public onCancel() {
        this.router.navigate([`/company/${this.route.snapshot.params.cc}/safety-course`]);
    }

    public onChecked(questionId, answerOptionId) {
        this.questionArray.forEach((element, index) => {
            if (element.questionId === questionId) {
                this.questionArray[index].answerOptionId = answerOptionId;
            }
        });
    }

    public onSubmit() {
        if (this.driverQuizId === null) {
            this.onFailure();
        }

        this.quizService.sendQuiz(this.dataQuiz.id, this.questionArray).subscribe(
            (res) => {
                if (res.code >= 1000) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Resultados del curso!',
                        html: res.message,
                        confirmButtonText: 'Entiendo!',
                        showConfirmButton: true,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.router.navigate([`/company/${this.route.snapshot.params.cc}/safety-course`]);
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Resultados del curso!',
                        html: res.error,
                        confirmButtonText: 'Volver a intentarlo!',
                        showConfirmButton: true,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.router.navigate([`/company/${this.route.snapshot.params.cc}/safety-course`]);
                        }
                    });
                }
            },
            (err) => this.handleErrorService.onFailure(err),
        );
    }

    public takePhoto() {}

    private createForm() {
        this.quizForm = this.formBuilder.group({
            questions: this.formBuilder.array([]),
        });
        this.addQuestion();
    }

    public addQuestion() {
        const control = this.quizForm.controls['questions'] as FormArray;
        control.push(
            this.formBuilder.group({
                driverQuizId: [],
                questionId: ['', [Validators.required]],
                answerOptionId: ['', [Validators.required]],
            }),
        );
    }

    private getDriver(id: string) {
        this.quizService.getDriverInfo(id, 1, 0).subscribe((res) => {
            this.driver = res.data;
        });
    }

    private getQuiz() {
        this.quizService.getAll(this.route.snapshot.params.cc).subscribe((res) => {
            this.dataQuiz = res.data;
            this.questionLength = res.data.questions.length;
            res.data.questions.map((x) => {
                this.questionArray.push({
                    driverQuizId: 1,
                    questionId: x.id,
                    answerOptionId: null,
                });
            });

            this.blockUI.stop();
        });
    }

    private onFailure() {
        Swal.fire({
            icon: 'warning',
            title: 'La sesión caducó!',
            html:
                'La plataforma detectó que se recargó la página del navegador ocasionando que la sesión se borrara. Se redireccionará al inicio para que vuelva a ingresar.',
            confirmButtonText: 'Entiendo!',
            showConfirmButton: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                this.router.navigate([`/company/${this.route.snapshot.params.cc}/safety-course`]);
            }
        });
    }
}
