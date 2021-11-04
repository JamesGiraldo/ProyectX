import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDriverId' })
export class FormatDriverId implements PipeTransform {
    transform(input: number | string): string {
        if (typeof input === 'number') input = input.toString();
        return chunks(input).join('.');
    }
}

const chunks = (input: string) => {
    let slices: string[] = [];
    for (let character = input.length; character >= 0; character -= 3) {
        if (character < 3 && character >= 0) {
            slices = [input.substr(0, character), ...slices];
        } else {
            slices = [input.substr(character - 3, 3), ...slices];
        }
    }
    return slices;
};
