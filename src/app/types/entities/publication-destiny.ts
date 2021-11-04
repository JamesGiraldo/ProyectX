import { Publication } from './publication';

export class PublicationDestiny {
    id: number;
    publicationId: number;
    name: string;
    latitude: string;
    longitude: string;
    downloadDate: Date;
    createdAt: Date;
    updatedAt: Date;
    publication: Publication;
    //tripArrivals: DestinyArrival[];

    constructor(item?: PublicationDestiny) {
        this.id = item && item.id ? item.id : null;
        this.publicationId = item && item.publicationId ? item.publicationId : null;
        this.name = item && item.name ? item.name : null;
        this.latitude = item && item.latitude ? item.latitude : null;
        this.longitude = item && item.longitude ? item.longitude : null;
        this.downloadDate = item && item.downloadDate ? item.downloadDate : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.publication = item && item.publication ? item.publication : null;
        //this.tripArrivals = item && item.tripArrivals ? item.tripArrivals : null;
    }
}
