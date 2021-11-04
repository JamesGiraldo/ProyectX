import { Ownership } from './vehicle';

export class Driver {
    public id: number;
    public rating: number;
    public idCard: number;
    public phone: string;
    public firstName: string;
    public lastName: string;
    public lang: string;
    public password: string;
    public available: boolean;
    public enabled: boolean;
    public currentLatitude: string;
    public currentLongitude: string;
    public socialSecurityDate: string;
    public socialSecurityUrl: string;
    public licenseDate: string;
    public licenseUrl: string;
    public companyOwnerships: Ownership;

    constructor(item?: Driver) {
        this.id = item && item.id ? item.id : null;
        this.rating = item && item.rating ? item.rating : null;
        this.idCard = item && item.idCard ? item.idCard : null;
        this.phone = item && item.phone ? item.phone : null;
        this.firstName = item && item.firstName ? item.firstName : null;
        this.lastName = item && item.lastName ? item.lastName : null;
        this.lang = item && item.lang ? item.lang : null;
        this.password = item && item.password ? item.password : null;
        this.available = item && item.available ? item.available : null;
        this.enabled = item && item.enabled ? item.enabled : null;
        this.currentLatitude = item && item.currentLatitude ? item.currentLatitude : null;
        this.currentLongitude = item && item.currentLongitude ? item.currentLongitude : null;
        this.socialSecurityDate =
            item && item.socialSecurityDate
                ? item.socialSecurityDate
                : new Date(new Date(new Date().setMonth(new Date().getMonth() + 1))).toISOString();
        this.socialSecurityUrl = item && item.socialSecurityUrl ? item.socialSecurityUrl : null;
        this.licenseDate =
            item && item.licenseDate
                ? item.licenseDate
                : new Date(new Date(new Date().setMonth(new Date().getMonth() + 1))).toISOString();
        this.licenseUrl = item && item.licenseUrl ? item.licenseUrl : null;
        this.companyOwnerships = item && item.companyOwnerships ? item.companyOwnerships : null;
    }
}
