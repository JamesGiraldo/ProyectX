import { Publication } from './publication';

export class PublicationOrigin {
    id: number;
    publicationId: number;
    name: string;
    latitude: string;
    longitude: string;
    loadDate: Date;
    createdAt: Date;
    updatedAt: Date;
    publication: Publication;
    //tripArrivals: OriginArrival[];

    constructor(item?: PublicationOrigin) {
        this.id = item && item.id ? item.id : null;
        this.publicationId = item && item.publicationId ? item.publicationId : null;
        this.name = item && item.name ? item.name : null;
        this.latitude = item && item.latitude ? item.latitude : null;
        this.longitude = item && item.longitude ? item.longitude : null;
        this.loadDate = item && item.loadDate ? item.loadDate : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.publication = item && item.publication ? item.publication : null;
        //this.tripArrivals = item && item.tripArrivals ? item.tripArrivals : null;
    }
}
