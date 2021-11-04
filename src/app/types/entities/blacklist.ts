import { Company } from './company';

export class Blacklist {
    public id: number;
    public companyId: number;
    public vehiclePlate: string;
    public driverIdCard: string;
    public reason: string;
    public company?: Company;

    constructor(item?: Blacklist) {
        this.id = item && item.id ? item.id : null;
        this.companyId = item && item.companyId ? item.companyId : null;
        this.vehiclePlate = item && item.vehiclePlate ? item.vehiclePlate : null;
        this.driverIdCard = item && item.driverIdCard ? item.driverIdCard : null;
        this.reason = item && item.reason ? item.reason : null;
        this.company = item && item.company ? item.company : null;
    }
}
