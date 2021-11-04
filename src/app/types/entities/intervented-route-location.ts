import { InterventedRoute } from './intervented-route';

export class InterventedRouteLocation {
    public id: number;
    public interventedRouteId: number;
    public name: string;
    public createdAt: Date;
    public updatedAt: Date;
    public interventedRoute: InterventedRoute;

    constructor(item?: InterventedRouteLocation) {
        this.id = item && item.id ? item.id : null;
        this.interventedRouteId = item && item.interventedRouteId ? item.interventedRouteId : null;
        this.name = item && item.name ? item.name : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.interventedRoute = item && item.interventedRoute ? item.interventedRoute : null;
    }
}
