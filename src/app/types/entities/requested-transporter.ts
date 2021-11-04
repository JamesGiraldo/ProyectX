import { Company } from './company';
import { Publication } from './publication';
import { Acceptance } from '../enums';

export class RequestedTransporter {
    id: number;
    publicationId: number;
    transporterId: number;
    state: Acceptance;
    createdAt: Date;
    updatedAt: Date;
    publication: Publication;
    transporter: Company;

    constructor(item?: RequestedTransporter) {
        this.id = item && item.id ? item.id : null;
        this.publicationId = item && item.publicationId ? item.publicationId : null;
        this.transporterId = item && item.transporterId ? item.transporterId : null;
        this.state = item && item.state ? item.state : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.publication = item && item.publication ? item.publication : null;
        this.transporter = item && item.transporter ? item.transporter : null;
    }
}
