export class Company {
    public id: number;
    public type: string;
    public state: string;
    public email: string;
    public name: string;
    public address: string;
    public phoneCode: string;
    public phone: string;
    public rating: number;

    constructor(item?: Company) {
        this.id = item && item.id ? item.id : null;
        this.type = item && item.type ? item.type : null;
        this.state = item && item.state ? item.state : null;
        this.email = item && item.email ? item.email : null;
        this.name = item && item.name ? item.name : null;
        this.address = item && item.address ? item.address : null;
        this.phoneCode = item && item.phoneCode ? item.phoneCode : null;
        this.phone = item && item.phone ? item.phone : null;
        this.rating = item && item.rating ? item.rating : null;
    }
}