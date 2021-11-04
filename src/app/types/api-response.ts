import { IToken } from './token';

export interface ApiResponse {
    code: number;
    message: string;
    data?: IToken | any;
    error?: any;
}

export interface ApiResponseRecords {
    records: any[];
    elementsNumber: number;
    pagesNumber: number;
}
