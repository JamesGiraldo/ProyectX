import { Publication } from './publication';
import { VehicleType, BodyworkType, OfferStatus } from '../enums';
import { Report } from './report';

export class Offer {
    id: number;
    publicationId: number;
    vehicleType: VehicleType;
    vehicleBodywork: BodyworkType;
    state: OfferStatus;
    vehicleLimit: number;
    proposedFare: number;
    maximumFare: number;
    createdAt: Date;
    updatedAt: Date;
    publication: Publication;
    reports: Report[];
    // shares: SharedOffer[];

    constructor(item?: Offer) {
        this.id = item && item.id ? item.id : null;
        this.publicationId = item && item.publicationId ? item.publicationId : null;
        this.vehicleType = item && item.vehicleType ? item.vehicleType : null;
        this.vehicleBodywork = item && item.vehicleBodywork ? item.vehicleBodywork : null;
        this.state = item && item.state ? item.state : null;
        this.vehicleLimit = item && item.vehicleLimit ? item.vehicleLimit : null;
        this.proposedFare = item && item.proposedFare ? item.proposedFare : null;
        this.maximumFare = item && item.maximumFare ? item.maximumFare : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.publication = item && item.publication ? item.publication : null;
        this.reports = item && item.reports ? item.reports : null;
        //this.shares = item && item.shares ? item.shares : null;
    }
}
