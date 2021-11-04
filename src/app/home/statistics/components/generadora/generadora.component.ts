import { Component, OnInit } from '@angular/core';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Label } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as chroma from '@apptypes/chroma';

@Component({
    selector: 'app-generadora',
    templateUrl: './generadora.component.html',
    styleUrls: ['./generadora.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class GeneradoraComponent implements OnInit {
    public color_count: number = 2;
    public palette: string[] = chroma.genPalette(this.color_count);
    public pieChartOptions: ChartOptions = {
        responsive: true,
        spanGaps: false,
        legend: {
            display: true,
            position: 'right',
        },
        plugins: {
            datalabels: {
                backgroundColor: '#434343',
                color: 'white',
                formatter: (value, ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex];
                    return label;
                },
            },
        },
    };
    public pieChartLabels: Label[] = ['Transporte 1', 'Transporte 2'];
    public pieChartData: number[] = [1500, 500];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [pluginDataLabels];
    public pieChartColors = [
        {
            backgroundColor: this.palette,
        },
    ];

    constructor() {}

    ngOnInit(): void {}
}
