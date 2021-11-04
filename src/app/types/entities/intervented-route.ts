import { Company } from './company';
import { InterventedRouteLocation } from './intervented-route-location';

export class InterventedRoute {
    public id: number;
    public generatorId: number;
    public transporterId: number;
    public createdAt: Date;
    public updatedAt: Date;
    public generator: Company;
    public transporter: Company;
    public origins: InterventedRouteLocation[];
    public destinies: InterventedRouteLocation[];

    constructor(item?: InterventedRoute) {
        this.id = item && item.id ? item.id : null;
        this.generatorId = item && item.generatorId ? item.generatorId : null;
        this.transporterId = item && item.transporterId ? item.transporterId : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.generator = item && item.generator ? item.generator : null;
        this.transporter = item && item.transporter ? item.transporter : null;
        this.origins = item && item.origins ? item.origins : null;
        this.destinies = item && item.destinies ? item.destinies : null;
    }
}
