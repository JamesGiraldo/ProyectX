import { Company } from './company';
import { Datatype } from '../enums/datatype.enum';
import { Module } from '../enums/module.enum';

export class CustomField {
    id: number;
    companyId: number;
    name: string;
    datatype: Datatype;
    module: Module;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    options: CustomFieldOption[];
    publicationId?: number;
    customFieldId?: number;
    value?: string;
    controlStage?: string;

    constructor(item?: CustomField) {
        this.id = item && item.id ? item.id : null;
        this.companyId = item && item.companyId ? item.companyId : null;
        this.name = item && item.name ? item.name : null;
        this.datatype = item && item.datatype ? item.datatype : null;
        this.module = item && item.module ? item.module : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.company = item && item.company ? item.company : null;
        this.options = item && item.options ? item.options : null;
        if (item) {
            if (item.publicationId) this.publicationId = item.publicationId;
            if (item.customFieldId) this.customFieldId = item.customFieldId;
            if (item.value) this.value = item.value;
        }
    }
}

export class CustomFieldOption {
    id: number;
    customFieldId: number;
    value: string;
    createdAt: Date;
    updatedAt: Date;
    customField: CustomField;

    constructor(item?: CustomFieldOption) {
        this.id = item && item.id ? item.id : null;
        this.customFieldId = item && item.customFieldId ? item.customFieldId : null;
        this.value = item && item.value ? item.value : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.customField = item && item.customField ? item.customField : null;
    }
}
