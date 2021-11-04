import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceType',
})
export class ReplaceTypesPipe implements PipeTransform {
    transform(value: string): any {
        var type = value.replace(/_/g, ' ');
        return type;
    }
}
