import { Company } from './company';

export class Quiz {
    id: number;
    active: boolean;
    company: Company;
    companyId: number;
    files: File;
    minScore: string;
    questions: Question;
    score: string;
    title: string;
}

export class File {
    fileUrl: string;
}

export class Question {
    active: boolean;
    answers: Answer;
    name: string;
    type: string;
}

export class Answer {
    description: string;
}
