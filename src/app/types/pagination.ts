export interface IPagination {
    pagesNumber: number;
    pageElements: number;
}

export interface IPaginationWithDates extends IPagination {
    start: string;
    end: string;
}
