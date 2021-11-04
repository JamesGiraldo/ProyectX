import * as chroma from 'chroma-js';

const baseColors: string[] = ['#eabd5d', '#cb5b5a', '#ac557a', '#8d4c7d', '#6b406e', '#40324f'];

const genPalette = function (color_count: number): string[] {
    let colors: string[] = chroma.scale(baseColors).mode('lch').colors(color_count);
    return colors;
}

export {
    genPalette
}