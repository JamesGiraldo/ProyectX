import { Driver } from './driver';

export class Vehicle {
    public id: number;
    public plate: string;
    public vehicleType: VehicleType;
    public capacity: number;
    public supplierSatellite: string;
    public satelliteUser: string;
    public satellitePassword: string;
    public ownerships: Ownership[];
    public age: string;
    public drivingRecords: DrivingRecord[];

    constructor(item?: Vehicle) {
        this.id = item && item.id ? item.id : null;
        this.plate = item && item.plate ? item.plate : null;
        this.vehicleType = item && item.vehicleType ? item.vehicleType : null;
        this.capacity = item && item.capacity ? item.capacity : null;
        this.supplierSatellite = item && item.supplierSatellite ? item.supplierSatellite : null;
        this.satelliteUser = item && item.satelliteUser ? item.satelliteUser : null;
        this.satellitePassword = item && item.satellitePassword ? item.satellitePassword : null;
        this.ownerships = item && item.ownerships ? item.ownerships : null;
        this.age = item && item.age ? item.age : null;
        this.drivingRecords = item && item.drivingRecords ? item.drivingRecords : null;
    }
}

export class VehicleType {
    public id: number;
    public value: string;
    public maxTonnage: number;
}

export class Ownership {
    public ownership: string;
}

export class DrivingRecord {
    public id: number;
    public vehicleId: number;
    public driverId: number;
    public isCurrentDriver: number;
    public createdAt: Date;
    public updatedAt: Date;
    public vehicle: Vehicle;
    public driver: Driver;

    constructor(item?: DrivingRecord) {
        this.id = item && item.id ? item.id : null;
        this.vehicleId = item && item.vehicleId ? item.vehicleId : null;
        this.driverId = item && item.driverId ? item.driverId : null;
        this.isCurrentDriver = item && item.isCurrentDriver ? item.isCurrentDriver : null;
        this.createdAt = item && item.createdAt ? item.createdAt : null;
        this.updatedAt = item && item.updatedAt ? item.updatedAt : null;
        this.vehicle = item && item.vehicle ? item.vehicle : null;
        this.driver = item && item.driver ? item.driver : null;
    }
}
