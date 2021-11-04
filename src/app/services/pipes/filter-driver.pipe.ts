import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterDriver',
})
export class FilterDriverPipe implements PipeTransform {
    transform(value: any, arg: any): any {
        if (arg === '' || arg.length < 3) return value;
        const results = [];
        for (const driver of value) {
            if (
                driver.firstName.toLowerCase().indexOf(arg.toLowerCase()) > -1 ||
                driver.lastName.toLowerCase().indexOf(arg.toLowerCase()) > -1 ||
                driver.idCard.toLowerCase().indexOf(arg.toLowerCase()) > -1
            ) {
                results.push(driver);
            }
        }
        return results;
    }
}
