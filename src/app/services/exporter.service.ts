import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

@Injectable({
    providedIn: 'root',
})
export class ExporterService {
    constructor(private datePipe: DatePipe) {}

    public exportToExcelRequest(data: any, excelFileName: string): void {
        const title = 'Informe de solicitudes';
        const header = [
            'Fecha de publicación',
            'Fecha de cargue',
            'Tipo de publicación',
            'ID solicitud',
            'Descripción',
            'Tipo de carga',
            'Cliente',
            'Ciudad(es) de origen',
            'Ciudad(es) de destino',
            'Lugar(es) de cargue',
            'Lugar(es) de descargue',
            'Tipo de tarifa',
            'Tarifa',
            'Tarifa máxima',
            'Modalidad tarifa',
            'Vehículos',
            'Tipo de vehículos',
            'Carrocería',
            'Largo',
            'Ancho',
            'Alto',
            'Peso',
            'Volumen',
            'Tipo de asignación',
            'Estado de solicitud',
            'Realizada por',
        ];

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Reporte de solicitudes');

        //Add Row and formatting
        let titleRow = worksheet.addRow([title]);
        titleRow.height = 44;
        titleRow.alignment = { vertical: 'middle', horizontal: 'left' };

        //Merge Cells
        worksheet.mergeCells(`A${titleRow.number}:AZ${titleRow.number}`);

        titleRow.font = {
            name: 'Candara',
            family: 4,
            size: 24,
            bold: true,
        };
        worksheet.addRow([]);

        //Add Header Row
        let headerRow = worksheet.addRow(header);

        // Cell Style : Fill and Border
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FBAF3B' },
            };
            cell.font = {
                color: { argb: 'FFFFFF' },
                name: 'Calibri',
                family: 4,
                size: 13,
                bold: true,
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        headerRow.height = 36;

        let dataRows;
        let requestId = [];
        // Add Data and Conditional Formatting
        data.forEach((d) => {
            requestId.push(d['Id solicitud']);
            const rows = [
                [
                    this.datePipe.transform(d['Fecha de publicacion'], 'medium'),
                    this.datePipe.transform(d['Fecha de cargue'], 'medium'),
                    d['Tipo de publicacion'],
                    d['Id solicitud'],
                    d['Descripción'],
                    d['Tipo de carga'],
                    d['Cliente'],
                    d['Ciudad(es) origen'],
                    d['Ciudad(es) destino'],
                    d['Lugar(es) de cargue'],
                    d['Lugar(es) de descargue'],
                    d['Tipo de tarifa'],
                    d['Tarifa'],
                    d['Tarifa maxima'],
                    d['Modalidad tarifa'],
                    d['Numero de vehiculos'],
                    d['Tipo de vehiculos'],
                    d['Carroceria'],
                    d['Largo'],
                    d['Ancho'],
                    d['Alto'],
                    d['Peso'],
                    d['Volumen'],
                    d['Tipo de asignación'],
                    d['Estado de solicitud'],
                    d['Realizada por'],
                ], // row by array
            ];
            // add new rows and return them as array of row objects
            dataRows = worksheet.addRows(rows);
            dataRows[0].eachCell((cell, number) => {
                cell.alignment = { wrapText: true };
            });
        });

        /* Width */
        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 25;
        worksheet.getColumn(4).width = 25;
        worksheet.getColumn(5).width = 50;
        worksheet.getColumn(6).width = 20;
        worksheet.getColumn(7).width = 25;
        worksheet.getColumn(8).width = 40;
        worksheet.getColumn(9).width = 40;
        worksheet.getColumn(10).width = 40;
        worksheet.getColumn(11).width = 40;
        worksheet.getColumn(12).width = 30;
        worksheet.getColumn(13).width = 25;
        worksheet.getColumn(14).width = 25;
        worksheet.getColumn(15).width = 25;
        worksheet.getColumn(16).width = 16;
        worksheet.getColumn(17).width = 40;
        worksheet.getColumn(18).width = 25;
        worksheet.getColumn(19).width = 13;
        worksheet.getColumn(20).width = 13;
        worksheet.getColumn(21).width = 13;
        worksheet.getColumn(22).width = 13;
        worksheet.getColumn(23).width = 13;
        worksheet.getColumn(24).width = 40;
        worksheet.getColumn(25).width = 30;
        worksheet.getColumn(26).width = 45;

        worksheet.addRow([]);
        //Footer Row
        let footerRow = worksheet.addRow([
            `Este reporte fue generado a través de la plataforma de CargoApp V2 - Fecha generado: ${this.datePipe.transform(
                new Date(),
                'medium',
            )}`,
        ]);
        footerRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EFF3F5' },
        };
        footerRow.font = {
            italic: true,
        };
        footerRow.getCell(1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        footerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        //Merge Cells
        worksheet.mergeCells(`A${footerRow.number}:AZ${footerRow.number}`);

        /* Custom Fields */
        if (data && data.length > 0) {
            let dataSend = [];
            data.forEach((element) => {
                dataSend.push(element?.newCustomFields.sort((a, b) => a.customFieldId - b.customFieldId));
            });
            if (dataSend.length > 0) {
                this.sheetCustomField(dataSend, requestId, workbook, 'Campos personalizados');
            }
        }

        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
                type: EXCEL_TYPE,
            });
            FileSaver.saveAs(blob, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXT);
        });
    }

    public exportToExcelTrips(data: any, excelFileName: string): void {
        const title = 'Informe de estados';
        const header = [
            'Fecha de publicación',
            'Fecha de reporte',
            'Fecha de cargue',
            'ID solicitud',
            'Descripción de la solicitud',
            'Tipo de carga',
            'Clientes',
            'Ciudad(es) origen',
            'Ciudad(es) destino',
            'Lugar(es) de cargue',
            'Lugar(es) de descargue',
            'Tipo de tarifa',
            'Modalidad de tarifa',
            'Tipo de vehículo',
            'Capacidad del vehículos',
            'Tarifa de solicitud',
            'Tarifa de reporte',
            'Carrocería',
            'Largo',
            'Ancho',
            'Alto',
            'Peso',
            'Volumen',
            'Tipo de asignación',
            'Observación - reporte',
            'Motivo de rechazo o cancelación',
            'Estado',
        ];

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Informe de estados');

        //Add Row and formatting
        let titleRow = worksheet.addRow([title]);
        titleRow.height = 44;
        titleRow.alignment = { vertical: 'middle', horizontal: 'left' };

        //Merge Cells
        worksheet.mergeCells(`A${titleRow.number}:AZ${titleRow.number}`);

        titleRow.font = {
            name: 'Candara',
            family: 4,
            size: 24,
            bold: true,
        };
        worksheet.addRow([]);

        //Add Header Row
        let headerRow = worksheet.addRow(header);

        // Cell Style : Fill and Border
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FBAF3B' },
            };
            cell.font = {
                color: { argb: 'FFFFFF' },
                name: 'Calibri',
                family: 4,
                size: 13,
                bold: true,
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        headerRow.height = 36;

        let dataRows;
        // Add Data and Conditional Formatting
        let requestId = [];
        data.forEach((d) => {
            requestId.push(d['Id solicitud']);
            const rows = [
                [
                    this.datePipe.transform(d['Fecha de publicacion'], 'medium'),
                    this.datePipe.transform(d['Fecha de reporte'], 'medium'),
                    this.datePipe.transform(d['Fecha de cargue'], 'medium'),
                    d['Id solicitud'],
                    d['Descripcion de la solicitud'],
                    d['Tipo de carga'],
                    d['Clientes'],
                    d['Ciudad(es) origen'],
                    d['Ciudad(es) destino'],
                    d['Lugar(es) de cargue'],
                    d['Lugar(es) de descargue'],
                    d['Tipo de tarifa'],
                    d['Modalidad de tarifa'],
                    d['Tipo de vehiculo'],
                    d['Capacidad del vehiculos'],
                    d['Tarifa de solicitud'],
                    d['Tarifa de reporte'],
                    d['Carroceria'],
                    d['Largo'],
                    d['Ancho'],
                    d['Alto'],
                    d['Peso'],
                    d['Volumen'],
                    d['Tipo de asignacion'],
                    d['Observación - reporte'],
                    d['Motivo de rechazo o cancelación'],
                    d['Estado'],
                ], // row by array
            ];
            // add new rows and return them as array of row objects
            dataRows = worksheet.addRows(rows);
            dataRows[0].eachCell((cell, number) => {
                cell.alignment = { wrapText: true };
            });
        });

        /* Width */
        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 30;
        worksheet.getColumn(4).width = 25;
        worksheet.getColumn(5).width = 30;
        worksheet.getColumn(6).width = 25;
        worksheet.getColumn(7).width = 25;
        worksheet.getColumn(8).width = 40;
        worksheet.getColumn(9).width = 40;
        worksheet.getColumn(10).width = 40;
        worksheet.getColumn(11).width = 40;
        worksheet.getColumn(12).width = 25;
        worksheet.getColumn(13).width = 25;
        worksheet.getColumn(14).width = 25;
        worksheet.getColumn(15).width = 28;
        worksheet.getColumn(16).width = 25;
        worksheet.getColumn(17).width = 25;
        worksheet.getColumn(18).width = 25;
        worksheet.getColumn(19).width = 13;
        worksheet.getColumn(20).width = 13;
        worksheet.getColumn(21).width = 13;
        worksheet.getColumn(22).width = 13;
        worksheet.getColumn(23).width = 13;
        worksheet.getColumn(24).width = 30;
        worksheet.getColumn(25).width = 40;
        worksheet.getColumn(26).width = 40;
        worksheet.getColumn(27).width = 25;

        worksheet.addRow([]);
        //Footer Row
        let footerRow = worksheet.addRow([
            `Este reporte fue generado a través de la plataforma de CargoApp V2 - Fecha generado: ${this.datePipe.transform(
                new Date(),
                'medium',
            )}`,
        ]);
        footerRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EFF3F5' },
        };
        footerRow.font = {
            italic: true,
        };
        footerRow.getCell(1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        footerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        //Merge Cells
        worksheet.mergeCells(`A${footerRow.number}:AZ${footerRow.number}`);

        /* Custom Fields */
        if (data && data.length > 0) {
            /* Add Trip Report */
            let dataSend = [];
            data.forEach((element) => {
                dataSend.push({
                    ID: element['Id solicitud'],
                    date: element['Fecha de cargue de reporte'],
                    transporter: element['Transportadora'],
                    plate: element['Placa'],
                    name: element['Nombre del conductor'],
                    cc: element['Cedula del conductor'],
                    phone: element['Celular del conductor'],
                    /* Status */
                    not_started: element['status']['No iniciado'],
                    origin: element['status']['En origen'],
                    waiting: element['status']['Carga en espera'],
                    loaded: element['status']['Cargado'],
                    route_origin: element['status']['En ruta a origen'],
                    destination_route: element['status']['En ruta a destino'],
                    destination: element['status']['En destino'],
                    unloading: element['status']['Descargando'],
                    completed: element['status']['Completado'],
                    canceled: element['status']['Cancelado'],
                });
            });

            /* Add sheet custom */
            let dataSendCustom = [];
            data.forEach((element) => {
                dataSendCustom.push(element?.newCustomFields.sort((a, b) => a.customFieldId - b.customFieldId));
            });

            this.sheetTripReport(dataSend, dataSendCustom, workbook, 'Reportes de estado');
        }

        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
                type: EXCEL_TYPE,
            });
            FileSaver.saveAs(blob, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXT);
        });
    }

    /* Add sheet Custom Fields */
    private sheetCustomField(data, requestId, workbook, title) {
        const titleCustom = title;
        const headerCustom = [''];
        data.forEach((element) => {
            for (let i = 0; i < element.length; i++) {
                headerCustom.push(element[i].name);
            }
        });
        let result = headerCustom.filter((item, index) => {
            return headerCustom.indexOf(item) === index;
        });

        let worksheetCustom = workbook.addWorksheet('Campos personalizados');

        let titleRowCustom = worksheetCustom.addRow([titleCustom]);
        titleRowCustom.height = 44;
        titleRowCustom.alignment = { vertical: 'middle', horizontal: 'left' };

        worksheetCustom.mergeCells(`A${titleRowCustom.number}:AZ${titleRowCustom.number}`);

        titleRowCustom.font = {
            name: 'Candara',
            family: 4,
            size: 24,
            bold: true,
        };
        worksheetCustom.addRow([]);

        let headerRowCustom = worksheetCustom.addRow(result);
        headerRowCustom.getCell(1).value = 'ID Solicitud';
        headerRowCustom.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FBAF3B' },
            };
            cell.font = {
                color: { argb: 'FFFFFF' },
                name: 'Calibri',
                family: 4,
                size: 13,
                bold: true,
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        headerRowCustom.height = 36;

        let rowsCustom = [];
        let body;
        /* Add data without sorting */
        data.forEach((element, index) => {
            for (let i = 0; i < element.length; i++) {
                rowsCustom.push(element[i].value);
            }
            rowsCustom.unshift(['']);

            body = worksheetCustom.addRow(rowsCustom);
            body.getCell(1).value = requestId[index];
            rowsCustom = [];
            // add new rows and return them as array of row objects
        });

        for (let i = data[0]?.length; i >= 0; i--) {
            worksheetCustom.getColumn(i + 1).width = 30;
        }

        worksheetCustom.addRow([]);

        let footerRowCustom = worksheetCustom.addRow([
            `Este reporte fue generado a través de la plataforma de CargoApp V2 - Fecha generado: ${this.datePipe.transform(
                new Date(),
                'medium',
            )}`,
        ]);
        footerRowCustom.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EFF3F5' },
        };
        footerRowCustom.font = {
            italic: true,
        };
        footerRowCustom.getCell(1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        footerRowCustom.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheetCustom.mergeCells(`A${footerRowCustom.number}:AZ${footerRowCustom.number}`);
    }

    /* Add sheet Custom Fields */
    private sheetTripReport(data, custom, workbook, title) {
        const titleCustom = title;
        const header = [
            'ID Solicitud',
            'Fecha de cargue de reporte',
            'Transportadora',
            'Placa',
            'Nombre del conductor',
            'Cédula del conductor',
            'Celular del conductor',
            'No iniciado',
            'En origen',
            'Carga en espera',
            'Cargado',
            'En ruta a origen',
            'En ruta a destino',
            'En destino',
            'Descargando',
            'Completado',
            'Cancelado',
        ];
        const headerCustom = [];
        let worksheetCustom = workbook.addWorksheet('Reportes de estado');

        let titleRowCustom = worksheetCustom.addRow([titleCustom]);
        titleRowCustom.height = 44;
        titleRowCustom.alignment = { vertical: 'middle', horizontal: 'left' };

        worksheetCustom.mergeCells(`A${titleRowCustom.number}:AZ${titleRowCustom.number}`);

        titleRowCustom.font = {
            name: 'Candara',
            family: 4,
            size: 24,
            bold: true,
        };
        worksheetCustom.addRow([]);
        custom.forEach((element) => {
            for (let i = 0; i < element.length; i++) {
                headerCustom.push(element[i].name);
            }
        });

        let result = headerCustom.filter((item, index) => {
            return headerCustom.indexOf(item) === index;
        });

        let headerFormat = header.concat(result);
        let headerRowCustom = worksheetCustom.addRow(headerFormat);
        headerRowCustom.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FBAF3B' },
            };
            cell.font = {
                color: { argb: 'FFFFFF' },
                name: 'Calibri',
                family: 4,
                size: 13,
                bold: true,
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        headerRowCustom.height = 36;

        let dataRows;
        // Add Data and Conditional Formatting
        data.forEach((d) => {
            let bodyCustom = [];
            const rows = [
                [
                    d['ID'] ? d['ID'] : null,
                    d['date'] ? d['date'] : null,
                    d['transporter'] ? d['transporter'] : null,
                    d['plate'] ? d['plate'] : null,
                    d['name'] ? d['name'] : null,
                    d['cc'] ? d['cc'] : null,
                    d['phone'] ? d['phone'] : null,
                    d['not_started'] ? d['not_started'] : null,
                    d['origin'] ? d['origin'] : null,
                    d['waiting'] ? d['waiting'] : null,
                    d['loaded'] ? d['loaded'] : null,
                    d['route_origin'] ? d['route_origin'] : null,
                    d['destination_route'] ? d['destination_route'] : null,
                    d['destination'] ? d['destination'] : null,
                    d['unloading'] ? d['unloading'] : null,
                    d['completed'] ? d['completed'] : null,
                    d['canceled'] ? d['canceled'] : null,
                ],
            ];
            let bodyFormat;

            /* custom.forEach((element) => {
                for (let i = 0; i < element.length; i++) {
                    bodyCustom.push(element[i].value);
                }
            });

            bodyFormat = rows.concat(bodyCustom);
            console.log(bodyFormat);
 */
            // add new rows and return them as array of row objects
            dataRows = worksheetCustom.addRows(rows);
            dataRows[0].eachCell((cell, number) => {
                cell.alignment = { wrapText: true };
            });
        });

        worksheetCustom.getColumn(1).width = 30;
        worksheetCustom.getColumn(2).width = 30;
        worksheetCustom.getColumn(3).width = 30;
        worksheetCustom.getColumn(4).width = 30;
        worksheetCustom.getColumn(5).width = 30;
        worksheetCustom.getColumn(6).width = 30;
        worksheetCustom.getColumn(7).width = 30;
        worksheetCustom.getColumn(8).width = 30;
        worksheetCustom.getColumn(9).width = 30;
        worksheetCustom.getColumn(10).width = 30;
        worksheetCustom.getColumn(11).width = 30;
        worksheetCustom.getColumn(12).width = 30;
        worksheetCustom.getColumn(13).width = 30;
        worksheetCustom.getColumn(14).width = 30;
        worksheetCustom.getColumn(15).width = 30;
        worksheetCustom.getColumn(16).width = 30;
        worksheetCustom.getColumn(17).width = 30;
        for (let i = 17; i < headerFormat.length; i++) {
            worksheetCustom.getColumn(i + 1).width = 30;
        }

        worksheetCustom.addRow([]);

        let footerRowCustom = worksheetCustom.addRow([
            `Este reporte fue generado a través de la plataforma de CargoApp V2 - Fecha generado: ${this.datePipe.transform(
                new Date(),
                'medium',
            )}`,
        ]);
        footerRowCustom.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EFF3F5' },
        };
        footerRowCustom.font = {
            italic: true,
        };
        footerRowCustom.getCell(1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        footerRowCustom.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheetCustom.mergeCells(`A${footerRowCustom.number}:AZ${footerRowCustom.number}`);
    }
}
