import { Company } from './company';

export class User {
    public id: number;
    public email: string;
    public firstName1: string;
    public firstName2: string;
    public lastName1: string;
    public lastName2: string;
    public lang: string;
    public type: string;
    public status: string;
    public company: Company;

    constructor(item?: User) {
        this.id = item && item.id ? item.id : null;
        this.email = item && item.email ? item.email : null;
        this.firstName1 = item && item.firstName1 ? item.firstName1 : null;
        this.firstName2 = item && item.firstName2 ? item.firstName2 : null;
        this.lastName1 = item && item.lastName1 ? item.lastName1 : null;
        this.lastName2 = item && item.lastName2 ? item.lastName2 : null;
        this.lang = item && item.lang ? item.lang : null;
        this.type = item && item.type ? item.type : null;
        this.status = item && item.status ? item.status : null;
        this.company = item && item.company ? item.company : null;
    }
}

export class RightToSee extends User {
    public id: number;
    public companyId: number;
    public ownerId: number;
    public targetId: number;
    public isVisible: boolean;
    public owner: User;

    constructor(item?: RightToSee) {
        super();
        this.id = item && item.id ? item.id : null;
        this.companyId = item && item.companyId ? item.companyId : null;
        this.ownerId = item && item.ownerId ? item.ownerId : null;
        this.targetId = item && item.targetId ? item.targetId : null;
        this.isVisible = item && item.isVisible ? item.isVisible : null;
        this.owner = item && item.owner ? item.owner : null;
    }
}
