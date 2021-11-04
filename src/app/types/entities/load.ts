import { Publication } from './publication';

export class Load {
    public id: number;
    public publicationId: number;
    public length: number;
    public width: number;
    public height: number;
    public volume: number;
    public weight: number;
    public type: string;
    public description: string;
    public code: string;
    public createdAt: Date;
    public updatedAt: Date;
    public publication: Publication;

    constructor(item?: Load) {
        this.id = item && item.id ? item.id : null;
        this.publicationId = item && item.publicationId ? item.publicationId : null;
        this.length = item && item.length ? item.length : null;
        this.width = item && item.width ? item.width : null;
        this.height = item && item.height ? item.height : null;
        this.volume = item && item.volume ? item.volume : null;
        this.weight = item && item.weight ? item.weight : null;
        this.type = item && item.type ? item.type : null;
        this.description = item && item.description ? item.description : null;
        this.code = item && item.code ? item.code : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.publication = item && item.publication ? item.publication : null;
    }
}
