import { Acceptance, VehicleType } from '../enums';
import { Offer } from './offer';
import { User } from './user';

export class Report {
    id: number;
    offerId: number;
    transporterUserId: number;
    state: Acceptance;
    vehicleType: VehicleType;
    fareValue: number;
    vehicleCapacity: number;
    vehiclePlate: string;
    driverIdCard: string;
    driverName: string;
    driverPhone: string;
    trailerNumber: string;
    observation: string;
    reasonCancelled: string;
    reasonAccepted: string;
    loadDate: Date;
    createdAt: Date;
    updatedAt: Date;
    offer: Offer;
    transporterUser: User;
    maximumFare!: number;
    shiftSchedule?: string;
    //trip: Trip

    constructor(item?: Report) {
        this.id = item && item.id ? item.id : null;
        this.offerId = item && item.offerId ? item.offerId : null;
        this.transporterUserId = item && item.transporterUserId ? item.transporterUserId : null;
        this.state = item && item.state ? item.state : null;
        this.vehicleType = item && item.vehicleType ? item.vehicleType : null;
        this.fareValue = item && item.fareValue ? item.fareValue : null;
        this.vehicleCapacity = item && item.vehicleCapacity ? item.vehicleCapacity : null;
        this.vehiclePlate = item && item.vehiclePlate ? item.vehiclePlate : null;
        this.driverIdCard = item && item.driverIdCard ? item.driverIdCard : null;
        this.driverName = item && item.driverName ? item.driverName : null;
        this.driverPhone = item && item.driverPhone ? item.driverPhone : null;
        this.trailerNumber = item && item.trailerNumber ? item.trailerNumber : null;
        this.observation = item && item.observation ? item.observation : null;
        this.reasonCancelled = item && item.reasonCancelled ? item.reasonCancelled : null;
        this.reasonAccepted = item && item.reasonAccepted ? item.reasonAccepted : null;
        this.loadDate = item && item.loadDate ? item.loadDate : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.offer = item && item.offer ? item.offer : null;
        this.transporterUser = item && item.transporterUser ? item.transporterUser : null;
    }
}

export class ReportYardControl {
    public yardsId: number[];
    public stages: number[];
    public searchParam?: string;

    constructor(item?: ReportYardControl) {
        this.yardsId = item && item.yardsId ? item.yardsId : null;
        this.stages = item && item.stages ? item.stages : null;
        this.searchParam = item && item.searchParam ? item.searchParam : '';
    }
}
