export class Yard {
    public id?: number;
    public companyId?: number;
    public vehicleLimit?: number;
    public name?: string;
    public latitude?: string;
    public longitude?: string;

    constructor(item?: any) {
        this.id = item.id ? item.id : null;
        this.companyId = item.companyId ? item.companyId : null;
        this.vehicleLimit = item.vehicleLimit ? item.vehicleLimit : null;
        this.name = item.name ? item.name : null;
        this.latitude = item.latitude ? item.latitude : null;
        this.longitude = item.longitude ? item.longitude : null;
    }
}
export class Stage {
    public id?: number;
    public yardId?: number;
    public name?: string;
    public color?: string;

    constructor(item?: any) {
        this.id = item.id ? item.id : null;
        this.yardId = item.yardId ? item.yardId : null;
        this.name = item.name ? item.name : null;
        this.color = item.color ? item.color : null;
    }
}
