export class Assigment {
    public id: number;
    public ownerId: number;
    public isEnabled: boolean;
    public toleranceTime: string;
    public waitTime: string;
    public filters: Array<Filter>;

    constructor(item?: Assigment) {
        this.id = item && item.id ? item.id : null;
        this.ownerId = item && item.ownerId ? item.ownerId : null;
        this.isEnabled = item && item.isEnabled ? item.isEnabled : null;
        this.toleranceTime = item && item.toleranceTime ? item.toleranceTime : null;
        this.waitTime = item && item.waitTime ? item.waitTime : null;
    }
}

export class Filter extends Assigment {
    public idFilter: number;
    public aaConfigurationId: number;
    public type: string;
    public enabledTolerance: string;
    public enabledRoute: string;
    public enabledFare: string;
    public enabledResponse: string;
    public priorityTolerance: boolean;
    public priorityRoute: boolean;
    public priorityFare: boolean;
    public priorityResponse: boolean;

    constructor(item?: Filter) {
        super();
        this.idFilter = item && item.idFilter ? item.idFilter : null;
        this.aaConfigurationId = item && item.aaConfigurationId ? item.aaConfigurationId : null;
        this.enabledTolerance = item && item.enabledTolerance ? item.enabledTolerance : null;
        this.enabledRoute = item && item.enabledRoute ? item.enabledRoute : null;
        this.enabledFare = item && item.enabledFare ? item.enabledFare : null;
        this.enabledResponse = item && item.enabledResponse ? item.enabledResponse : null;
        this.priorityTolerance = item && item.priorityTolerance ? item.priorityTolerance : null;
        this.priorityRoute = item && item.priorityRoute ? item.priorityRoute : null;
        this.priorityFare = item && item.priorityFare ? item.priorityFare : null;
        this.priorityResponse = item && item.priorityResponse ? item.priorityResponse : null;
        this.type = item && item.type ? item.type : null;
    }
}
