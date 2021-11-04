import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'formatDate' })
export class FormatDate implements PipeTransform {
    transform(input: Date | string): string {
        if (typeof input === 'string') input = new Date(input);
        let value = moment(input);
        return value.format('YYYY-MM-DD HH:mm');
    }
}
