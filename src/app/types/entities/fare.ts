import { Company } from './company';
import { VehicleType } from './vehicle';

export class Fare {
    public id: number;
    public generatorId: number;
    public transporterId: number;
    public name: string;
    public createdAt: Date;
    public updatedAt: Date;
    public generator: Company;
    public transporter: Company;
    public origins: FareLocation[];
    public destinies: FareLocation[];
    public records: FareRecord[];

    constructor(item?: Fare) {
        this.id = item && item.id ? item.id : null;
        this.generatorId = item && item.generatorId ? item.generatorId : null;
        this.transporterId = item && item.transporterId ? item.transporterId : null;
        this.name = item && item.name ? item.name : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.generator = item && item.generator ? item.generator : null;
        this.transporter = item && item.transporter ? item.transporter : null;
        this.origins = item && item.origins ? item.origins : null;
        this.destinies = item && item.destinies ? item.destinies : null;
        this.records = item && item.records ? item.records : null;
    }
}

export class FareLocation {
    id: number;
    fareId: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    fare: Fare;

    constructor(item?: FareLocation) {
        this.id = item && item.id ? item.id : null;
        this.fareId = item && item.fareId ? item.fareId : null;
        this.name = item && item.name ? item.name : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.fare = item && item.fare ? item.fare : null;
    }
}

export class FareRecord {
    id: number;
    fareSubscriptionId: number;
    vehicleType: VehicleType;
    tonnagePrice: number;
    tripPrice: number;
    roundTripPrice: number;
    createdAt: Date;
    updatedAt: Date;
    fare: Fare;

    constructor(item?: FareRecord) {
        this.id = item && item.id ? item.id : null;
        this.fareSubscriptionId = item && item.fareSubscriptionId ? item.fareSubscriptionId : null;
        this.vehicleType = item && item.vehicleType ? item.vehicleType : null;
        this.tonnagePrice = item && item.tonnagePrice ? item.tonnagePrice : null;
        this.tripPrice = item && item.tripPrice ? item.tripPrice : null;
        this.roundTripPrice = item && item.roundTripPrice ? item.roundTripPrice : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.fare = item && item.fare ? item.fare : null;
    }
}
