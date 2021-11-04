import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'na',
})
export class NaPipe implements PipeTransform {
    transform(value: string): string {
        if (value === undefined || value === '' || value === null || value === '0') {
            return (value = 'N/A');
        } else {
            return value;
        }
    }
}
